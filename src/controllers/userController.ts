import { NextFunction, Request, Response } from 'express';
import { UserService, PermissionService } from '../services';
import { Views } from '../constants/viewConstants';
import logger from '../utils/logger';
import { AppUser } from '@/utils';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
        logger.info('UserController initialized');
    }

    // GETS
    public showUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.userService.getAllUsers();
            users?.forEach((user: AppUser) => {
                // Converteer UTC naar lokale tijd voor weergave in de view
                user.last_login_locale = user.last_login ? new Date(user.last_login).toLocaleString('en-US', { timeZone: 'Europe/Amsterdam' }) : 'never';
            })
            res.render(Views.USERS.OVERVIEW, { title: "Users", data: users });
        } catch (error) {
            logger.error('Fout bij het ophalen van gebruikers:', error);
            next('Er is een fout opgetreden bij het ophalen van de gebruikers.');
        }

    };

    public showNewForm = async (req: Request, res: Response) => {
        const roles = PermissionService.getRoles()
        res.render(Views.USERS.NEW, { title: "Users", roles: roles });
    }

    public getUserDetail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.userService.getUserDetail(parseInt(req.params.userId));
            if (!user) return;

            user.last_login_locale = user.last_login ? new Date(user.last_login).toLocaleString('en-US', { timeZone: 'Europe/Amsterdam' }) : 'never';

            res.render(Views.USERS.DETAIL, { user: user, subtitle: "Profile for " + user.first_name + ' ' + user.last_name });
        } catch (error) {
            logger.error('Fout bij het ophalen van gebruiker:', error);
            next('Er is een fout opgetreden bij het ophalen van de gebruiker.');
        }
    }

    public showEditForm = async (req: Request, res: Response) => {
        res.render(Views.USERS.MANAGE, { title: "Users" });
    }


    // POSTS
    public updateUser = async (req: Request, res: Response) => {
        res.render(Views.USERS.MANAGE, { title: "Users" });
    }

    public deactivateUser = async (req: Request, res: Response) => {
        res.render(Views.USERS.OVERVIEW, { title: "Users" });
    }

    public updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
        console.log('updating user status');
        const { userId, isOnline } = req.body;
        console.log('updating user status', userId, isOnline);
        try {
            this.userService.updateUserStatus(userId, isOnline);
        } catch (error) {
            logger.error('Fout bij het ophalen van gebruiker:', error);
            next('Er is een fout opgetreden bij het ophalen van de gebruiker.');
        }
        res.status(200).send('User status updated successfully');
    }

    public createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newUserId = await this.userService.createUser(req.body);
            res.redirect(`/users/${newUserId}`);
        } catch (error) {
            logger.error('Fout bij het aanmaken van gebruiker:', error);
            next('Er is een fout opgetreden bij het aanmaken van de gebruiker.');
        }
    }

}


