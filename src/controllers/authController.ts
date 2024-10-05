// src/controllers/authController.ts

import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { Views } from '../constants/viewConstants';
import logger from '../utils/logger';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public showLoginForm = (req: Request, res: Response) => {
        res.render(Views.AUTH.LOGIN, {
            title: "Login"
        });
    };

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const user = await this.authService.authenticate(email, password);
            if (user) {
                req.session.user = user;
                res.redirect('/dashboard');
            } else {
                res.render(Views.AUTH.LOGIN, { error: 'Ongeldige gebruikersnaam of wachtwoord' });
            }
        } catch (error) {
            logger.error('Fout bij inloggen:', error);
            next('Er is een fout opgetreden bij het inloggen.');
        }
    };

    public showRegisterForm = (req: Request, res: Response) => {
        res.render(Views.AUTH.REGISTER, {
            title: "Registreer"
        });
    };

    public register = async (req: Request, res: Response) => {
        try {
            const { email, password, first_name, last_name } = req.body;
            await this.authService.register(email, password, first_name, last_name);
            res.redirect('/login');
        } catch (error) {
            logger.error('Fout bij registreren:', error);
            res.render(Views.AUTH.REGISTER, { error: error });
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
