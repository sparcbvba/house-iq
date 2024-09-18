/* Module-augmentatie voor express-session */
import 'express-session';

export interface Installation {
    id: number;
    name: string;
    url: string;
    street: string;
    number: string;
    postal_code: string;
    city: string;
    country: string;
    status: string;
    update_available: number; // 0 of 1
    installed_version: string;
    latest_version: string;
}


// src/utils/types.ts

// Type voor applicatiegebruikers
export interface AppUser {
    id: number;
    username: string;
    email: string;
    password: string;
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


// Type voor de gebruiker in de sessie
export interface SessionUser {
    id: number;
    username: string;
    email: string;
}


declare module 'express-session' {
    interface SessionData {
        user?: SessionUser;
    }
}

