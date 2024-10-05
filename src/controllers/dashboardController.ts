import { NextFunction, Request, Response } from 'express';
import { PermissionService } from '../services/permissionService';
import { HouseService } from '../services';

export class DashboardController {

    private homeService: HouseService;

    constructor() {
        this.homeService = new HouseService();
    }

    public showDashboard = async (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.session.user?.role;
        const userId = req.session.user?.user_id;

        const options = { data: undefined };

        const view = PermissionService.getViewForRole(userRole)

        if (!view) return next('no view found');

        if (userRole === 'admin') {
            // Admin: Haal alle huizen en installaties op
            const homes = await this.homeService.getAllHomes();
            options.data = homes;


        } else if (userRole === 'home_owner') {


        } else if (userRole === 'home_viewer') {

        } else {
            // Onbekende rol of geen toegang
            return res.status(403).send('Toegang geweigerd');
        }

        res.render(view, options);
    }
}
