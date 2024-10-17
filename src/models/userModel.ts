// src/models/userModel.ts
import { logger } from '../utils';
import { AppUser } from '../utils/types';
import { BaseModel } from './baseModel';

export class UserModel extends BaseModel {

    constructor() {
        super();
        logger.info('UserModel initialized');
    }

    public async getAllUsers(): Promise<AppUser[] | undefined> {
        const db = await this.db;
        return db.all<AppUser[]>('SELECT * FROM User');
    }

    public async getUserByEmail(email: string): Promise<AppUser | undefined> {
        const db = await this.db;
        return db.get<AppUser>('SELECT * FROM User WHERE email = ?', [email]);
    }

    public async saveGravatarUrl(url: string, userId: number): Promise<void> {
        const db = await this.db;
        const query = `UPDATE User SET gravatarUrl = ? WHERE user_id = ?`;
        await db.run(query, [url, userId]);
    }


    public async updateUserLastLogin(userId: number): Promise<void> {
        const db = await this.db;
        const query = `UPDATE User SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?`;
        await db.run(query, [userId]);
    }


    public async getUserDetailById(id: number): Promise<AppUser | undefined> {
        const db = await this.db;
        return db.get<AppUser>('SELECT * FROM User WHERE user_id = ?', [id]);
    }

    public async updateUserStatus(id: number, online: boolean): Promise<void> {
        const db = await this.db;
        const query = `UPDATE User SET is_online = ? WHERE user_id = ?`;
        await db.run(query, [online, id]);
    }

    public async createUser(user: Partial<AppUser>): Promise<number | undefined> {
        const db = await this.db;
        const { email, password_hash, first_name, last_name, role, gravatarUrl } = user;
        const result = await db.run(
            `INSERT INTO User (email, password_hash, first_name, last_name, role, is_active, gravatarUrl) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [email, password_hash, first_name, last_name, role, true, gravatarUrl]
        );

        // Retourneer het ID van de nieuw aangemaakte gebruiker
        return result.lastID;
    }

    public async removeAllUsers(): Promise<any> {
        const db = await this.db;
        return db.run('DELETE FROM User');
    }
}
