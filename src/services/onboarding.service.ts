// src/services/OnboardingService.ts
import { OnboardingModel } from '../models';
import {
    Onboarding,
    OnboardingCreateDTO,
    OnboardingUpdateDTO,
    OnboardingWithRelations,
} from '../interfaces';
import { IOnboardingService } from './interfaces';

export class OnboardingService implements IOnboardingService {
    private onboardingModel: OnboardingModel;

    constructor() {
        this.onboardingModel = new OnboardingModel();
    }

    // Create a new onboarding
    public async createOnboarding(data: OnboardingCreateDTO): Promise<OnboardingWithRelations> {
        // Perform any necessary validation or business logic here
        return await this.onboardingModel.create(data);
    }

    // Get an onboarding by ID
    async getOnboardingById(onboarding_id: number): Promise<OnboardingWithRelations | null> {
        return await this.onboardingModel.findById(onboarding_id);
    }

    // Update an existing onboarding
    public async updateOnboarding(
        onboarding_id: number,
        data: OnboardingUpdateDTO
    ): Promise<OnboardingWithRelations> {
        // Perform any necessary validation or business logic here
        return await this.onboardingModel.update(onboarding_id, data);
    }

    // Delete an onboarding
    async deleteOnboarding(onboarding_id: number): Promise<void> {
        await this.onboardingModel.delete(onboarding_id);
    }

    // Get onboardings based on filters
    async getOnboardings(filters: any): Promise<OnboardingWithRelations[]> {
        // Validate and process filters as needed
        return await this.onboardingModel.find(filters);
    }
}
