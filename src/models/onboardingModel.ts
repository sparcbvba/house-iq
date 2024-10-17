import { BaseModel } from './baseModel'; // Adjust the path as necessary
import { Onboarding } from '../utils/types';
import { logger } from '../utils';
import { OnboardingStatus } from '@/constants';

export class OnboardingModel extends BaseModel {

    constructor() {
        super();
        logger.info('OnboardingModel initialized');
    }

    // Haal alle onboarding records op met een specifieke status
    /**
     * Retrieves all onboarding records with the specified status.
     *
     * @param {OnboardingStatus} status - The status of the onboarding records to retrieve.
     * @returns {Promise<any[]>} A promise that resolves to an array of onboarding records with the specified status.
     */
    public async getAllByStatus(status: OnboardingStatus): Promise<any[]> {
        const db = await this.db;
        const query = `
            SELECT * FROM Onboarding
            WHERE status = ?
        `;
        const results = await db.all(query, [status]);
        return results;  // Retourneer de gevonden records
    }

    // Maak een nieuw record aan voor onboarding
    /**
     * Creates a new onboarding record in the database.
     *
     * @param onboardingData - An object containing the user ID, step, and status for the onboarding process.
     * @param onboardingData.user_id - The ID of the user.
     * @param onboardingData.step - The current step of the onboarding process.
     * @param onboardingData.status - The status of the onboarding process.
     * @returns A promise that resolves to the ID of the newly created record, or undefined if the operation fails.
     */
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
