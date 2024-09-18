import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { InstallationService } from '../services/installationService';
import logger from '../utils/logger';

export class UserController {
    private userService: UserService;
    private installationService: InstallationService;

    constructor() {
        this.userService = new UserService();
        this.installationService = new InstallationService();
    }

    // Pijlfunctie gebruiken om 'this' correct te binden
    public showUsers = async (req: Request, res: Response) => {
        try {
            const installationId = parseInt(req.params.installationId, 10);
            const installation = await this.installationService.getInstallationById(installationId);
            const users = await this.userService.getUsersByInstallationId(installationId);            
            const installationLink = installation?.url || '';

            res.render('users', {
                installation,
                installationLink,
                users
            });
        } catch (error) {
            logger.error('Fout bij het ophalen van gebruikers:', error);
            res.status(500).send('Er is een fout opgetreden bij het ophalen van de gebruikers.');
        }
    };

    public showUserForm = (req: Request, res: Response) => {
        const installationId = parseInt(req.params.installationId);
        res.render('user_form', { installationId });
    };

    public createUser = async (req: Request, res: Response) => {
        try {
            const installationId = parseInt(req.params.installationId);
            const { preferred, ...userData } = req.body;
    
            // Maak de gebruiker aan en ontvang het userId
            const userId = await this.userService.createUser(installationId, userData);
    
            if (preferred) {
                // Zet deze gebruiker als voorkeursgebruiker
                await this.userService.setPreferredUser(userId, installationId);
            }
    
            res.redirect(`/installations/${installationId}/users`);
        } catch (error) {
            logger.error('Fout bij het aanmaken van een gebruiker:', error);
            res.status(500).send('Er is een fout opgetreden bij het aanmaken van de gebruiker.');
        }
    };
    
    

    public showEditForm = async (req: Request, res: Response) => {
        try {
            const userId = parseInt(req.params.userId);
            const user = await this.userService.getUserById(userId);
            if (!user) {
                return res.status(404).send('Gebruiker niet gevonden.');
            }
            res.render('user_edit', { user });
        } catch (error) {
            logger.error('Fout bij het ophalen van gebruiker:', error);
            res.status(500).send('Er is een fout opgetreden bij het ophalen van de gebruiker.');
        }
    };

    public updateUser = async (req: Request, res: Response) => {
        try {
            const userId = parseInt(req.params.userId);
            const { preferred, ...userData } = req.body;
    
            // Werk de gebruiker bij
            await this.userService.updateUser(userId, userData);
    
            const user = await this.userService.getUserById(userId);
            if (!user) {
                return res.status(404).send('Gebruiker niet gevonden.');
            }
    
            if (preferred) {
                // Zet deze gebruiker als voorkeursgebruiker
                await this.userService.setPreferredUser(userId, user.installation_id);
            } else {
                // Haal de voorkeursstatus weg als deze gebruiker voorkeursgebruiker was
                await this.userService.unsetPreferredUser(userId);
            }
    
            res.redirect(`/installations/${user.installation_id}/users`);
        } catch (error) {
            logger.error('Fout bij het bijwerken van gebruiker:', error);
            res.status(500).send('Er is een fout opgetreden bij het bijwerken van de gebruiker.');
        }
    };
    
    
}


