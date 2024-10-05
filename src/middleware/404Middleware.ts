// src/middleware/notFoundMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export function notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
    res.status(404);

    // Controleer of de request JSON verwacht of niet, voor API gevallen
    if (req.accepts('html')) {
        res.render('404', { title: 'Page Not Found' });  // Render de 404 view
        return;
    }

    if (req.accepts('json')) {
        res.json({ error: 'Not Found' });
        return;
    }

    // Default to plain text voor andere types
    res.type('txt').send('Not Found');
}
