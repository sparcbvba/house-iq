/* Module-augmentatie voor express-session */
import { OnboardingStatus } from '../constants';
import 'express-session';

export interface MenuItem {
    name: string;
    path: string;
    permissions: string[];
}

export interface Installation {
    installation_id: number;
    house_id: number;
    name: string;
    installation_date: Date;
    status: string;
    url: string;
    token: string;
    code: string;
}

// src/utils/types.ts

// Type voor applicatiegebruikers
export interface AppUser {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    role: string;
    gravatarUrl: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    last_login: Date;
    last_login_locale: string;
    is_online: boolean;
}

// Type voor onboarding
export interface Onboarding {
    onboarding_id: number;
    user_id: number | null;
    house_id: number | null;
    installation_id: number | null;
    status: OnboardingStatus;
    created_at?: Date;
    updated_at?: Date;
}

// Type voor installatiegebruikers
export interface InstallationUser {
    id: number;
    installation_id: number;
    username: string;
    password: string;
    type: string;
    longlivingtoken: string;
    preferred: number; // 0 of 1
}

export interface Home {
    house_id?: number;
    name?: string;
    main_user_id: number;
    address: string;
    first_name: string;
    last_name: string;
}

// Type voor de gebruiker in de sessie
export interface SessionUser {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    role: string;
    is_active: boolean;
}

// Definieer de interface voor de "attributes" van een entiteit
export interface EntityAttributes {
    editable: boolean;
    id: string;
    device_trackers?: string[];
    latitude?: number;
    longitude?: number;
    gps_accuracy?: number;
    source?: string;
    user_id?: string;
    entity_picture?: string;
    friendly_name: string;
    apple_carplay_connected?: boolean;
    auto_update?: boolean;
    installed_version?: string;
    in_progress?: boolean;
    latest_version?: string;
    release_summary?: string | null;
    release_url?: string | null;
    skipped_version?: string | null;
    title?: string;
    supported_features?: number;
    state_class?: string;
    unit_of_measurement?: string;
    device_class?: string;
}

// Definieer de interface voor een entiteit
export interface Entity {
    entity_id: string;
    state: string;
    attributes: EntityAttributes;
    last_changed: string;
    last_reported?: string;
    last_updated: string;
    context: {
        id: string;
        parent_id: string | null;
        user_id: string | null;
    };
}

// Interface voor een API-response van meerdere entiteiten
export type EntityResponse = Entity[];

declare module 'express-session' {
    interface SessionData {
        user?: SessionUser;
    }
}

