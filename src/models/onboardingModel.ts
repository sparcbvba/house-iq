import { BaseModel } from './baseModel'; // Adjust the path as necessary
import { Onboarding } from '../utils/types';
import { logger } from '../utils';

export class OnboardingModel extends BaseModel {

    constructor() {
        super();
        logger.info('OnboardingModel initialized');
    }

    // Maak een nieuw record aan voor onboarding
    public async create(onboardingData: { user_id: number; step: string; status: string; }): Promise<number | undefined> {
        const db = await this.db;
        const query = `
            INSERT INTO Onboarding (user_id, step, status)
            VALUES (?, ?, ?)
        `;
        const result = await db.run(query, [onboardingData.user_id, onboardingData.step, onboardingData.status]);
        return result.lastID;  // Retourneer het ID van het aangemaakte record
    }

    // Haal een onboarding record op via het ID
    public async getById(onboardingId: number): Promise<any> {
        const db = await this.db;
        const query = `
            SELECT * FROM Onboarding
            WHERE onboarding_id = ?
        `;
        const result = await db.get(query, [onboardingId]);
        return result;  // Retourneer het gevonden record
    }

    // Update de status van een stap in het onboardingproces
    public async update(onboardingData: Onboarding): Promise<void> {
        const db = await this.db;
        const query = `
            UPDATE Onboarding
            SET house_id = COALESCE(?, house_id),
                installation_id = COALESCE(?, installation_id),
                step = ?,
                status = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE onboarding_id = ?
        `;
        await db.run(query, [
            onboardingData.house_id || null,
            onboardingData.installation_id || null,
            onboardingData.step,
            onboardingData.status,
            onboardingData.onboarding_id
        ]);
    }

    // Haal de huidige status van het onboardingproces op
    public async getCurrentStep(onboardingId: number): Promise<string> {
        const db = await this.db;
        const query = `
            SELECT step FROM Onboarding
            WHERE onboarding_id = ?
        `;
        const result = await db.get(query, [onboardingId]);
        return result?.step || 'unknown';  // Retourneer de huidige stap of 'unknown' als het ID niet bestaat
    }
}
