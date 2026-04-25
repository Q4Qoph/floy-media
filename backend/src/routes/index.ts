import { Router } from 'express';
import adminAuthRoutes from './admin/authRoutes';
import adminOverviewRoutes from './admin/overviewRoutes';
import adminBookingRoutes from './admin/bookingRoutes';
import adminGalleryRoutes from './admin/galleryRoutes';
import adminVideoRoutes from './admin/videoRoutes';
import adminServiceRoutes from './admin/serviceRoutes';
import adminTeamApplicationRoutes from './admin/teamApplicationRoutes';
import adminMessageRoutes from './admin/messageRoutes';
import adminPackageRoutes from './admin/packageRoutes';
import adminProjectRoutes from './admin/projectRoutes';
import publicBookingRoutes from './public/bookingRoutes';
import publicGalleryRoutes from './public/galleryRoutes';
import publicGalleryCategoryRoutes from './public/galleryCategoryRoutes';
import publicVideoRoutes from './public/videoRoutes';
import publicServiceRoutes from './public/serviceRoutes';
import publicTeamApplicationRoutes from './public/teamApplicationRoutes';
import publicContactRoutes from './public/contactRoutes';
import publicPackageRoutes from './public/packageRoutes';
import publicProjectRoutes from './public/projectRoutes';

const router = Router();

router.use('/admin', adminAuthRoutes);
router.use('/admin', adminOverviewRoutes);
router.use('/admin/bookings', adminBookingRoutes);
router.use('/admin/gallery', adminGalleryRoutes);
router.use('/admin/videos', adminVideoRoutes);
router.use('/admin/services', adminServiceRoutes);
router.use('/admin/team-applications', adminTeamApplicationRoutes);
router.use('/admin/messages', adminMessageRoutes);
router.use('/admin/packages', adminPackageRoutes);
router.use('/admin/projects', adminProjectRoutes);

router.use('/bookings', publicBookingRoutes);
router.use('/gallery', publicGalleryRoutes);
router.use('/gallery-categories', publicGalleryCategoryRoutes);
router.use('/videos', publicVideoRoutes);
router.use('/services', publicServiceRoutes);
router.use('/team/apply', publicTeamApplicationRoutes);
router.use('/contact', publicContactRoutes);
router.use('/packages', publicPackageRoutes);
router.use('/projects', publicProjectRoutes);

export default router;
