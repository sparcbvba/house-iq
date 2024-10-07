// src/services/authService.ts
import { UserModel, RoleModel } from '../models';
import { AppUser, SessionUser } from '../utils/types';
import { hashPassword, comparePassword } from '../utils/encryption';
import { GravatarService } from './';

export class AuthService {
    private userModel: UserModel;
    private roleModel: RoleModel;
    private gravatarService: GravatarService

    constructor() {
        this.gravatarService = new GravatarService();

        this.userModel = new UserModel();
        this.roleModel = new RoleModel();
    }

    public async authenticate(email: string, password: string): Promise<SessionUser | null> {
        const user = await this.userModel.getUserByEmail(email);
        console.log('user', user);

        if (user) {
            const passwordMatch = await comparePassword(password, user.password_hash);
            if (passwordMatch) {

                // Update het last_login veld bij succesvolle login
                await this.userModel.updateUserLastLogin(user.user_id);

                if (!user.gravatarUrl || user.gravatarUrl == "") {
                    const gravatarUrl = this.gravatarService.generateGravatarUrl(email, 150);
                    user.gravatarUrl = gravatarUrl;

                    this.userModel.saveGravatarUrl(gravatarUrl, user.user_id);
                }

                // Verwijder gevoelige informatie voordat je de gebruiker retourneert
                user.password_hash = '';
                const sessionUser: SessionUser = user;
                return sessionUser;
            }
        }
        return null;
    }

    public async register(email: string, password: string, first_name: string, last_name: string, role?: string): Promise<void> {
        // Stap 1: Controleer of de gebruiker al bestaat
        const existingUser = await this.userModel.getUserByEmail(email);
        if (existingUser) {
            throw new Error('E-mailadres is al in gebruik.');
        }

        // Stap 2: Hash het wachtwoord
        const hashedPassword = await hashPassword(password);

        // Stap 3: Zoek de standaardrol op (bijvoorbeeld 'home_owner')
        const defaultRole = 'home_owner'

        const gravatarUrl = this.gravatarService.generateGravatarUrl(email, 150);

        // Stap 4: Maak de gebruiker aan met de rol_id van 'home_owner'
        const userData: Partial<AppUser> = {
            email,
            password_hash: hashedPassword,
            first_name: first_name,
            last_name: last_name,
            role: role || defaultRole,
            is_active: true,
            gravatarUrl: gravatarUrl,
            created_at: new Date(),  // Timestamp voor aanmaak
            updated_at: new Date()   // Timestamp voor update
        };

        // Stap 5: Sla de gebruiker op in de database
        await this.userModel.createUser(userData);
    }

}
