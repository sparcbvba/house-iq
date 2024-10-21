// src/interfaces/IOnboardingService.ts
import { Onboarding, OnboardingCreateDTO, OnboardingUpdateDTO, OnboardingWithRelations } from '../../interfaces';

export interface IOnboardingService {
    createOnboarding(data: OnboardingCreateDTO): Promise<Onboarding>;
    getOnboardingById(onboarding_id: number): Promise<OnboardingWithRelations | null>;
    updateOnboarding(onboarding_id: number, data: OnboardingUpdateDTO): Promise<Onboarding>;
    deleteOnboarding(onboarding_id: number): Promise<void>;
    getOnboardings(filters: any): Promise<OnboardingWithRelations[]>;
}
