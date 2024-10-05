import { NextFunction, Request, Response } from 'express';
import { InstallationService } from '../services/installationService';
const { InfluxDB } = require('@influxdata/influxdb-client');
import logger from '../utils/logger';

export class InstallationController {
    private installationService: InstallationService;

    constructor() {
        this.installationService = new InstallationService();
    }

    public showInstallations = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const installations = await this.installationService.getAllInstallations();
            res.render('dashboard', { installations });
        } catch (error) {
            logger.error('Fout bij het ophalen van installaties:', error);
            next('Er is een fout opgetreden bij het ophalen van de installaties.');
        }
    };

    public getHistory = async (req: Request, res: Response, next: NextFunction) => {
        const url = "https://eu-central-1-1.aws.cloud2.influxdata.com";
        const token = "e1YfdfMVi3DTbvFxLRWiiuyzZM_G-fbGIdNWoOQjCdM2YhUsFmH8ihZ2la4qpuItcVtdBo-tlfrJBb40cZ18hA==";
        const org = "c137f6ca19431652";
        const bucket = "testhomeiq";
        const measurement = "W";

        const queryApi = new InfluxDB({ url: url, token: token }).getQueryApi(org);

        const fluxQuery = `from(bucket: "${bucket}")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "${measurement}")
  |> filter(fn: (r) => r.entity_id == "p1_meter_actueel_vermogen" or r.entity_id == "solaxmodbus_pv_power_total")
  |> filter(fn: (r) => r._field == "value")`;


        let data: { [key: string]: { time: string; value: number }[] } = {
            p1_meter_actueel_vermogen: [],
            solaxmodbus_pv_power_total: []
        };

        queryApi.queryRows(fluxQuery, {
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


    public showInstallationForm = (req: Request, res: Response) => {
        res.render('installation_form');
    };

    public createInstallation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.installationService.createInstallation(req.body);
            res.redirect('/dashboard');
        } catch (error) {
            logger.error('Fout bij het aanmaken van een installatie:', error);
            next('Er is een fout opgetreden bij het aanmaken van de installatie.');
        }
    };

    public showEditForm = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const installationId = parseInt(req.params.id);
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

    public updateInstallation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const installationId = parseInt(req.params.id);
            await this.installationService.updateInstallation(installationId, req.body);
            res.redirect('/dashboard');
        } catch (error) {
            logger.error('Fout bij het bijwerken van installatie:', error);
            next('Er is een fout opgetreden bij het bijwerken van de installatie.');
        }
    };
}