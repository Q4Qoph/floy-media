'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import {
  adminApi,
  publicApi,
  type AdminInvitePayload,
  type AdminLoginPayload,
  type AdminRoleDto,
  type BookingPayload,
  type ContactPayload,
  type TeamApplicationPayload,
} from './api';

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

export const usePublicSiteSettings = () =>
  useQuery({
    queryKey: ['public-site-settings'],
    queryFn: publicApi.getSiteSettings,
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

export const useAdminForgotPassword = () =>
  useMutation({
    mutationFn: (email: string) => adminApi.forgotPassword(email),
  });

export const useAdminResetPassword = () =>
  useMutation({
    mutationFn: (payload: { token: string; password: string }) => adminApi.resetPassword(payload),
  });

export const useAdminUsers = (token: string | null) =>
  useQuery({
    queryKey: ['admin-users', token],
    queryFn: () => adminApi.listAdminUsers(token as string),
    enabled: Boolean(token),
  });

export const useAdminInviteUser = (token: string | null) =>
  useMutation({
    mutationFn: (payload: AdminInvitePayload) => adminApi.inviteAdminUser(token as string, payload),
  });

export const useAdminUpdateUser = (token: string | null) =>
  useMutation({
    mutationFn: (args: { id: string; payload: { fullName?: string | null; role?: AdminRoleDto } }) =>
      adminApi.updateAdminUser(token as string, args.id, args.payload),
  });

export const useAdminDeleteUser = (token: string | null) =>
  useMutation({
    mutationFn: (id: string) => adminApi.deleteAdminUser(token as string, id),
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

export const useAdminSiteSettings = (token: string | null) =>
  useQuery({
    queryKey: ['admin-site-settings', token],
    queryFn: () => adminApi.getSiteSettings(token as string),
    enabled: Boolean(token),
  });
