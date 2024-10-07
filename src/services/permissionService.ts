// src/services/permissionService.ts
import fs from 'fs';
import path from 'path';

// Laad de rollen en permissies uit het JSON-bestand
const rolesPermissionsPath = path.join(__dirname, '../../config/rolesPermissions.json');
let rolesPermissions: any;

try {
    rolesPermissions = JSON.parse(fs.readFileSync(rolesPermissionsPath, 'utf8'));
} catch (error) {
    console.error("Error loading rolesPermissions.json:", error);
    rolesPermissions = {};
}


// TODO: transform to class. Keep it uniform Bart!!!
export const PermissionService = {
    /**
     * Controleert of een rol een bepaalde permissie heeft
     * @param {string} role - De rol van de gebruiker (bijv. 'admin', 'home_owner')
     * @param {string} permission - De permissie om te controleren (bijv. 'view_homes')
     * @returns {boolean} - Geeft true terug als de rol de permissie heeft, anders false
     */
    hasPermission(role: string, permission: string): boolean {
        const rolePermissions = rolesPermissions.roles[role]?.permissions || [];
        return rolePermissions.includes(permission);
    },

    /**
     * Geeft alle permissies terug voor een bepaalde rol
     * @param {string} role - De rol van de gebruiker
     * @returns {string[]} - Een lijst met permissies voor die rol
     */
    getPermissionsForRole(role: string): string[] {
        return rolesPermissions.roles[role]?.permissions || [];
    },

    /**
     * Haalt alleen de rollen op uit rolesPermissions.json
     * @returns {string[]} - Een array van rollen
     */
    getRoles(): string[] {
        // Haal enkel de rollen op (keys van het roles object in rolesPermissions.json)
        return Object.keys(rolesPermissions.roles);
    },

    /**
     * Haal de view op die hoort bij de userRole.
     * @param {string} userRole - De rol van de gebruiker.
     * @returns {string | null} - De naam van de view, of null als de rol niet bestaat.
     */
    getViewForRole(userRole: string | undefined): string | null {
        if (!userRole) return null;

        const role = rolesPermissions.roles[userRole];

        if (role && role.view) {
            return role.view;
        }

        return null;  // Geef null terug als de rol geen geldige view heeft
    }
};
