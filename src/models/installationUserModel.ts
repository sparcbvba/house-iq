// src/models/installationUserModel.ts
import { BaseModel } from './baseModel';
import { InstallationUser } from '../utils/types';

export class InstallationUserModel extends BaseModel {
    constructor() {
        super();
    }

    public async getUserById(id: number): Promise<InstallationUser | undefined> {
        const db = await this.db;
        return db.get<InstallationUser>(`SELECT * FROM installation_users WHERE id = $1 AND active = true`, [id]);
    }

    public async getUsersByInstallationId(installationId: number): Promise<InstallationUser[]> {
        const db = await this.db;
        return db.all<InstallationUser[]>(
            `SELECT * FROM installation_users WHERE installation_id = $1 AND active = true`,
            [installationId]
        );
    }

    public async createUser(user: Partial<InstallationUser>): Promise<number> {
        const db = await this.db;
        const result = await db.run(
            `INSERT INTO installation_users (installation_id, username, password, type, longlivingtoken) 
            VALUES (?, ?, ?, ?, ?)`,
            [user.installation_id, user.username, user.password, user.type, user.longlivingtoken]
        );
    
        // Retourneer het ID van de nieuw aangemaakte gebruiker
        return result.lastID as number;
    }

    public async deactivateUser(userId: number): Promise<void> {
        const db = await this.db;
        await db.run('UPDATE installation_users SET active = false WHERE id = $1', [userId]);
    }
    
        
    

    public async updateUser(id: number, user: Partial<InstallationUser>): Promise<void> {
        const db = await this.db;
        const { username, password, type, longlivingtoken } = user;
        await db.run(
            `UPDATE installation_users SET username = ?, password = ?, type = ?, longlivingtoken = ? WHERE id = ?`,
            [username, password, type, longlivingtoken, id]
        );
    }

    public async getPreferredUserByInstallationId(installationId: number): Promise<InstallationUser | undefined> {
        const db = await this.db;
        return db.get<InstallationUser>(
            'SELECT * FROM installation_users WHERE installation_id = ? AND preferred = 1 AND longlivingtoken IS NOT NULL LIMIT 1',
            [installationId]
        );
    }

    public async setPreferredUser(userId: number, installationId: number): Promise<void> {
        const db = await this.db;

        // Start een transactie
        await db.exec('BEGIN TRANSACTION');

        try {
            // Zet 'preferred' op 0 voor alle gebruikers van de installatie
            await db.run(
                'UPDATE installation_users SET preferred = 0 WHERE installation_id = ?',
                [installationId]
            );

            // Zet 'preferred' op 1 voor de geselecteerde gebruiker
            await db.run(
                'UPDATE installation_users SET preferred = 1 WHERE id = ?',
                [userId]
            );

            // Commit de transactie
            await db.exec('COMMIT');
        } catch (error) {
            // Rollback bij fout
            await db.exec('ROLLBACK');
            throw error;
        }
    }
}
