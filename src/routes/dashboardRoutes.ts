// src/routes/dashboardRoutes.ts

import { Router } from 'express';
import { checkAuth } from '../middleware/authMiddleware';
import { DashboardController } from '../controllers/dashboardController';

const router = Router();
const dashboardController = new DashboardController();

router.get('/dashboard', checkAuth, dashboardController.showDashboard);

export default router;
