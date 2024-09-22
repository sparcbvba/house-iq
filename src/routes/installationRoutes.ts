import { Router } from 'express';
import { checkAuth } from '../middleware/authMiddleware';
import { InstallationController, EntityController } from '../controllers';

const router = Router();
const installationController = new InstallationController();
const entityController = new EntityController();

router.get('/dashboard', checkAuth, installationController.showInstallations);
router.get('/installations/new', checkAuth, installationController.showInstallationForm);
router.post('/installations', checkAuth, installationController.createInstallation);
router.get('/installations/:id/edit', checkAuth, installationController.showEditForm);
router.post('/installations/:id', checkAuth, installationController.updateInstallation);
router.post('/installations/:id/refresh', installationController.refreshInstallation);
router.post('/installations/:id/fetch-entities', entityController.fetchAndSaveEntitiesForInstallation);


export default router;
