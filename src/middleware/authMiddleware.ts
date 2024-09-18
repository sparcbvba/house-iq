// src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';

export function checkAuth(req: Request, res: Response, next: NextFunction) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}
