import { Router } from 'express';
import * as contactController from '../../controllers/contactController';
import { contactRateLimiter } from '../../middlewares/rateLimiters';
import { validateBody } from '../../middlewares/validate';
import { contactSchema } from '../../validators/schemas';

const router = Router();

router.post('/', contactRateLimiter, validateBody(contactSchema), contactController.createMessage);

export default router;
