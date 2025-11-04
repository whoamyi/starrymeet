// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  profile_picture?: string;
  bio?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

// Celebrity Types
export interface Celebrity {
  id: string;
  name: string;
  slug: string;
  category: string;
  profile_image: string;
  follower_count: number;
  price_per_hour: number;
  bio?: string;
  available_dates?: string[];
  rating?: number;
  response_time?: string;
  status: 'active' | 'inactive';
  location?: string;
  verified?: boolean;
  tier?: string;
  total_bookings?: number;
  review_count?: number;
  average_rating?: number;
  availability?: AvailabilitySlot[];
  reviews?: Review[];
  created_at: string;
  updated_at: string;
  // Backend fields (from database)
  min_price?: number;
  availability_count?: number;
  country?: string;
  review_rate?: number;
  picture_url?: string;
  virtual_available?: boolean;
  physical_available?: boolean;
}

export interface AvailabilitySlot {
  id: string;
  meeting_type: 'physical' | 'virtual';
  city?: string;
  date: string;
  time: string;
  duration: number;
  price_cents: number;
  slots_remaining: number;
}

export interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  meeting_type?: string;
}

export interface CelebritySettings {
  celebrity_id: string;
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  custom_price?: number;
  availability_status?: string;
}

// Booking Types
export interface Booking {
  id: string;
  user_id: string;
  celebrity_id: string;
  booking_date: string;
  booking_time: string;
  duration_hours: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  celebrity?: Celebrity;
  created_at: string;
  updated_at: string;
}

// Message Types
export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  sender?: {
    id: string;
    username: string;
    profile_picture?: string;
  };
  recipient?: {
    id: string;
    username: string;
    profile_picture?: string;
  };
  created_at: string;
}

export interface Conversation {
  user: {
    id: string;
    username: string;
    profile_picture?: string;
  };
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

// Saved/Favorite Types
export interface SavedCelebrity {
  id: string;
  user_id: string;
  celebrity_id: string;
  celebrity?: Celebrity;
  created_at: string;
}

// Payment Types
export interface PaymentMethod {
  id: string;
  user_id: string;
  type: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay';
  last_four?: string;
  brand?: string;
  is_default: boolean;
  created_at: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Dashboard Types
export interface DashboardData {
  upcoming_meetings: Booking[];
  past_meetings: Booking[];
  pending_requests: Booking[];
  saved_celebrities: SavedCelebrity[];
  notifications: any[];
  stats: {
    upcoming_count: number;
    completed_count: number;
    pending_count: number;
    saved_count: number;
    unread_notifications_count: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Filter/Query Types
export interface CelebrityFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'popular';
}

export interface BookingFilters {
  status?: Booking['status'];
  date_from?: string;
  date_to?: string;
}
