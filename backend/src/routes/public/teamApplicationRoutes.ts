import { Router } from 'express';
import * as teamApplicationController from '../../controllers/teamApplicationController';
import { applicationRateLimiter } from '../../middlewares/rateLimiters';
import { validateBody } from '../../middlewares/validate';
import { teamApplicationSchema } from '../../validators/schemas';

const router = Router();

router.post('/', applicationRateLimiter, validateBody(teamApplicationSchema), teamApplicationController.createTeamApplication);

export default router;
