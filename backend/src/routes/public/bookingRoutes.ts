import { Router } from 'express';
import * as bookingController from '../../controllers/bookingController';
import { bookingRateLimiter } from '../../middlewares/rateLimiters';
import { validateBody } from '../../middlewares/validate';
import { bookingSchema } from '../../validators/schemas';

const router = Router();

router.post('/', bookingRateLimiter, validateBody(bookingSchema), bookingController.createBooking);

export default router;
