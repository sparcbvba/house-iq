// src/controllers/OnboardingController.ts
import { Request, Response, NextFunction } from 'express';
import { OnboardingService } from '../services';
import { OnboardingCreateDTO, OnboardingUpdateDTO } from '../interfaces';

export class OnboardingController {
    private onboardingService: OnboardingService;

    constructor() {
        this.onboardingService = new OnboardingService();
    }

    public createOnboarding = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const data: OnboardingCreateDTO = req.body;
            const newOnboarding = await this.onboardingService.createOnboarding(data);
            res.status(201).json(newOnboarding);
        } catch (error) {
            next(error);
        }
    };

    // Get an onboarding by ID
    async getOnboardingById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const onboarding_id = parseInt(req.params.id, 10);
            const onboarding = await this.onboardingService.getOnboardingById(onboarding_id);
            if (!onboarding) {
                res.status(404).json({ message: 'Onboarding not found' });
            } else {
                res.status(200).json(onboarding);
            }
        } catch (error) {
            next(error);
        }
    }

    public updateOnboarding = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const onboarding_id = parseInt(req.params.id, 10);
            const data: OnboardingUpdateDTO = req.body;
            const updatedOnboarding = await this.onboardingService.updateOnboarding(
                onboarding_id,
                data
            );
            res.status(200).json(updatedOnboarding);
        } catch (error) {
            next(error);
        }
    };

    // Delete an onboarding
    async deleteOnboarding(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const onboarding_id = parseInt(req.params.id, 10);
            await this.onboardingService.deleteOnboarding(onboarding_id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    // Get onboardings based on filters
    async getOnboardings(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filters = req.query;
            const onboardings = await this.onboardingService.getOnboardings(filters);
            console.log('onboardings:', onboardings);
            res.status(200).render('onboarding_overview', { onboardings });
        } catch (error) {
            next(error);
        }
    }
}
