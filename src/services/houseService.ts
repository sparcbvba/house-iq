// src/services/HouseService.ts
import { HouseModel } from '../models';

export class HouseService {
    private HouseModel: HouseModel;

    constructor() {
        this.HouseModel = new HouseModel();
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
}
