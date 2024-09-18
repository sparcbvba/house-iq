// src/controllers/dashboardController.ts

import { Request, Response } from 'express';
import { InstallationService } from '../services/installationService';
import logger from '../utils/logger';

export class DashboardController {
    private installationService: InstallationService;

    constructor() {
        this.installationService = new InstallationService();
    }

    public showDashboard = async (req: Request, res: Response) => {
        try {
            const installations = await this.installationService.getAllInstallations();
            res.render('dashboard', { installations });
        } catch (error) {
            logger.error('Fout bij het ophalen van installaties:', error);
            res.status(500).send('Er is een fout opgetreden bij het ophalen van de installaties.');
        }
    };
}
