// src/middleware/setActiveMenu.ts
import { MenuItem } from '@/utils';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

// Definieer je menu-items en hun bijbehorende routes
const menuItemsPath = path.join(__dirname, '../../config/menuItems.json');
const menuItems = JSON.parse(fs.readFileSync(menuItemsPath, 'utf8'));

export function setActiveMenu(req: Request, res: Response, next: NextFunction) {
    const currentPath = req.path;

    // Markeer welk menu-item actief moet zijn
    res.locals.menuItems = menuItems.map((item: MenuItem) => ({
        ...item,
        isActive: item.path === currentPath  // Zet isActive op true als het pad overeenkomt met de huidige route
    }));

    next();
}
