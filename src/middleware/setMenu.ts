import { MenuItem } from '../utils';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const menuItemsPath = path.join(__dirname, '../../config/menuItems.json');
const menuItems = JSON.parse(fs.readFileSync(menuItemsPath, 'utf8'));

const rolesPermissionsPath = path.join(__dirname, '../../config/rolesPermissions.json');
const rolesPermissions = JSON.parse(fs.readFileSync(rolesPermissionsPath, 'utf8'));

export function setMenu(req: Request, res: Response, next: NextFunction) {
    const userRole = req.session.user?.role;  // Haal de rol van de gebruiker op uit de sessie
    if (!userRole) return next();

    const permissions = rolesPermissions.roles[userRole]?.permissions;  // Haal de rechten van de rol op

    if (!permissions) {
        // Als de rol niet gevonden is, geen menu tonen
        res.locals.menu = [];
        return next();
    }

    // Als de gebruiker admin is, retourneer alle menu-items
    if (permissions.includes('*')) {
        res.locals.menu = menuItems;
    } else {
        // Filter het menu op basis van de permissies van de gebruiker
        const filteredMenu = menuItems.filter((item: MenuItem) => {
            // Check of het menu-item een van de vereiste permissies heeft
            return item.permissions.some((permission: string) => permissions.includes(permission));
        });

        // Zet het gefilterde menu in res.locals, zodat het beschikbaar is in de views
        res.locals.menu = filteredMenu;
    }

    next();
}
