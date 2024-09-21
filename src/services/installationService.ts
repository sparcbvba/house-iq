import { performHealthCheck } from '../healthCheck';
import { InstallationModel } from '../models/installationModel';
import { Installation } from '../utils/types';
import logger from '../utils/logger';

export class InstallationService {
    private installationModel: InstallationModel;

    constructor() {
        this.installationModel = new InstallationModel();
    }
    
    public getInstallationLink(installation: Installation): string {
        return installation.url;
    }    

    public async getAllInstallations(): Promise<Installation[]> {
        return this.installationModel.getAllInstallations();
    }

    public async getInstallationById(id: number): Promise<Installation | undefined> {
        return this.installationModel.getInstallationById(id);
    }

    public async createInstallation(data: any): Promise<void> {
        const installationData: Partial<Installation> = {
            name: data.name,
            url: data.url,
            street: data.street,
            number: data.number,
            postal_code: data.postal_code,
            city: data.city,
            country: data.country,
        };
        await this.installationModel.createInstallation(installationData);
    }

    public async updateInstallation(id: number, data: any): Promise<void> {
        const installationData: Partial<Installation> = {
            name: data.name,
            url: data.url,
            street: data.street,
            number: data.number,
            postal_code: data.postal_code,
            city: data.city,
            country: data.country,
        };
        await this.installationModel.updateInstallation(id, installationData);
    }

    public async refreshInstallation(installation: Installation): Promise<void> {
        try {
            // Voer de healthcheck en update check uit
            performHealthCheck(installation, this.installationModel);
        } catch (error) {
            logger.error(`Fout bij het handmatig vernieuwen van installatie ID ${installation.id}:`, error);
            throw error;
        }
    }

}