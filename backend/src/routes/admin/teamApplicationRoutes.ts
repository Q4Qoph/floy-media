import { Router } from 'express';
import * as teamApplicationController from '../../controllers/teamApplicationController';
import { authenticateAdmin } from '../../middlewares/auth';
import { validateBody } from '../../middlewares/validate';
import { teamApplicationUpdateSchema } from '../../validators/schemas';

const router = Router();

router.get('/', authenticateAdmin, teamApplicationController.listTeamApplications);
router.put('/:id', authenticateAdmin, validateBody(teamApplicationUpdateSchema), teamApplicationController.updateTeamApplication);
router.delete('/:id', authenticateAdmin, teamApplicationController.deleteTeamApplication);

export default router;
