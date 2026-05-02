import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export const mediaUrl = (url?: string | null) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('/images')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

export interface BackendResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ServiceItem {
  id: string;
  serviceName: string;
  shortDescription?: string | null;
  fullDescription?: string | null;
  includedItems?: string[];
  imageUrl?: string | null;
  displayOrder?: number;
  isActive: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  fileUrl?: string | null;
  thumbnailUrl?: string | null;
  mediaType?: string;
  categoryId?: string | null;
  categoryName?: string | null;
  category?: {
    id: string;
    name: string;
    slug?: string | null;
  } | null;
  location?: string | null;
  clientName?: string | null;
  isFeatured?: boolean;
  isPublic?: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  description?: string | null;
  videoUrl: string;
  thumbnailUrl?: string | null;
  categoryId?: string | null;
  clientName?: string | null;
  isFeatured?: boolean;
  isPublic?: boolean;
}

export interface PackageItem {
  id: string;
  packageName: string;
  description?: string | null;
  category?: string | null;
  displayOrder?: number;
  isActive: boolean;
}

export interface ProjectItem {
  id: string;
  projectName: string;
  clientName?: string | null;
  projectDate?: string | null;
  description?: string | null;
  isFeatured?: boolean;
}

export interface HeroCarouselItem {
  imageUrl: string;
  title: string;
  subtitle: string;
}

export interface HeroSectionPayload {
  id: string;
  headlineLine1: string;
  headlineLine2: string;
  introText: string;
  mosaicImages: [string, string, string];
  carouselItems: HeroCarouselItem[];
}

export interface GalleryCategoryItem {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
}

export interface BookingPayload {
  fullName: string;
  phoneNumber: string;
  email: string;
  serviceRequired: string;
  projectType?: string;
  projectDate?: string;
  projectTime?: string;
  location?: string;
  duration?: string;
  mediaType?: string;
  expectedGuests?: number;
  budgetRange?: string;
  specialRequirements?: string;
  message?: string;
}

export interface ContactPayload {
  fullName: string;
  phoneNumber?: string;
  email: string;
  subject: string;
  message: string;
}

export interface TeamApplicationPayload {
  fullName: string;
  phoneNumber: string;
  email: string;
  location?: string;
  skillArea: string;
  experienceLevel: string;
  portfolioLink?: string;
  socialMediaLink?: string;
  equipmentOwned?: string;
  availability?: string;
  message?: string;
}

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export type AdminRoleDto = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface AdminAuthData {
  token: string;
  admin: {
    id: string;
    email: string;
    fullName?: string | null;
    role: AdminRoleDto;
  };
}

export interface AdminRegisterPayload {
  email: string;
  password: string;
  fullName?: string;
  role?: AdminRoleDto;
}

export interface AdminUserRow {
  id: string;
  email: string;
  fullName?: string | null;
  role: AdminRoleDto;
  createdAt: string;
}

export interface AdminInvitePayload {
  email: string;
  fullName?: string;
  role: AdminRoleDto;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error?.response?.data || error)
);

const authHeader = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });
const multipartAuthHeader = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
});

export const publicApi = {
  listServices: async () => (await apiClient.get<BackendResponse<PaginatedResult<ServiceItem>>>('/services')).data.data.items,
  listGallery: async () => (await apiClient.get<BackendResponse<PaginatedResult<GalleryItem>>>('/gallery')).data.data.items,
  listFeaturedGallery: async () =>
    (await apiClient.get<BackendResponse<PaginatedResult<GalleryItem>>>('/gallery?featured=true')).data.data.items,
  listVideos: async () => (await apiClient.get<BackendResponse<PaginatedResult<VideoItem>>>('/videos')).data.data.items,
  listPackages: async () => (await apiClient.get<BackendResponse<PaginatedResult<PackageItem>>>('/packages')).data.data.items,
  listProjects: async () => (await apiClient.get<BackendResponse<PaginatedResult<ProjectItem>>>('/projects')).data.data.items,
  getHeroSection: async () => (await apiClient.get<BackendResponse<HeroSectionPayload>>('/hero')).data.data,
  listGalleryCategories: async () => (await apiClient.get<BackendResponse<GalleryCategoryItem[]>>('/gallery-categories')).data.data,
  createBooking: async (payload: BookingPayload) => (await apiClient.post<BackendResponse<any>>('/bookings', payload)).data,
  createContactMessage: async (payload: ContactPayload) => (await apiClient.post<BackendResponse<any>>('/contact', payload)).data,
  createTeamApplication: async (payload: TeamApplicationPayload) =>
    (await apiClient.post<BackendResponse<any>>('/team/apply', payload)).data,
};

export const adminApi = {
  login: async (payload: AdminLoginPayload) => (await apiClient.post<BackendResponse<AdminAuthData>>('/admin/login', payload)).data.data,
  forgotPassword: async (email: string) =>
    (await apiClient.post<BackendResponse<unknown>>('/admin/forgot-password', { email })).data,
  resetPassword: async (payload: { token: string; password: string }) =>
    (await apiClient.post<BackendResponse<unknown>>('/admin/reset-password', payload)).data,
  register: async (token: string, payload: AdminRegisterPayload) =>
    (await apiClient.post<BackendResponse<any>>('/admin/register', payload, authHeader(token))).data,
  profile: async (token: string) =>
    (await apiClient.get<BackendResponse<{ id: string; email: string; fullName?: string | null; role: AdminRoleDto }>>('/admin/profile', authHeader(token))).data.data,
  listAdminUsers: async (token: string) =>
    (await apiClient.get<BackendResponse<AdminUserRow[]>>('/admin/users', authHeader(token))).data.data,
  inviteAdminUser: async (token: string, payload: AdminInvitePayload) =>
    (await apiClient.post<BackendResponse<AdminUserRow>>('/admin/users', payload, authHeader(token))).data.data,
  updateAdminUser: async (token: string, id: string, payload: { fullName?: string | null; role?: AdminRoleDto }) =>
    (await apiClient.patch<BackendResponse<AdminUserRow>>(`/admin/users/${id}`, payload, authHeader(token))).data.data,
  deleteAdminUser: async (token: string, id: string) =>
    (await apiClient.delete<BackendResponse<unknown>>(`/admin/users/${id}`, authHeader(token))).data,
  overview: async (token: string) => (await apiClient.get<BackendResponse<Record<string, number>>>('/admin/overview', authHeader(token))).data.data,

  listBookings: async (token: string) =>
    (await apiClient.get<BackendResponse<PaginatedResult<any>>>('/admin/bookings?page=1&limit=20&sortBy=createdAt&order=desc', authHeader(token))).data.data.items,
  getBooking: async (token: string, id: string) =>
    (await apiClient.get<BackendResponse<any>>(`/admin/bookings/${id}`, authHeader(token))).data.data,
  updateBooking: async (token: string, id: string, payload: Record<string, unknown>) =>
    (await apiClient.put<BackendResponse<any>>(`/admin/bookings/${id}`, payload, authHeader(token))).data,
  deleteBooking: async (token: string, id: string) =>
    (await apiClient.delete<BackendResponse<any>>(`/admin/bookings/${id}`, authHeader(token))).data,

  uploadGalleryFiles: async (token: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return (await apiClient.post<BackendResponse<any>>('/admin/gallery/upload', formData, multipartAuthHeader(token))).data;
  },
  createGalleryItem: async (token: string, formData: FormData) =>
    (await apiClient.post<BackendResponse<any>>('/admin/gallery', formData, multipartAuthHeader(token))).data,
  updateGalleryItem: async (token: string, id: string, formData: FormData) =>
    (await apiClient.put<BackendResponse<any>>(`/admin/gallery/${id}`, formData, multipartAuthHeader(token))).data,
  deleteGalleryItem: async (token: string, id: string) =>
    (await apiClient.delete<BackendResponse<any>>(`/admin/gallery/${id}`, authHeader(token))).data,
  createGalleryCategory: async (token: string, payload: Record<string, unknown>) =>
    (await apiClient.post<BackendResponse<any>>('/admin/gallery/categories', payload, authHeader(token))).data,
  updateGalleryCategory: async (token: string, id: string, payload: Record<string, unknown>) =>
    (await apiClient.put<BackendResponse<any>>(`/admin/gallery/categories/${id}`, payload, authHeader(token))).data,
  deleteGalleryCategory: async (token: string, id: string) =>
    (await apiClient.delete<BackendResponse<any>>(`/admin/gallery/categories/${id}`, authHeader(token))).data,

  createVideo: async (token: string, formData: FormData) =>
    (await apiClient.post<BackendResponse<any>>('/admin/videos', formData, multipartAuthHeader(token))).data,
  updateVideo: async (token: string, id: string, formData: FormData) =>
    (await apiClient.put<BackendResponse<any>>(`/admin/videos/${id}`, formData, multipartAuthHeader(token))).data,
  deleteVideo: async (token: string, id: string) =>
    (await apiClient.delete<BackendResponse<any>>(`/admin/videos/${id}`, authHeader(token))).data,

  listMessages: async (token: string) =>
    (await apiClient.get<BackendResponse<PaginatedResult<any>>>('/admin/messages?page=1&limit=20', authHeader(token))).data.data.items,
  updateMessage: async (token: string, id: string, payload: Record<string, unknown>) =>
    (await apiClient.put<BackendResponse<any>>(`/admin/messages/${id}`, payload, authHeader(token))).data,
  deleteMessage: async (token: string, id: string) =>
    (await apiClient.delete<BackendResponse<any>>(`/admin/messages/${id}`, authHeader(token))).data,

  listTeamApplications: async (token: string) =>
    (await apiClient.get<BackendResponse<PaginatedResult<any>>>('/admin/team-applications?page=1&limit=20', authHeader(token))).data.data.items,
  updateTeamApplication: async (token: string, id: string, payload: Record<string, unknown>) =>
    (await apiClient.put<BackendResponse<any>>(`/admin/team-applications/${id}`, payload, authHeader(token))).data,
  deleteTeamApplication: async (token: string, id: string) =>
    (await apiClient.delete<BackendResponse<any>>(`/admin/team-applications/${id}`, authHeader(token))).data,

  listServices: async (token: string) =>
    (await apiClient.get<BackendResponse<PaginatedResult<ServiceItem>>>('/admin/services?page=1&limit=20', authHeader(token))).data.data.items,
  createService: async (token: string, formData: FormData) =>
    (await apiClient.post<BackendResponse<any>>('/admin/services', formData, multipartAuthHeader(token))).data,
  updateService: async (token: string, id: string, formData: FormData) =>
    (await apiClient.put<BackendResponse<any>>(`/admin/services/${id}`, formData, multipartAuthHeader(token))).data,
  deleteService: async (token: string, id: string) =>
    (await apiClient.delete<BackendResponse<any>>(`/admin/services/${id}`, authHeader(token))).data,
  getHeroSection: async (token: string) =>
    (await apiClient.get<BackendResponse<HeroSectionPayload>>('/admin/hero', authHeader(token))).data.data,
  updateHeroSection: async (token: string, formData: FormData) =>
    (await apiClient.put<BackendResponse<HeroSectionPayload>>('/admin/hero', formData, multipartAuthHeader(token))).data.data,

  createPackage: async (token: string, payload: Record<string, unknown>) =>
    (await apiClient.post<BackendResponse<any>>('/admin/packages', payload, authHeader(token))).data,
  updatePackage: async (token: string, id: string, payload: Record<string, unknown>) =>
    (await apiClient.put<BackendResponse<any>>(`/admin/packages/${id}`, payload, authHeader(token))).data,
  deletePackage: async (token: string, id: string) =>
    (await apiClient.delete<BackendResponse<any>>(`/admin/packages/${id}`, authHeader(token))).data,

  createProject: async (token: string, payload: Record<string, unknown>) =>
    (await apiClient.post<BackendResponse<any>>('/admin/projects', payload, authHeader(token))).data,
  updateProject: async (token: string, id: string, payload: Record<string, unknown>) =>
    (await apiClient.put<BackendResponse<any>>(`/admin/projects/${id}`, payload, authHeader(token))).data,
  deleteProject: async (token: string, id: string) =>
    (await apiClient.delete<BackendResponse<any>>(`/admin/projects/${id}`, authHeader(token))).data,

  listGallery: async (token: string) =>
    (await apiClient.get<BackendResponse<PaginatedResult<GalleryItem>>>('/admin/gallery?page=1&limit=100', authHeader(token))).data.data.items,
  listVideos: async (_token: string) => publicApi.listVideos(),
  listPackages: async (_token: string) => publicApi.listPackages(),
  listProjects: async (_token: string) => publicApi.listProjects(),
  listGalleryCategories: async (_token: string) => publicApi.listGalleryCategories(),
};

export default apiClient;
