// src/controllers/authController.ts

import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { SessionUser } from '../utils/types';
import logger from '../utils/logger';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public showLoginForm = (req: Request, res: Response) => {
        res.render('login');
    };

    public login = async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;
            const user = await this.authService.authenticate(username, password);
            if (user) {
                req.session.user = user;
                res.redirect('/dashboard');
            } else {
                res.render('login', { error: 'Ongeldige gebruikersnaam of wachtwoord' });
            }
        } catch (error) {
            logger.error('Fout bij inloggen:', error);
            res.status(500).send('Er is een fout opgetreden bij het inloggen.');
        }
    };

    public showRegisterForm = (req: Request, res: Response) => {
        res.render('register');
    };

    public register = async (req: Request, res: Response) => {
        try {
            const { username, email, password } = req.body;
            await this.authService.register(username, email, password);
            res.redirect('/login');
        } catch (error) {
            logger.error('Fout bij registreren:', error);
            res.render('register', { error: error });
        }
    };

    public logout = (req: Request, res: Response) => {
        req.session.destroy((err) => {
            if (err) {
                logger.error('Fout bij uitloggen:', err);
            }
            res.redirect('/login');
        });
    }
}
