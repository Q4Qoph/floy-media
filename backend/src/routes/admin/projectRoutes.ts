import { Router } from 'express';
import * as projectController from '../../controllers/projectController';
import { authenticateAdmin } from '../../middlewares/auth';
import { validateBody } from '../../middlewares/validate';
import { projectSchema } from '../../validators/schemas';

const router = Router();

router.post('/', authenticateAdmin, validateBody(projectSchema), projectController.createProject);
router.put('/:id', authenticateAdmin, validateBody(projectSchema), projectController.updateProject);
router.delete('/:id', authenticateAdmin, projectController.deleteProject);

export default router;
