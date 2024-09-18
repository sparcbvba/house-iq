// src/routes/authRoutes.ts

import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();
const authController = new AuthController();

router.get('/login', authController.showLoginForm);
router.post('/login', authController.login);
router.get('/register', authController.showRegisterForm);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

export default router;
