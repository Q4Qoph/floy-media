import { Router } from 'express';
import * as bookingController from '../../controllers/bookingController';
import { authenticateAdmin } from '../../middlewares/auth';
import { validateBody } from '../../middlewares/validate';
import { bookingUpdateSchema } from '../../validators/schemas';

const router = Router();

router.get('/', authenticateAdmin, bookingController.listBookings);
router.get('/:id', authenticateAdmin, bookingController.getBooking);
router.put('/:id', authenticateAdmin, validateBody(bookingUpdateSchema), bookingController.updateBooking);
router.delete('/:id', authenticateAdmin, bookingController.deleteBooking);

export default router;
