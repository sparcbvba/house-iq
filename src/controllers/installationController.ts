import { Request, Response } from 'express';
import { InstallationService } from '../services/installationService';
import logger from '../utils/logger';

export class InstallationController {
    private installationService: InstallationService;

    constructor() {
        this.installationService = new InstallationService();
    }

    public showInstallations = async (req: Request, res: Response) => {
        try {
            const installations = await this.installationService.getAllInstallations();
            res.render('dashboard', { installations });
        } catch (error) {
            logger.error('Fout bij het ophalen van installaties:', error);
            res.status(500).send('Er is een fout opgetreden bij het ophalen van de installaties.');
        }
    };

    public showInstallationForm = (req: Request, res: Response) => {
        res.render('installation_form');
    };

    public createInstallation = async (req: Request, res: Response) => {
        try {
            await this.installationService.createInstallation(req.body);
            res.redirect('/dashboard');
        } catch (error) {
            logger.error('Fout bij het aanmaken van een installatie:', error);
            res.status(500).send('Er is een fout opgetreden bij het aanmaken van de installatie.');
        }
    };

    public showEditForm = async (req: Request, res: Response) => {
        try {
            const installationId = parseInt(req.params.id);
            const installation = await this.installationService.getInstallationById(installationId);
            if (!installation) {
                return res.status(404).send('Installatie niet gevonden.');
            }
            res.render('installation_edit', { installation });
        } catch (error) {
            logger.error('Fout bij het ophalen van installatie:', error);
            res.status(500).send('Er is een fout opgetreden bij het ophalen van de installatie.');
        }
    };

    public updateInstallation = async (req: Request, res: Response) => {
        try {
            const installationId = parseInt(req.params.id);
            await this.installationService.updateInstallation(installationId, req.body);
            res.redirect('/dashboard');
        } catch (error) {
            logger.error('Fout bij het bijwerken van installatie:', error);
            res.status(500).send('Er is een fout opgetreden bij het bijwerken van de installatie.');
        }
    };

    public refreshInstallation = async (req: Request, res: Response) => {
        try {
            const installationId = parseInt(req.params.id, 10);

            // Haal de installatie op
            const installation = await this.installationService.getInstallationById(installationId);
            if (!installation) {
                return res.status(404).send('Installatie niet gevonden.');
            }

            // Voer de healthcheck en update check uit voor deze installatie
            await this.installationService.refreshInstallation(installation);

            res.redirect('/dashboard');
        } catch (error) {
            logger.error('Fout bij het vernieuwen van de installatie:', error);
            res.status(500).send('Er is een fout opgetreden bij het vernieuwen van de installatie.');
        }
    };
}