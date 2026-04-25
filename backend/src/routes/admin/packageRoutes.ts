import { Router } from 'express';
import * as packageController from '../../controllers/packageController';
import { authenticateAdmin } from '../../middlewares/auth';
import { validateBody } from '../../middlewares/validate';
import { packageSchema } from '../../validators/schemas';

const router = Router();

router.post('/', authenticateAdmin, validateBody(packageSchema), packageController.createPackage);
router.put('/:id', authenticateAdmin, validateBody(packageSchema), packageController.updatePackage);
router.delete('/:id', authenticateAdmin, packageController.deletePackage);

export default router;
