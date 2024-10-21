import { Installation, logger } from '../utils';
import { BaseModel } from './base.model';

export class InstallationModel extends BaseModel {

    constructor() {
        super();
        logger.info('InstallationModel initialized');
    }

    public async getInstallationById(id: number): Promise<Installation | undefined> {
        const db = await this.db;
        return db.get<Installation>('SELECT * FROM installations WHERE id = ?', [id]);
    }

    public async getAllInstallations(): Promise<Installation[]> {
        const db = await this.db;
        return db.all<Installation[]>('SELECT * FROM installations');
    }

    public async createInstallation(installation: Partial<Installation>): Promise<Installation | undefined> {
        const db = await this.db;
        const { name, url } = installation;
        // const result = await db.run(
        //     `INSERT INTO installations (name, url, street, number, postal_code, city, country) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        //     [name, url, street, number, postal_code, city, country]
        // );
        // const newInstallationId = result.lastID;
        // if (typeof newInstallationId === 'number') {
        //     return this.getInstallationById(newInstallationId);
        // }
        throw new Error('Failed to create installation: newInstallationId is undefined');
    }

    public async updateInstallation(id: number, installation: Partial<Installation>): Promise<void> {
        const db = await this.db;
        // const { name, url, street, number, postal_code, city, country } = installation;
        // await db.run(
        //     `UPDATE installations SET name = ?, url = ?, street = ?, number = ?, postal_code = ?, city = ?, country = ? WHERE id = ?`,
        //     [name, url, street, number, postal_code, city, country, id]
        // );
    }

    public async updateInstallationStatus(id: number, status: string): Promise<void> {
        const db = await this.db;
        await db.run(`UPDATE installations SET status = ? WHERE id = ?`, [status, id]);
    }

    public async updateInstallationUpdateStatus(id: number, updateAvailable: number): Promise<void> {
        const db = await this.db;
        await db.run(
            `UPDATE installations SET update_available = ? WHERE id = ?`,
            [updateAvailable, id]
        );
    }

    public async updateInstallationVersions(id: number, installedVersion: string, latestVersion: string): Promise<void> {
        const db = await this.db;
        await db.run(
            `UPDATE installations SET installed_version = ?, latest_version = ? WHERE id = ?`,
            [installedVersion, latestVersion, id]
        );
    }

    public async resetInstallationVersions(id: number): Promise<void> {
        const db = await this.db;
        await db.run(
            `UPDATE installations SET installed_version = 'onbekend', latest_version = 'onbekend' WHERE id = ?`,
            [id]
        );
    }

    // Update de tijd van de laatste entiteitenophaling
    public async updateLastEntityFetch(installationId: number, lastEntityFetch: string): Promise<void> {
        const db = await this.db;
        await db.run(
            `UPDATE installations SET last_entity_fetch = ? WHERE id = ?`,
            [lastEntityFetch, installationId]
        );
    }

    // Functie om het aantal actieve update sensoren bij te werken
    public async updateActiveUpdateSensors(installationId: number, activeUpdateCount: number): Promise<void> {
        const db = await this.db;
        await db.run(
            `UPDATE installations SET active_update_sensors = ? WHERE id = ?`,
            [activeUpdateCount, installationId]
        );
    }
}


