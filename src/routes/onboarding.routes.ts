import { Router } from 'express';
import { checkAuth } from '../middleware';
import { OnboardingController } from '../controllers';
import { OnboardingModel } from '../models';
import { OnboardingService } from '../services';

const router = Router();

const onboardingController = new OnboardingController();

router.get('/onboardings', checkAuth, onboardingController.getOnboardings.bind(onboardingController));
router.get('/onboardings/:id', checkAuth, onboardingController.getOnboardingById.bind(onboardingController));
router.post('/onboardings', checkAuth, onboardingController.createOnboarding.bind(onboardingController));
router.put('/onboardings/:id', checkAuth, onboardingController.updateOnboarding.bind(onboardingController));
router.delete('/onboardings/:id', checkAuth, onboardingController.deleteOnboarding.bind(onboardingController));

export default router;
