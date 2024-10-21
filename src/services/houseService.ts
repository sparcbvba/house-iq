


// src/services/HouseService.ts
import { Home, logger } from '../utils';
import { HouseModel } from '../models';

/**
 * Service class for managing house-related operations.
 * This class interacts with the HouseModel to perform CRUD operations on house data.
 */
export class HouseService {
    private HouseModel: HouseModel;

    constructor() {
        this.HouseModel = new HouseModel();
        logger.info('HouseService initialized');
    }

    /**
     * Haal alle bestaande huizen op
     * @returns Een lijst van huizen met hun gegevens
     */
    public async getAllHomes(): Promise<any> {
        try {
            // Roep de HouseModel aan om de query naar de database uit te voeren
            const homes = await this.HouseModel.getAllHomes();
            return homes;  // Return de lijst van huizen
        } catch (error) {
            console.error('Error in HouseService getAllHomes:', error);
            throw new Error('Kon de lijst met huizen niet ophalen.');
        }
    }

    /**
     * Maak een nieuw huis aan
     * @param houseData Gegevens van het huis
     * @returns Het aangemaakte huis
     */
    public async createHome(houseData: Home): Promise<any> {
        try {
            // Roep de HouseModel aan om een nieuw huis aan te maken
            const newHome = await this.HouseModel.createHome(houseData);
            return newHome;  // Return het aangemaakte huis
        } catch (error) {
            console.error('Error in HouseService createHome:', error);
            throw new Error('Kon het huis niet aanmaken.');
        }
    }
}
