import { Router } from 'express';
import * as videoController from '../../controllers/videoController';

const router = Router();

router.get('/', videoController.listVideos);
router.get('/:id', videoController.getVideo);

export default router;
