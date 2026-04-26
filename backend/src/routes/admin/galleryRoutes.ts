import { Router } from 'express';
import * as galleryController from '../../controllers/galleryController';
import { authenticateAdmin } from '../../middlewares/auth';
import { upload } from '../../middlewares/upload';
import { validateBody } from '../../middlewares/validate';
import {
  galleryCategorySchema,
  galleryCategoryUpdateSchema,
  galleryItemSchema,
  galleryItemUpdateSchema
} from '../../validators/schemas';

const router = Router();

router.post('/upload', authenticateAdmin, upload.array('files', 10), galleryController.uploadGalleryFiles);
router.post(
    '/',
    authenticateAdmin,
    upload.fields([
        { name: 'file', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]),
    validateBody(galleryItemSchema),
    galleryController.createGalleryItem
);
router.put(
    '/:id',
    authenticateAdmin,
    upload.fields([
        { name: 'file', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]),
    validateBody(galleryItemUpdateSchema),
    galleryController.updateGalleryItem
);
router.delete('/:id', authenticateAdmin, galleryController.deleteGalleryItem);

router.post('/categories', authenticateAdmin, validateBody(galleryCategorySchema), galleryController.createGalleryCategory);
router.put('/categories/:id', authenticateAdmin, validateBody(galleryCategoryUpdateSchema), galleryController.updateGalleryCategory);
router.delete('/categories/:id', authenticateAdmin, galleryController.deleteGalleryCategory);

export default router;
