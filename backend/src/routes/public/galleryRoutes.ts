import { Router } from 'express';
import * as galleryController from '../../controllers/galleryController';

const router = Router();

router.get('/', galleryController.listGallery);
router.get('/:id', galleryController.getGalleryItem);

export default router;
