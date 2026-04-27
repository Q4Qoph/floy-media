'use client';

import useSWR from 'swr';
import {
  galleryApi,
  teamApi,
  testimonialApi,
  serviceApi,
  bookingApi,
} from './api';
import type {
  Gallery,
  TeamMember,
  Testimonial,
  Service,
  BookingFormData,
  BookingResponse,
} from '@/types';

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
};

// Gallery hooks
export const useGalleries = () => {
  const { data, error, isLoading } = useSWR<Gallery[]>(
    '/api/galleries',
    galleryApi.getAll,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    galleries: data || [],
    isLoading,
    error,
  };
};

export const useGallery = (id: string) => {
  const { data, error, isLoading } = useSWR<Gallery>(
    id ? `/api/galleries/${id}` : null,
    () => galleryApi.getById(id),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    gallery: data,
    isLoading,
    error,
  };
};

export const useFeaturedGalleries = () => {
  const { data, error, isLoading } = useSWR<Gallery[]>(
    '/api/galleries/featured',
    galleryApi.getFeatured,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    galleries: data || [],
    isLoading,
    error,
  };
};

// Team hooks
export const useTeamMembers = () => {
  const { data, error, isLoading } = useSWR<TeamMember[]>(
    '/api/team',
    teamApi.getAll,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    members: data || [],
    isLoading,
    error,
  };
};

export const useTeamMember = (id: string) => {
  const { data, error, isLoading } = useSWR<TeamMember>(
    id ? `/api/team/${id}` : null,
    () => teamApi.getById(id),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    member: data,
    isLoading,
    error,
  };
};

// Testimonial hooks
export const useTestimonials = () => {
  const { data, error, isLoading } = useSWR<Testimonial[]>(
    '/api/testimonials',
    testimonialApi.getAll,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    testimonials: data || [],
    isLoading,
    error,
  };
};

export const useFeaturedTestimonials = () => {
  const { data, error, isLoading } = useSWR<Testimonial[]>(
    '/api/testimonials/featured',
    testimonialApi.getFeatured,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    testimonials: data || [],
    isLoading,
    error,
  };
};

// Service hooks
export const useServices = () => {
  const { data, error, isLoading } = useSWR<Service[]>(
    '/api/services',
    serviceApi.getAll,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    services: data || [],
    isLoading,
    error,
  };
};

export const useService = (id: string) => {
  const { data, error, isLoading } = useSWR<Service>(
    id ? `/api/services/${id}` : null,
    () => serviceApi.getById(id),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    service: data,
    isLoading,
    error,
  };
};

// Booking hook
export const useCreateBooking = () => {
  const createBooking = async (
    formData: BookingFormData
  ): Promise<BookingResponse> => {
    try {
      return await bookingApi.create(formData);
    } catch (error) {
      console.error('[v0] Booking creation failed:', error);
      throw error;
    }
  };

  return { createBooking };
};
