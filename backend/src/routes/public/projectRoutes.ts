import { Router } from 'express';
import * as projectController from '../../controllers/projectController';

const router = Router();

router.get('/', projectController.listProjects);
router.get('/:id', projectController.getProject);

export default router;
