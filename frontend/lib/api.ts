import axios from 'axios';
import type {
  Gallery,
  TeamMember,
  Testimonial,
  Service,
  BookingFormData,
  BookingResponse,
  ApiResponse,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[v0] API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Gallery endpoints
export const galleryApi = {
  getAll: async (): Promise<Gallery[]> => {
    const response = await apiClient.get<Gallery[]>('/galleries');
    return response.data;
  },
  getById: async (id: string): Promise<Gallery> => {
    const response = await apiClient.get<Gallery>(`/galleries/${id}`);
    return response.data;
  },
  getFeatured: async (): Promise<Gallery[]> => {
    const response = await apiClient.get<Gallery[]>('/galleries/featured');
    return response.data;
  },
};

// Team endpoints
export const teamApi = {
  getAll: async (): Promise<TeamMember[]> => {
    const response = await apiClient.get<TeamMember[]>('/team');
    return response.data;
  },
  getById: async (id: string): Promise<TeamMember> => {
    const response = await apiClient.get<TeamMember>(`/team/${id}`);
    return response.data;
  },
};

// Testimonials endpoints
export const testimonialApi = {
  getAll: async (): Promise<Testimonial[]> => {
    const response = await apiClient.get<Testimonial[]>('/testimonials');
    return response.data;
  },
  getFeatured: async (): Promise<Testimonial[]> => {
    const response = await apiClient.get<Testimonial[]>('/testimonials/featured');
    return response.data;
  },
};

// Services endpoints
export const serviceApi = {
  getAll: async (): Promise<Service[]> => {
    const response = await apiClient.get<Service[]>('/services');
    return response.data;
  },
  getById: async (id: string): Promise<Service> => {
    const response = await apiClient.get<Service>(`/services/${id}`);
    return response.data;
  },
};

// Booking endpoints
export const bookingApi = {
  create: async (data: BookingFormData): Promise<BookingResponse> => {
    const response = await apiClient.post<BookingResponse>('/bookings', data);
    return response.data;
  },
};

export default apiClient;
