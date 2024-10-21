import { OnboardingStatus } from "@/constants";

// Type voor onboarding
export interface OnboardingView {
    onboarding_id: number;
    user?: UserView;
    house?: HouseView;
    installation_id?: InstallationView;
    status: OnboardingStatus;
}

export interface UserView {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    gravatarUrl: string;
}

export interface HouseView {
    name: string;
    address: string;
}

export interface InstallationView {
    code: string;
}