import { Router } from 'express';
import * as authController from '../../controllers/authController';
import { authenticateAdmin } from '../../middlewares/auth';
import { adminBootstrapGuard } from '../../middlewares/adminBootstrapGuard';
import { validateBody } from '../../middlewares/validate';
import { adminLoginSchema, adminRegisterSchema } from '../../validators/schemas';

const router = Router();

router.post('/login', validateBody(adminLoginSchema), authController.login);
router.post('/register', adminBootstrapGuard, validateBody(adminRegisterSchema), authController.register);
router.get('/profile', authenticateAdmin, authController.profile);

export default router;
