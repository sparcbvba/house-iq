// createUsers.ts
import { AuthService } from '../services';
import { UserModel } from '../models';
import * as fs from 'fs';
import * as path from 'path';

// Laad rolesPermissions.json
const rolesPermissionsPath = path.join(__dirname, '../../config/rolesPermissions.json');
const rolesPermissions = JSON.parse(fs.readFileSync(rolesPermissionsPath, 'utf8'));

// Zorg dat je AuthService instantie hebt
const authService = new AuthService();

// Async functie om gebruikers aan te maken per rol
async function createUsersForRoles() {
    try {
        const userModel = new UserModel();
        await userModel.removeAllUsers()

        // Loop door elke rol in rolesPermissions
        for (const role in rolesPermissions.roles) {
            if (rolesPermissions.roles.hasOwnProperty(role)) {
                const email = `${role}@house.iq`;  // Fictief emailadres gebaseerd op rol
                const password = 'test';   // Je kunt hier een complexer wachtwoord gebruiken
                const firstName = role;           // First name gebaseerd op rol
                const lastName = 'User';          // Last name als 'User'

                // Aanroepen van de register functie in AuthService
                await authService.register(email, password, firstName, lastName, role);

                console.log(`User for role '${role}' has been successfully created.`);
            }
        }
    } catch (error) {
        console.error('Error creating users for roles:', error);
    }
}

// Voer de functie uit
createUsersForRoles();
