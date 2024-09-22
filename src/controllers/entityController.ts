import { Request, Response } from 'express';
import { fetchAndSaveEntitiesForInstallation } from '../workers';

export class EntityController {

     fetchAndSaveEntitiesForInstallation = async (req: Request, res: Response) => {
        const installationId = parseInt(req.params.id, 10);
    
        try {
            await fetchAndSaveEntitiesForInstallation(installationId);  // Specifieke installatie verwerken
            res.redirect('/dashboard');
        } catch (error) {
            console.error(`Fout bij het ophalen van entiteiten voor installatie ${installationId}:`, error);
            res.status(500).send('Fout bij het ophalen van entiteiten.');
        }
    };
    
}