import { NextFunction, Request, Response } from 'express';
import { InstallationService } from '../services/installationService';
import logger from '../utils/logger';
import { InfluxDBService } from '../services';
import { IInstallationService } from '../services/interfaces';

/**
 * The InstallationController class handles HTTP requests related to installations.
 * It interacts with the installation service to perform CRUD operations and render views.
 * 
 * @class
 * @implements {IInstallationService}
 */
export class InstallationController {
    private installationService: IInstallationService;

    constructor() {
        this.installationService = new InstallationService();
    }

    /**
     * Handles the request to show all installations.
     * 
     * This method retrieves all installations using the installation service and renders the 'dashboard' view with the installations data.
     * If an error occurs during the retrieval process, it logs the error and passes an error message to the next middleware.
     * 
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next middleware function.
     * 
     * @returns A promise that resolves when the installations are successfully retrieved and the view is rendered.
     */
    public showInstallations = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const installations = await this.installationService.getAllInstallations();
            res.render('dashboard', { installations });
        } catch (error) {
            logger.error('Fout bij het ophalen van installaties:', error);
            next('Er is een fout opgetreden bij het ophalen van de installaties.');
        }
    };

    /**
     * Retrieves historical data from the InfluxDB and renders it on the 'history' view.
     * 
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @param next - The next middleware function in the stack.
     * 
     * @remarks
     * This method queries the InfluxDB for data from the past hour, filtering by specific measurements and fields.
     * The results are grouped by entity_id and passed to the 'history' view for rendering.
     * 
     * @throws Will call the next middleware with an error message if the query fails.
     */
    public getHistory = async (req: Request, res: Response, next: NextFunction) => {
        const bucket = "testhomeiq";
        const measurement = "W";
        const fluxQuery = `from(bucket: "${bucket}")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "${measurement}")
  |> filter(fn: (r) => r.entity_id == "p1_meter_actueel_vermogen" or r.entity_id == "solaxmodbus_pv_power_total")
  |> filter(fn: (r) => r._field == "value")`;


        let data: { [key: string]: { time: string; value: number }[] } = {
            p1_meter_actueel_vermogen: [],
            solaxmodbus_pv_power_total: []
        };

        InfluxDBService.queryRows(fluxQuery, {
            next(row: any, tableMeta: any) {
                const o = tableMeta.toObject(row);
                console.log('Record:', o);
                const entityId = o.entity_id;
                if (entityId in data) {
                    data[entityId].push({ time: o._time, value: o._value });
                }
            },
            error(error: any) {
                console.error('Query mislukt', error);
                next('Fout bij het opvragen van data');
            },
            complete() {
                res.render('history', { data });
            },
        });

    }


    /**
     * Handles the request to show the installation form.
     * Renders the 'installation_form' view.
     *
     * @param req - The request object.
     * @param res - The response object.
     */
    public showInstallationForm = (req: Request, res: Response) => {
        res.render('installation_form');
    };

    /**
     * Handles the creation of a new installation.
     * 
     * This method receives the installation data from the request body,
     * attempts to create a new installation using the installation service,
     * and redirects the user to the dashboard upon success.
     * 
     * If an error occurs during the creation process, it logs the error
     * and passes a custom error message to the next middleware.
     * 
     * @param req - The request object containing the installation data.
     * @param res - The response object used to redirect the user.
     * @param next - The next middleware function in the stack.
     * 
     * @throws Will pass an error message to the next middleware if the creation fails.
     */
    public createInstallation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.installationService.createInstallation(req.body);
            res.redirect('/dashboard');
        } catch (error) {
            logger.error('Fout bij het aanmaken van een installatie:', error);
            next('Er is een fout opgetreden bij het aanmaken van de installatie.');
        }
    };

    /**
     * Handles the request to show the edit form for a specific installation.
     * 
     * @param req - The request object, containing the installation ID in the parameters.
     * @param res - The response object, used to render the edit form or send an error status.
     * @param next - The next middleware function in the stack, used for error handling.
     * 
     * @returns A promise that resolves to rendering the edit form with the installation data,
     *          or sending a 404 status if the installation is not found.
     * 
     * @throws Will call the next middleware with an error message if an error occurs during the process.
     */
    public showEditForm = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const installationId = parseInt(req.params.id, 10);
            const installation = await this.installationService.getInstallationById(installationId);
            if (!installation) {
                return res.status(404).send('Installatie niet gevonden.');
            }
            res.render('installation_edit', { installation });
        } catch (error) {
            logger.error('Fout bij het ophalen van installatie:', error);
            next('Er is een fout opgetreden bij het ophalen van de installatie.');
        }
    };

    /**
     * Updates an existing installation with the provided data.
     * 
     * @param req - The request object containing the installation ID in the URL parameters and the update data in the body.
     * @param res - The response object used to redirect the user after a successful update.
     * @param next - The next middleware function in the stack, used to handle errors.
     * 
     * @throws Will call the next middleware with an error message if the update fails.
     */
    public updateInstallation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const installationId = parseInt(req.params.id, 10);
            await this.installationService.updateInstallation(installationId, req.body);
            res.redirect('/dashboard');
        } catch (error) {
            logger.error('Fout bij het bijwerken van installatie:', error);
            next('Er is een fout opgetreden bij het bijwerken van de installatie.');
        }
    };
}