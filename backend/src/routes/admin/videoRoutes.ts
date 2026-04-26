import { Router } from 'express';
import * as videoController from '../../controllers/videoController';
import { authenticateAdmin } from '../../middlewares/auth';
import { upload } from '../../middlewares/upload';
import { validateBody } from '../../middlewares/validate';
import { videoSchema, videoUpdateSchema } from '../../validators/schemas';

const router = Router();

router.post(
  '/',
  authenticateAdmin,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  validateBody(videoSchema),
  videoController.createVideo
);
router.put(
  '/:id',
  authenticateAdmin,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  validateBody(videoUpdateSchema),
  videoController.updateVideo
);
router.delete('/:id', authenticateAdmin, videoController.deleteVideo);

export default router;
