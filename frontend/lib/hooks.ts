'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { adminApi, publicApi, type AdminLoginPayload, type BookingPayload, type ContactPayload, type TeamApplicationPayload } from './api';

export const usePublicServices = () =>
  useQuery({
    queryKey: ['public-services'],
    queryFn: publicApi.listServices,
  });

export const usePublicHeroSection = () =>
  useQuery({
    queryKey: ['public-hero-section'],
    queryFn: publicApi.getHeroSection,
  });

export const usePublicGallery = () =>
  useQuery({
    queryKey: ['public-gallery'],
    queryFn: publicApi.listGallery,
  });

export const usePublicFeaturedGallery = () =>
  useQuery({
    queryKey: ['public-featured-gallery'],
    queryFn: publicApi.listFeaturedGallery,
  });

export const usePublicVideos = () =>
  useQuery({
    queryKey: ['public-videos'],
    queryFn: publicApi.listVideos,
  });

export const usePublicPackages = () =>
  useQuery({
    queryKey: ['public-packages'],
    queryFn: publicApi.listPackages,
  });

export const useCreateBooking = () =>
  useMutation({
    mutationFn: (payload: BookingPayload) => publicApi.createBooking(payload),
  });

export const useCreateContactMessage = () =>
  useMutation({
    mutationFn: (payload: ContactPayload) => publicApi.createContactMessage(payload),
  });

export const useCreateTeamApplication = () =>
  useMutation({
    mutationFn: (payload: TeamApplicationPayload) => publicApi.createTeamApplication(payload),
  });

export const useAdminLogin = () =>
  useMutation({
    mutationFn: (payload: AdminLoginPayload) => adminApi.login(payload),
  });

export const useAdminOverview = (token: string | null) =>
  useQuery({
    queryKey: ['admin-overview', token],
    queryFn: () => adminApi.overview(token as string),
    enabled: Boolean(token),
  });

export const useAdminBookings = (token: string | null) =>
  useQuery({
    queryKey: ['admin-bookings', token],
    queryFn: () => adminApi.listBookings(token as string),
    enabled: Boolean(token),
  });

export const useAdminMessages = (token: string | null) =>
  useQuery({
    queryKey: ['admin-messages', token],
    queryFn: () => adminApi.listMessages(token as string),
    enabled: Boolean(token),
  });

export const useAdminTeamApplications = (token: string | null) =>
  useQuery({
    queryKey: ['admin-team-applications', token],
    queryFn: () => adminApi.listTeamApplications(token as string),
    enabled: Boolean(token),
  });

export const useAdminServices = (token: string | null) =>
  useQuery({
    queryKey: ['admin-services', token],
    queryFn: () => adminApi.listServices(token as string),
    enabled: Boolean(token),
  });

export const useAdminHeroSection = (token: string | null) =>
  useQuery({
    queryKey: ['admin-hero-section', token],
    queryFn: () => adminApi.getHeroSection(token as string),
    enabled: Boolean(token),
  });
