import { Router } from 'express';
import * as contactController from '../../controllers/contactController';
import { authenticateAdmin } from '../../middlewares/auth';
import { validateBody } from '../../middlewares/validate';
import { contactSchema } from '../../validators/schemas';

const router = Router();

router.get('/', authenticateAdmin, contactController.listMessages);
router.put('/:id', authenticateAdmin, validateBody(contactSchema), contactController.updateMessage);
router.delete('/:id', authenticateAdmin, contactController.deleteMessage);

export default router;
