import { Router } from 'express';
import * as packageController from '../../controllers/packageController';

const router = Router();

router.get('/', packageController.listPackages);

export default router;
