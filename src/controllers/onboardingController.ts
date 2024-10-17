import { OnboardingService } from './../services/onboardingService';
import { NextFunction, Request, Response } from 'express';
import { Views } from '../constants/viewConstants';
import { AuthService } from '../services/authService';
import { OnboardingSteps } from '../constants/onboardingConstants';
import { logger } from '../utils';

export class OnboardingController {
    // private steps: OnboardingSteps[];
    private onboardingService: OnboardingService;
    private authService: AuthService;

    constructor() {
        this.onboardingService = new OnboardingService();
        this.authService = new AuthService();
        this.createUser = this.createUser.bind(this);

        logger.info('OnboardingController initialized');
        // this.steps = [
        //     OnboardingSteps.CREATE_USER,
        //     OnboardingSteps.HOUSE_CREATION,
        //     OnboardingSteps.INSTALLATION_ADDITION,
        //     OnboardingSteps.INSTALLATION_VERIFICATION,
        //     OnboardingSteps.COMPLETED
        // ];
    }

    public async showStep(req: Request, res: Response, next: NextFunction) {
        res.render(Views.ONBOARDING.CREATE_USER, { title: "Create user" });
    }

    // Controleer huidige stap van onboarding en toon juiste stap in de wizard
    public async getCurrentStep(req: Request, res: Response, next: NextFunction): Promise<void> {
        const onboardingStep = await this.onboardingService.getCurrentStep(parseInt(req.params.onboardingId));

        switch (onboardingStep) {
            case OnboardingSteps.CREATE_USER:
                res.render(Views.ONBOARDING.CREATE_USER, { title: "Create user" });
                break;
            case OnboardingSteps.HOUSE_CREATION:
                res.render(Views.ONBOARDING.HOUSE_CREATION, { title: "House creation" });
                break;
            case OnboardingSteps.INSTALLATION_ADDITION:
                res.render(Views.ONBOARDING.INSTALLATION_ADDITION, { title: "Installation creation" });
                break;
            case OnboardingSteps.INSTALLATION_VERIFICATION:
                res.render(Views.ONBOARDING.INSTALLATION_VERIFICATION, { title: "Installation verification" });
                break;
            case OnboardingSteps.COMPLETED:
            default:
                res.render(Views.ONBOARDING.COMPLETED, { title: "Completed" });
                break;
        }
    }

    /**
     * Handles the creation of a new user.
     * 
     * This method extracts user details from the request body, attempts to register the user
     * using the authentication service, and renders the next step view if successful.
     * If registration fails, it throws an error.
     * 
     * @param req - The request object containing user details in the body.
     * @param res - The response object used to render the next step view.
     * @param next - The next middleware function in the stack, used for error handling.
     * 
     * @throws Will throw an error if user registration fails.
     * 
     * @returns A promise that resolves to void.
     */
    public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password, first_name, last_name } = req.body;
            logger.info('Creating user ' + first_name + ' ' + last_name);
            logger.info('authService: ' + this.authService);
            const registrationResult = await this.authService.register(email, password, first_name, last_name);

            if (registrationResult) {
                // Render the next step view
                res.render(this.getViewForStep(OnboardingSteps.HOUSE_CREATION), { title: "House creation" });
            } else {
                throw new Error("User registration failed");
            }
        } catch (error) {
            console.error('Error in createUser:', error);
            next(error);
        }
    }

    public getNextStep(currentStep: OnboardingSteps): OnboardingSteps | undefined {
        // const currentIndex = this.steps.indexOf(currentStep);
        // return this.steps[currentIndex + 1] || OnboardingSteps.COMPLETED;
        return;
    }

    public getViewForStep(step: OnboardingSteps): string {
        switch (step) {
            case OnboardingSteps.CREATE_USER:
                return Views.ONBOARDING.CREATE_USER;
            case OnboardingSteps.HOUSE_CREATION:
                return Views.ONBOARDING.HOUSE_CREATION;
            case OnboardingSteps.INSTALLATION_ADDITION:
                return Views.ONBOARDING.INSTALLATION_ADDITION;
            case OnboardingSteps.INSTALLATION_VERIFICATION:
                return Views.ONBOARDING.INSTALLATION_VERIFICATION;
            case OnboardingSteps.COMPLETED:
                return Views.ONBOARDING.COMPLETED;
            default:
                return Views.ONBOARDING.COMPLETED;
        }
    }

}

