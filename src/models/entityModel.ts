import { BaseModel } from './baseModel';

export class EntityModel extends BaseModel {

    constructor() {
        super();
    }

    public async saveEntityState(entity: { entity_id: string, state: string, last_updated: string, installation_id: number }): Promise<{ insert: boolean, update: boolean }> {
        const { entity_id, state, last_updated, installation_id } = entity;
        const db = await this.db;

        const now = new Date().toISOString(); // Maak er een ISO-tijdstempel van

        const query = `
        INSERT INTO entity_states (entity_id, state, last_updated, installation_id, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(entity_id, installation_id) 
        DO UPDATE SET 
            state = excluded.state, 
            last_updated = excluded.last_updated, 
            updated_at = excluded.updated_at`;

        const result = await db.run(query, [entity_id, state, last_updated, installation_id, now, now]);

        if (result.changes === 1 && result.lastID !== null) {
            // Het was een insert
            return { insert: true, update: false };
        } else {
            // Het was een update
            return { insert: false, update: true };
        }
    }


    // Functie om de historische status van een entiteit op te slaan
    public async saveEntityStateHistory(entity: { entity_id: string, state: string, last_updated: string, installation_id: number }): Promise<void> {
        const { entity_id, state, last_updated, installation_id } = entity;
        const db = await this.db;

        // Controleer of de historische status al bestaat
        const existingHistory = await db.get(
            `SELECT * FROM entity_state_history WHERE entity_id = ? AND installation_id = ? AND last_updated = ?`,
            [entity_id, installation_id, last_updated]
        );

        if (existingHistory) {
            // Update bestaande historische status als nodig
            await db.run(
                `UPDATE entity_state_history 
                 SET state = ? 
                 WHERE entity_id = ? AND installation_id = ? AND last_updated = ?`,
                [state, entity_id, installation_id, last_updated]
            );
        } else {
            // Voeg nieuwe historische status toe
            await db.run(
                `INSERT INTO entity_state_history (entity_id, state, last_updated, installation_id) 
                 VALUES (?, ?, ?, ?)`,
                [entity_id, state, last_updated, installation_id]
            );
        }
    }
}
