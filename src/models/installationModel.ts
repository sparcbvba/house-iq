import { Installation } from '../utils';
import { BaseModel } from './baseModel';

export class InstallationModel extends BaseModel {

    constructor() {
        super();
    }

    public async getInstallationById(id: number): Promise<Installation | undefined> {
        const db = await this.db;
        return db.get<Installation>('SELECT * FROM installations WHERE id = ?', [id]);
    }    

    public async getAllInstallations(): Promise<Installation[]> {
        const db = await this.db;
        return db.all<Installation[]>('SELECT * FROM installations');
    }

    public async createInstallation(installation: Partial<Installation>): Promise<void> {
        const db = await this.db;
        const { name, url, street, number, postal_code, city, country } = installation;
        await db.run(
            `INSERT INTO installations (name, url, street, number, postal_code, city, country) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, url, street, number, postal_code, city, country]
        );
    }

    public async updateInstallation(id: number, installation: Partial<Installation>): Promise<void> {
        const db = await this.db;
        const { name, url, street, number, postal_code, city, country } = installation;
        await db.run(
            `UPDATE installations SET name = ?, url = ?, street = ?, number = ?, postal_code = ?, city = ?, country = ? WHERE id = ?`,
            [name, url, street, number, postal_code, city, country, id]
        );
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
}


