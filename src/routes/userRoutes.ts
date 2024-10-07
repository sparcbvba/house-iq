import { Router } from 'express';
import { checkAuth } from '../middleware/authMiddleware';
import { UserController } from '../controllers/userController';

const router = Router();
const userController = new UserController();

router.get('/users', checkAuth, userController.showUsers);
router.get('/users/new', checkAuth, userController.showNewForm);
router.get('/users/:userId', checkAuth, userController.getUserDetail);
router.get('/users/:userId/edit', checkAuth, userController.showEditForm);

router.post('/users/update-status', checkAuth, userController.updateUserStatus);
router.post('/users/:userId', checkAuth, userController.updateUser);
router.post('/users/:userId/deactivate', userController.deactivateUser);






export default router;
