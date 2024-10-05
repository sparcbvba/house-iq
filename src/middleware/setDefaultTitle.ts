// src/middleware/setDefaultTitle.ts
import { Request, Response, NextFunction } from 'express';

export function setDefaultTitle(req: Request, res: Response, next: NextFunction) {
    // Stel een standaardtitel in
    res.locals.title = '[TITLE]';
    res.locals.subtitle = '[SUBTITLE]';

    // Bewaar een referentie naar de originele render-functie
    const originalRender = res.render;

    // Overschrijf res.render om de titel te kunnen overschrijven
    res.render = function (view: string, options?: any) {
        if (options && options.title) {
            res.locals.title = options.title;
        }

        if (options && options.subtitle) {
            res.locals.subtitle = options.subtitle;
        }
        return originalRender.call(this, view, options);
    };

    next();
}
