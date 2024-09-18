// src/services/authService.ts

import { UserModel } from '../models/userModel';
import { AppUser, SessionUser } from '../utils/types';
import { hashPassword, comparePassword } from '../utils/encryption';

export class AuthService {
    private userModel: UserModel;

    constructor() {
        this.userModel = new UserModel();
    }

    public async authenticate(username: string, password: string): Promise<SessionUser | null> {
        const user = await this.userModel.getUserByUsername(username);

        if (user) {
            const passwordMatch = await comparePassword(password, user.password);
            if (passwordMatch) {
                // Verwijder gevoelige informatie voordat je de gebruiker retourneert
                const sessionUser: SessionUser = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                };
                return sessionUser;
            }
        }
        return null;
    }

    public async register(username: string, email: string, password: string): Promise<void> {
        const existingUser = await this.userModel.getUserByUsername(username);
        if (existingUser) {
            throw new Error('Gebruikersnaam is al in gebruik.');
        }
        const existingEmail = await this.userModel.getUserByEmail(email);
        if (existingEmail) {
            throw new Error('E-mailadres is al in gebruik.');
        }
        const hashedPassword = await hashPassword(password);
        const userData: Partial<AppUser> = {
            username,
            email,
            password: hashedPassword,
        };
        await this.userModel.createUser(userData);
    }
}
