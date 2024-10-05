import { Request, Response } from 'express';
import { Views } from '../constants/viewConstants';
import { HouseService } from "../services";

export class HouseController {
    private houseService: HouseService;

    constructor() {
        this.houseService = new HouseService();
    }

    public showCreateHouseForm = (req: Request, res: Response) => {
        res.render(Views.HOUSES.NEW, { title: "Create new House" });
    };

    public showHouses = (req: Request, res: Response) => {
        res.render(Views.HOUSES.OVERVIEW, { title: "Houses" });
    };

    public showEditHouseForm = (req: Request, res: Response) => {
        res.render(Views.HOUSES.MANAGE, { title: "Edit House" });
    };
}