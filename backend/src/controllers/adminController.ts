import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { successResponse } from '../utils/apiResponse';

export const adminOverview = async (_req: Request, res: Response) => {
  const [
    totalBookings,
    newBookings,
    confirmedBookings,
    completedProjects,
    pendingProjects,
    recentInquiries,
    recentGalleryUploads,
    publishedServices,
    featuredProjects
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'New' } }),
    prisma.booking.count({ where: { status: 'Confirmed' } }),
    prisma.project.count({ where: { isFeatured: true } }),
    prisma.booking.count({ where: { status: { in: ['New', 'Reviewed', 'Contacted', 'Quoted'] } } }),
    prisma.contactMessage.count({ where: { status: { in: ['New', 'Reviewed'] } } }),
    prisma.galleryItem.count(),
    prisma.service.count({ where: { isActive: true } }),
    prisma.project.count({ where: { isFeatured: true } })
  ]);

  res.json(
    successResponse('Success', {
      totalBookings,
      newBookings,
      confirmedBookings,
      completedProjects,
      pendingProjects,
      recentInquiries,
      recentGalleryUploads,
      publishedServices,
      featuredProjects
    })
  );
};
