import { Router } from 'express';
import * as serviceController from '../../controllers/serviceController';
import { authenticateAdmin } from '../../middlewares/auth';
import { upload } from '../../middlewares/upload';
import { validateBody } from '../../middlewares/validate';
import { serviceSchema, serviceUpdateSchema } from '../../validators/schemas';

const router = Router();

router.get('/', authenticateAdmin, serviceController.listServices);
router.post(
  '/',
  authenticateAdmin,
  upload.fields([{ name: 'image', maxCount: 1 }]),
  validateBody(serviceSchema),
  serviceController.createService
);
router.put(
  '/:id',
  authenticateAdmin,
  upload.fields([{ name: 'image', maxCount: 1 }]),
  validateBody(serviceUpdateSchema),
  serviceController.updateService
);
router.delete('/:id', authenticateAdmin, serviceController.deleteService);

export default router;
