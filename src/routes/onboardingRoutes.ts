import { Router } from 'express';
import { checkAuth } from '../middleware/authMiddleware';
import { OnboardingController } from '../controllers/onboardingController';

const router = Router();
const onboardingController = new OnboardingController();

// TODO: figure out which routes are needed
router.get('/onboarding', checkAuth, onboardingController.getOnboardingOverview);
router.get('/onboarding/start', checkAuth, onboardingController.showStep);
router.get('/onboarding/:onboardingId', checkAuth, onboardingController.getCurrentStep);

router.post('/onboarding/create_user', checkAuth, onboardingController.createUser);



export default router;
