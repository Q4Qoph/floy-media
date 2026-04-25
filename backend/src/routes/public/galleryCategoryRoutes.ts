import { Router } from 'express';
import * as galleryController from '../../controllers/galleryController';

const router = Router();

router.get('/', galleryController.listGalleryCategories);

export default router;
