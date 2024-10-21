import { User, House, Installation } from "./";

// Represents the Onboarding entity as stored in the database
export interface Onboarding {
    onboarding_id: number;
    user_id: number | null;
    house_id: number | null;
    installation_id: number | null;
    status: 'pending' | 'cancelled' | 'completed';
    created_at: string;
    updated_at: string;
}

// Data Transfer Object for creating a new Onboarding record
export interface OnboardingCreateDTO {
    user_id?: number | null;
    house_id?: number | null;
    installation_id?: number | null;
    status: 'pending' | 'cancelled' | 'completed';
}

// Data Transfer Object for updating an Onboarding record
export interface OnboardingUpdateDTO {
    user_id?: number | null;
    house_id?: number | null;
    installation_id?: number | null;
    status?: 'pending' | 'cancelled' | 'completed';
}

// Onboarding with related entities
export interface OnboardingWithRelations extends Onboarding {
    user?: User;
    house?: House;
    installation?: Installation;
}
