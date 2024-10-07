import { NextFunction, Request, Response } from 'express';
import { Views } from '../constants/viewConstants';

export class OnboardingController {
    constructor() { }

    public showStep = async (req: Request, res: Response, next: NextFunction) => {
        res.render(Views.ONBOARDING.CREATE_USER, { title: "Create user" });
    }
}