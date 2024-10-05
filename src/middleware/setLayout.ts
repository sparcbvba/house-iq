import { Request, Response, NextFunction } from 'express';

export function setLayout(req: Request, res: Response, next: NextFunction) {
    if (req.session && req.session.user) {
        // Gebruiker is ingelogd, gebruik 'private' layout
        res.locals.layout = 'private';
    } else {
        // Gebruiker is niet ingelogd, gebruik 'public' layout
        res.locals.layout = 'public';
    }
    next();
}