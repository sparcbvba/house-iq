// src/routes/dashboardRoutes.ts

import { Router } from 'express';
import { checkAuth } from '../middleware/authMiddleware';
import { HouseController } from '../controllers';


const router = Router();
const houseController = new HouseController;

router.get('/houses', checkAuth, houseController.showHouses);
router.get('/houses/new', checkAuth, houseController.showCreateHouseForm);
router.get('/houses/edit', checkAuth, houseController.showEditHouseForm);

export default router;
