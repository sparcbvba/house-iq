import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack); // Log de volledige foutstack naar de serverconsole voor debugging

    // Stel de HTTP-statuscode in op 500
    res.status(500);

    // Render de '500.ejs' view en geef een custom foutmelding door
    res.render('500', {
        title: 'Internal Server Error',
        errorMessage: err.message || 'Er is een interne fout opgetreden. Probeer het later opnieuw.'
    });
}
