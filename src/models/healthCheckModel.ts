import { BaseModel } from './baseModel';


export class HealthCheckModel extends BaseModel {
    constructor() {
        super();
    }

    public async saveHealthCheckData(installationId: number, status: string, duration: number): Promise<void> {
        const db = await this.db;
        await db.run(
            `INSERT INTO healthcheck_data (installation_id, status, duration) 
            VALUES (?, ?, ?)`,
            [installationId, status, duration]
        );
    }

    public async getHealthCheckDataByInstallation(installationId: number): Promise<any[]> {
        const db = await this.db;
        return db.all(
            `SELECT * FROM healthcheck_data WHERE installation_id = ? ORDER BY timestamp DESC`,
            [installationId]
        );
    }

    public async getLastHealthCheck(installationId: number): Promise<any> {
        const db = await this.db;
        return db.get(
            `SELECT * FROM healthcheck_data WHERE installation_id = ? ORDER BY timestamp DESC LIMIT 1`,
            [installationId]
        );
    }
    
}
