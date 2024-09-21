import { BaseModel } from './baseModel';

export class EntityModel extends BaseModel {

    constructor() {
        super();
    }

    // Opslaan van de huidige status van een entiteit
    public async saveEntityState(data: { entity_id: string, state: string, last_updated: string, installation_id: number }): Promise<void> {
        const db = await this.db;
        await db.run(
            `INSERT INTO entity_states (entity_id, state, last_updated, installation_id) 
            VALUES (?, ?, ?, ?) 
            ON CONFLICT(entity_id) DO UPDATE SET 
                state=excluded.state, 
                last_updated=excluded.last_updated, 
                response_time=CURRENT_TIMESTAMP`,
            [data.entity_id, data.state, data.last_updated, data.installation_id]
        );
    }

    // Opslaan van de status in de historiektabel
    public async saveEntityStateHistory(data: { entity_id: string, state: string, last_updated: string, installation_id: number }): Promise<void> {
        const db = await this.db;
        await db.run(
            `INSERT INTO entity_state_history (entity_id, state, last_updated, installation_id) 
            VALUES (?, ?, ?, ?)`,
            [data.entity_id, data.state, data.last_updated, data.installation_id]
        );
    }
}
