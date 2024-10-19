// src/interfaces/IOnboardingModel.ts

import { OnboardingStatus } from '@/constants';
import { Onboarding } from '@/utils';

export interface IOnboardingModel {
    /**
     * Retrieves all onboarding records with the specified status.
     *
     * @param {OnboardingStatus} status - The status of the onboarding records to retrieve.
     * @returns {Promise<any[]>} A promise that resolves to an array of onboarding records with the specified status.
     */
    getAllByStatus(status: OnboardingStatus): Promise<any[]>;
    create(onboardingData: { user_id: number; step: string; status: string; }): Promise<Onboarding>;
    getById(onboardingId: number): Promise<any>;
    update(onboardingData: Onboarding): Promise<void>;
    getCurrentStep(onboardingId: number): Promise<string>
}