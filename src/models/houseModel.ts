// src/models/HomeModel.ts
import { Home, logger } from '../utils';
import { BaseModel } from './baseModel';


/**
 * The `HouseModel` class extends the `BaseModel` and provides methods to interact with the house-related data in the database.
 * 
 * @class
 * @extends BaseModel
 * 
 * @method getAllHomes
 * Retrieves all homes from the database along with their associated main user details.
 * 
 * @returns {Promise<Home[] | undefined>} A promise that resolves to an array of Home objects or undefined if no homes are found.
 * 
 * @method getHomeWithInstallations
 * Retrieves a home along with its installations based on the provided home ID.
 * 
 * @param {number} homeId - The unique identifier of the home to retrieve.
 * @returns {Promise<Home | undefined>} A promise that resolves to the home with its installations, or undefined if not found.
 * 
 * @method createHome
 * Creates a new home entry in the database.
 * 
 * @param {Object} houseData - An object containing the address and main user ID of the house.
 * @param {string} houseData.address - The address of the house.
 * @param {number} houseData.main_user_id - The ID of the main user associated with the house.
 * @returns {Promise<void>} A promise that resolves when the home entry has been created.
 */
export class HouseModel extends BaseModel {
    constructor() {
        super();
        logger.info('HouseModel initialized');
    }


    /**
     * Retrieves all homes from the database along with their associated main user details.
     *
     * @returns {Promise<Home[] | undefined>} A promise that resolves to an array of Home objects or undefined if no homes are found.
     */
    public async getAllHomes(): Promise<Home[] | undefined> {
        const db = await this.db;
        const query = `
            SELECT h.house_id, h.address, h.main_user_id, u.first_name, u.last_name
            FROM House h
            INNER JOIN User u ON h.main_user_id = u.user_id;
        `;
        return db.get<Home[]>(query);
    }

    /**
     * Retrieves a home along with its installations based on the provided home ID.
     *
     * @param homeId - The unique identifier of the home to retrieve.
     * @returns A promise that resolves to the home with its installations, or undefined if not found.
     */
    public async getHomeWithInstallations(homeId: number): Promise<Home | undefined> {
        const db = await this.db;
        const query = `
            SELECT h.house_id, h.address, i.installation_id, i.status
            FROM Homes h
            LEFT JOIN Installations i ON h.house_id = i.house_id
            WHERE h.house_id = $1;
        `;
        return db.get<Home>(query);
    }

    /**
     * Creates a new home entry in the database.
     *
     * @param houseData - An object containing the address and main user ID of the house.
     * @param houseData.address - The address of the house.
     * @param houseData.main_user_id - The ID of the main user associated with the house.
     * @returns A promise that resolves when the home entry has been created.
     */
    public async createHome(houseData: Home): Promise<Home> {
        const db = await this.db;
        const query = `
            INSERT INTO House (address, main_user_id)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const result = await db.get<Home>(query, [houseData.address, houseData.main_user_id]);
        if (!result) {
            throw new Error('Failed to create home');
        }
        return result;
    }
}
