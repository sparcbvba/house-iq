// src/models/EnergyModel.ts
import { BaseModel } from './baseModel';

export class EnergyModel extends BaseModel {

    constructor() {
        super();
    }

    // Haal energieverbruik op voor de gebruiker (home_owner)
    public async getEnergyConsumption(userId: number): Promise<any> {
        const db = await this.db;  // Haal de databaseverbinding op via BaseModel
        const query = `
            SELECT h.house_id, h.address, e.energy_consumption
            FROM Homes h
            INNER JOIN EnergyData e ON h.house_id = e.house_id
            WHERE h.owner_id = $1;
        `;
        const result = await db.run(query, [userId]);
        return result;  // Return een lijst van energieverbruiken per huis
    }
}
