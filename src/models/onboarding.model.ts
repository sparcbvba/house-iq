import { BaseModel } from './base.model';
import {
    Onboarding,
    OnboardingCreateDTO,
    OnboardingUpdateDTO,
    OnboardingWithRelations,
    User,
    House,
    Installation,
} from '../interfaces';
import { logger } from '../utils';

export class OnboardingModel extends BaseModel {

    constructor() {
        super();
        logger.info('OnboardingModel initialized');
    }

    // Create a new onboarding record
    public async create(data: OnboardingCreateDTO): Promise<OnboardingWithRelations> {
        const db = await this.db;
        const result = await db.run(
            `INSERT INTO Onboarding (user_id, house_id, installation_id, status)
       VALUES (?, ?, ?, ?)`,
            data.user_id || null,
            data.house_id || null,
            data.installation_id || null,
            data.status
        );

        const onboarding_id: number | undefined = result.lastID;
        if (onboarding_id === undefined) {
            throw new Error('Failed to create onboarding record: onboarding_id is undefined');
        }
        const onboarding = await this.findById(onboarding_id);
        if (!onboarding) {
            throw new Error('Failed to create onboarding record');
        }
        return onboarding;
    }

    // Update an existing onboarding record
    public async update(
        onboarding_id: number,
        data: OnboardingUpdateDTO
    ): Promise<OnboardingWithRelations> {
        const db = await this.db;
        const fields = [];
        const values = [];

        if (data.user_id !== undefined) {
            fields.push('user_id = ?');
            values.push(data.user_id);
        }
        if (data.house_id !== undefined) {
            fields.push('house_id = ?');
            values.push(data.house_id);
        }
        if (data.installation_id !== undefined) {
            fields.push('installation_id = ?');
            values.push(data.installation_id);
        }
        if (data.status !== undefined) {
            fields.push('status = ?');
            values.push(data.status);
        }

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        values.push(onboarding_id);

        await db.run(
            `UPDATE Onboarding SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE onboarding_id = ?`,
            values
        );

        const onboarding = await this.findById(onboarding_id);
        if (!onboarding) {
            throw new Error('Onboarding record not found after update');
        }
        return onboarding;
    }

    // Find an onboarding record by ID
    public async findById(onboarding_id: number): Promise<OnboardingWithRelations | null> {
        const db = await this.db;
        const row = await db.get(
            `SELECT
          Onboarding.*,
          User.user_id AS user_user_id,
          User.first_name,
          User.last_name,
          User.email,
          User.password_hash,
          User.role,
          User.gravatarUrl,
          User.is_active AS user_is_active,
          User.created_at AS user_created_at,
          User.updated_at AS user_updated_at,
          User.last_login,
          User.is_online,
          House.house_id AS house_house_id,
          House.address,
          House.city,
          House.postal_code,
          House.country,
          House.main_user_id,
          Installation.installation_id AS installation_installation_id,
          Installation.name AS installation_name,
          Installation.installation_date,
          Installation.status AS installation_status,
          Installation.url,
          Installation.token
       FROM Onboarding
       LEFT JOIN User ON Onboarding.user_id = User.user_id
       LEFT JOIN House ON Onboarding.house_id = House.house_id
       LEFT JOIN Installation ON Onboarding.installation_id = Installation.installation_id
       WHERE Onboarding.onboarding_id = ?`,
            onboarding_id
        );

        if (!row) {
            return null;
        }

        return this.mapRowToOnboardingWithRelations(row);
    }

    // Delete an onboarding record
    async delete(onboarding_id: number): Promise<void> {
        const db = await this.db;
        await db.run(`DELETE FROM Onboarding WHERE onboarding_id = ?`, onboarding_id);
    }

    // Find onboarding records with optional filters
    public async find(filters: any = {}): Promise<OnboardingWithRelations[]> {
        const db = await this.db;
        let query = `
      SELECT
          Onboarding.*,
          User.user_id AS user_user_id,
          User.first_name,
          User.last_name,
          User.email,
          User.password_hash,
          User.role,
          User.gravatarUrl,
          User.is_active AS user_is_active,
          User.created_at AS user_created_at,
          User.updated_at AS user_updated_at,
          User.last_login,
          User.is_online,
          House.house_id AS house_house_id,
          House.address,
          House.city,
          House.postal_code,
          House.country,
          House.main_user_id,
          Installation.installation_id AS installation_installation_id,
          Installation.name AS installation_name,
          Installation.installation_date,
          Installation.status AS installation_status,
          Installation.url,
          Installation.token
      FROM Onboarding
      LEFT JOIN User ON Onboarding.user_id = User.user_id
      LEFT JOIN House ON Onboarding.house_id = House.house_id
      LEFT JOIN Installation ON Onboarding.installation_id = Installation.installation_id
    `;

        const conditions = [];
        const params = [];

        if (filters.status) {
            conditions.push('Onboarding.status = ?');
            params.push(filters.status);
        }

        if (filters.user_id) {
            conditions.push('Onboarding.user_id = ?');
            params.push(filters.user_id);
        }

        // Add more filters as needed

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const rows = await db.all(query, params);
        return rows.map((row: any) => this.mapRowToOnboardingWithRelations(row));
    }

    private mapRowToOnboardingWithRelations(row: any): OnboardingWithRelations {
        return {
            onboarding_id: row.onboarding_id,
            user_id: row.user_id,
            house_id: row.house_id,
            installation_id: row.installation_id,
            status: row.status,
            created_at: row.created_at,
            updated_at: row.updated_at,
            user: row.user_user_id
                ? {
                    user_id: row.user_user_id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    email: row.email,
                    password_hash: row.password_hash,
                    role: row.role,
                    gravatarUrl: row.gravatarUrl,
                    is_active: !!row.user_is_active,
                    created_at: row.user_created_at,
                    updated_at: row.user_updated_at,
                    last_login: row.last_login,
                    is_online: !!row.is_online,
                }
                : undefined,
            house: row.house_house_id
                ? {
                    house_id: row.house_house_id,
                    address: row.address,
                    city: row.city,
                    postal_code: row.postal_code,
                    country: row.country,
                    main_user_id: row.main_user_id,
                }
                : undefined,
            installation: row.installation_installation_id
                ? {
                    installation_id: row.installation_installation_id,
                    house_id: row.house_id,
                    name: row.installation_name,
                    installation_date: row.installation_date,
                    status: row.installation_status,
                    url: row.url,
                    token: row.token,
                }
                : undefined,
        };
    }
}
