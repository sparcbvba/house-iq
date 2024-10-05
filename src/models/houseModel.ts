// src/models/HomeModel.ts
import { Home } from '../utils';
import { BaseModel } from './baseModel';


export class HouseModel extends BaseModel {

    constructor() {
        super();
    }

    // Haal een overzicht op van alle huizen
    public async getAllHomes(): Promise<Home[] | undefined> {
        const db = await this.db;
        const query = `
            SELECT h.house_id, h.address, h.main_user_id, u.first_name, u.last_name
            FROM House h
            INNER JOIN User u ON h.main_user_id = u.user_id;
        `;
        return db.get<Home[]>(query);
    }

    // Optioneel: Haal een huis en bijbehorende installaties op
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
}
