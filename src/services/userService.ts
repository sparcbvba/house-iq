import { InstallationUserModel } from '../models/installationUserModel';
import { InstallationUser } from '../utils/types';
import { hashPassword, encrypt } from '../utils/encryption';

export class UserService {
    private installationUserModel: InstallationUserModel;

    constructor() {
        this.installationUserModel = new InstallationUserModel();
    }

    public async getUsersByInstallationId(installationId: number): Promise<InstallationUser[]> {
        return this.installationUserModel.getUsersByInstallationId(installationId);
    }

    public async getUserById(id: number): Promise<InstallationUser | undefined> {
        return this.installationUserModel.getUserById(id);
    }

    public async createUser(installationId: number, user: Partial<InstallationUser>): Promise<number> {
        // Zorg ervoor dat het wachtwoord en het longlivingtoken bestaan
        if (!user.password) {
            throw new Error("Wachtwoord is verplicht");
        }
    
        if (!user.longlivingtoken) {
            throw new Error("Longlivingtoken is verplicht");
        }
    
        // Hash het wachtwoord en versleutel het longlivingtoken
        const hashedPassword = await hashPassword(user.password);
        const encryptedToken = encrypt(user.longlivingtoken);
    
        // Roep de modelmethode aan en retourneer het gegenereerde userId
        return await this.installationUserModel.createUser({
            installation_id: installationId,
            username: user.username,
            password: hashedPassword, // Gehashed wachtwoord opslaan
            type: user.type,
            longlivingtoken: encryptedToken // Versleuteld token opslaan
        });
    }

    public async deactivateUser(userId: number): Promise<void> {
        await this.installationUserModel.deactivateUser(userId);
    }
        

    public async updateUser(id: number, data: any): Promise<void> {
        const user = await this.installationUserModel.getUserById(id);
        if (!user) throw new Error('Gebruiker niet gevonden');

        const updatedData: Partial<InstallationUser> = {
            username: data.username,
            type: data.type,
        };

        if (data.password) {
            updatedData.password = await hashPassword(data.password); // Wachtwoord hashen als het nieuw is
        } else {
            updatedData.password = user.password;
        }

        if (data.longlivingtoken) {
            updatedData.longlivingtoken = encrypt(data.longlivingtoken); // Token versleutelen als het nieuw is
        } else {
            updatedData.longlivingtoken = user.longlivingtoken;
        }

        await this.installationUserModel.updateUser(id, updatedData);
    }

    public async setPreferredUser(userId: number, installationId: number): Promise<void> {
        await this.installationUserModel.setPreferredUser(userId, installationId);
    }

    public async unsetPreferredUser(userId: number): Promise<void> {
        const user = await this.installationUserModel.getUserById(userId);
        if (user && user.preferred === 1) {
            await this.installationUserModel.updateUser(userId, { preferred: 0 });
        }
    }
}
