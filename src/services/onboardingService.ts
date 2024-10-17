import { OnboardingStatus, OnboardingSteps } from "../constants";
import { OnboardingModel } from "../models/onboardingModel";
import { Home, Installation, logger, Onboarding } from "../utils";
import { HouseService, InstallationService } from "./";
import { IInstallationService } from "./interfaces";

export class OnboardingService {
    private onboardingModel: OnboardingModel = new OnboardingModel();
    private houseService: HouseService = new HouseService();
    private installationService: IInstallationService = new InstallationService();

    constructor() {
        logger.info('OnboardingService initialized');
    }

    /**
     * Retrieves the current step of the onboarding process for a given onboarding ID.
     *
     * @param onboardingId - The unique identifier of the onboarding process.
     * @returns A promise that resolves to a string representing the current step of the onboarding process.
     */
    public async getCurrentStep(onboardingId: number): Promise<string> {
        const onboarding = await this.onboardingModel.getById(onboardingId);
        return onboarding.step;
    }

    public async register(email: string, password: string, first_name: string, last_name: string, role?: string): Promise<number> {
        return 1;
    }

    /**
     * Updates the current step of the onboarding process for a given onboarding ID.
     * 
     * @param onboardingId - The unique identifier of the onboarding record.
     * @param step - The current step of the onboarding process.
     * @throws Will throw an error if the onboarding record is not found.
     * @returns A promise that resolves when the onboarding step and status have been updated.
     */
    private async updateStep(onboardingId: number, step: OnboardingSteps, data: Partial<Onboarding>): Promise<void> {
        const onboarding = await this.onboardingModel.getById(onboardingId);
        if (!onboarding) {
            throw new Error('Onboarding record not found.');
        }

        let status: OnboardingStatus;
        if (step === OnboardingSteps.COMPLETED) {
            status = OnboardingStatus.COMPLETED;
        } else {
            status = OnboardingStatus.IN_PROGRESS;
        }

        Object.assign(onboarding, data, { status });
        await this.onboardingModel.update(onboarding);
    }

    /**
     * Creates a new user and updates the onboarding step to HOUSE_CREATION.
     *
     * @param user_id - The unique identifier of the user.
     * @returns A promise that resolves when the user creation process is complete.
     */
    public async createUser(user_id: number): Promise<void> {
        // Assuming some user creation logic here
        const userData = { user_id: user_id };

        // Update the onboarding step to HOUSE_CREATION
        await this.updateStep(user_id, OnboardingSteps.HOUSE_CREATION, userData);
    }

    // Voeg een huis toe (Stap 2 in het proces)
    /**
     * Adds a house to the onboarding process.
     *
     * @param onboardingId - The ID of the onboarding process.
     * @param houseData - The data of the house to be added.
     * @throws Will throw an error if the onboarding step is not 'user_created' or the status is not 'completed'.
     * @returns A promise that resolves when the house has been successfully added.
     */
    public async addHouse(onboardingId: number, houseData: Home): Promise<void> {
        const onboarding = await this.onboardingModel.getById(onboardingId);
        if (onboarding.step !== OnboardingSteps.CREATE_USER || onboarding.status !== OnboardingStatus.COMPLETED) {
            throw new Error('Eerst moet de gebruiker worden aangemaakt.');
        }

        const house = await this.houseService.createHome(houseData);

        // Update the onboarding step to HOUSE_CREATED
        await this.updateStep(onboardingId, OnboardingSteps.HOUSE_CREATION, { house_id: house.house_id });
    }

    // Voeg een installatie toe aan het huis (Stap 3)
    /**
     * Adds an installation to the onboarding process.
     *
     * @param {number} onboardingId - The ID of the onboarding process.
     * @param {Installation} installation - The installation details to be added.
     * @returns {Promise<void>} A promise that resolves when the installation is added.
     * @throws {Error} If the onboarding step is not 'house_created' or the status is not 'completed'.
     * @throws {Error} If the installation creation fails.
     */
    public async addInstallation(onboardingId: number, installation: Installation): Promise<void> {
        const onboarding = await this.onboardingModel.getById(onboardingId);
        if (onboarding.step !== 'house_created' || onboarding.status !== 'completed') {
            throw new Error('Eerst moet het huis worden aangemaakt.');
        }

        const result = await this.installationService.createInstallation(installation);
        if (!result) {
            throw new Error('Installation creation failed.');
        }
        await this.updateStep(onboardingId, OnboardingSteps.INSTALLATION_ADDITION, { installation_id: result.id });
    }

    // Verifieer installatie (Stap 4: Controleer sensordata in InfluxDB)
    public async verifyInstallation(onboardingId: number): Promise<void> {
        const onboarding = await this.onboardingModel.getById(onboardingId);
        if (onboarding.step !== 'installation_added' || onboarding.status !== 'completed') {
            throw new Error('Eerst moet de installatie worden toegevoegd.');
        }

        //TODO: use installation service and updatestep

        console.log('Onboarding succesvol afgerond.');
    }





}