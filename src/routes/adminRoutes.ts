// src/routes/dashboardRoutes.ts

import { Router } from 'express';
import { checkAuth } from '../middleware/authMiddleware';
import { HouseController } from '../controllers';


const router = Router();
const houseController = new HouseController;

router.get('/admin/house/new', checkAuth, houseController.showCreateHouseForm);

export default router;
