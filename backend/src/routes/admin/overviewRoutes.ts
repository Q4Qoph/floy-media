import { Router } from 'express';
import * as adminController from '../../controllers/adminController';
import { authenticateAdmin } from '../../middlewares/auth';

const router = Router();

router.get('/overview', authenticateAdmin, adminController.adminOverview);

export default router;
