import { Router } from 'express';
import { checkAuth } from '../middleware/authMiddleware';
import { OnboardingController } from '../controllers';

const router = Router();
const onboardingController = new OnboardingController();

// TODO: figure out which routes are needed
router.get('/onboarding', checkAuth, onboardingController.showStep);






export default router;
