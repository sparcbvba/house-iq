import { Request, Response } from 'express';
import { InstallationService } from '../services';
import { HealthCheckModel } from '../models'; // Voeg de healthcheck import toe
import { logger } from '../utils'

export class DashboardController {
    private installationService: InstallationService;
    private healthCheckModel: HealthCheckModel;

    constructor() {
        this.installationService = new InstallationService();
        this.healthCheckModel = new HealthCheckModel();
    }

    public showDashboard = async (req: Request, res: Response) => {
        try {
            const installations = await this.installationService.getAllInstallations();
            const installationsWithHealthCheck = [];

            for (const installation of installations) {
                const lastHealthCheck = await this.healthCheckModel.getLastHealthCheck(installation.id);
                installationsWithHealthCheck.push({
                    ...installation,
                    lastHealthCheck,
                });
            }

            res.render('dashboard', { installations: installationsWithHealthCheck });
        } catch (error) {
            logger.error('Fout bij het ophalen van installaties en health checks:', error);
            res.status(500).send('Er is een fout opgetreden bij het ophalen van de installaties.');
        }
    }
}
