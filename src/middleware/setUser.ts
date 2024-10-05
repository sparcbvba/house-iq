// src/middleware/setUser.ts
import { Request, Response, NextFunction } from 'express';

export function setUser(req: Request, res: Response, next: NextFunction) {
    if (req.session && req.session.user) {
        res.locals.user = req.session.user;  // Zet de gebruiker in res.locals
    } else {
        res.locals.user = null;  // Geen gebruiker ingelogd
    }
    next();
}
