import { Router } from 'express';
import { checkAuth } from '../middleware/authMiddleware';
import { UserController } from '../controllers/userController';

const router = Router();
const userController = new UserController();

router.get('/installations/:installationId/users', checkAuth, userController.showUsers);
router.get('/installations/:installationId/users/new', checkAuth, userController.showUserForm);
router.post('/installations/:installationId/users', checkAuth, userController.createUser);
router.get('/users/:userId/edit', checkAuth, userController.showEditForm);
router.post('/users/:userId', checkAuth, userController.updateUser);

export default router;
