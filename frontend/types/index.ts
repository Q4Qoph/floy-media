// Gallery types
export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  title?: string;
}

export interface Gallery {
  id: string;
  title: string;
  description?: string;
  images: GalleryImage[];
  category?: string;
}

// Team types
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image: string;
  email?: string;
  phone?: string;
}

// Testimonial types
export interface Testimonial {
  id: string;
  clientName: string;
  clientRole?: string;
  text: string;
  rating?: number;
  image?: string;
}

// Booking types
export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  message: string;
  budget?: string;
  timeline?: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  bookingId?: string;
}

// Service types
export interface Service {
  id: string;
  title: string;
  description: string;
  image?: string;
  icon?: string;
  price?: string;
  features?: string[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
