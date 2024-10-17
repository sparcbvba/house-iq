import { IInstallationService } from './interfaces';
import { InstallationModel } from '../models/installationModel';
import { Installation } from '../utils/types';
import { logger } from '../utils';

/**
 * Service class for managing installations.
 * 
 * @class InstallationService
 * @description Provides methods to interact with the installation model, including
 * retrieving, creating, updating, and getting installation links.
 */
export class InstallationService implements IInstallationService {
    private installationModel: InstallationModel = new InstallationModel;

    constructor() {
        logger.info('InstallationService initialized');
    }

    /**
     * Retrieves the installation link for a given installation ID.
     *
     * @param id - The unique identifier of the installation.
     * @returns A promise that resolves to the installation URL if found, otherwise undefined.
     */
    public async getInstallationLink(id: number): Promise<string | undefined> {
        const installation = await this.installationModel.getInstallationById(id);
        return installation?.url;
    }

    /**
     * Retrieves all installations.
     *
     * @returns {Promise<Installation[]>} A promise that resolves to an array of Installation objects.
     */
    public async getAllInstallations(): Promise<Installation[]> {
        return this.installationModel.getAllInstallations();
    }

    /**
     * Retrieves an installation by its unique identifier.
     *
     * @param id - The unique identifier of the installation.
     * @returns A promise that resolves to the installation object if found, otherwise undefined.
     */
    public async getInstallationById(id: number): Promise<Installation | undefined> {
        return this.installationModel.getInstallationById(id);
    }

    /**
     * Creates a new installation with the provided data.
     *
     * @param data - Partial data for the installation.
     * @returns A promise that resolves when the installation is created.
     */
    public async createInstallation(data: Partial<Installation>): Promise<Installation | undefined> {
        const newInstallation = await this.installationModel.createInstallation(data);
        return newInstallation;
    }

    /**
     * Updates an installation with the given data.
     *
     * @param id - The unique identifier of the installation to update.
     * @param data - A partial object containing the installation properties to update.
     * @returns A promise that resolves when the update is complete.
     */
    public async updateInstallation(id: number, data: Partial<Installation>): Promise<void> {
        await this.installationModel.updateInstallation(id, data);
    }

}