import { Router } from 'express';
import { checkAuth } from '../middleware/authMiddleware';
import { InstallationController } from '../controllers';

const router = Router();
const installationController = new InstallationController();

router.get('/dashboard', checkAuth, installationController.showInstallations);
router.get('/installations/new', checkAuth, installationController.showInstallationForm);
router.post('/installations', checkAuth, installationController.createInstallation);
router.get('/installations/:id/edit', checkAuth, installationController.showEditForm);
router.post('/installations/:id', checkAuth, installationController.updateInstallation);

router.get('/dashboard/history', checkAuth, installationController.getHistory);


export default router;
