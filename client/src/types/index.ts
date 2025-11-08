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

// Dashboard-specific types (flattened from backend)
export interface DashboardBooking {
  id: string;
  booking_number: string;
  status: string;
  meeting_date: string;
  duration_minutes: number;
  total_amount: number;
  celebrity_name: string;
  celebrity_slug: string;
  celebrity_image: string;
  category: string;
  meeting_type: string;
  location: string;
  completed_at?: string;
  has_review?: boolean;
  created_at?: string;
  booking_date?: string;
  booking_time?: string;
}

export interface DashboardSavedCelebrity {
  saved_id: string;
  saved_at: string;
  celebrity_id: string;
  name: string;
  slug: string;
  avatar_url: string;
  min_price: number;
  category: string;
  tier?: string;
}

// Dashboard Types
export interface DashboardData {
  upcoming_meetings: DashboardBooking[];
  past_meetings: DashboardBooking[];
  pending_requests: DashboardBooking[];
  saved_celebrities: DashboardSavedCelebrity[];
  applications: DashboardApplication[];
  notifications: any[];
  stats: {
    upcoming_count: number;
    completed_count: number;
    pending_count: number;
    saved_count: number;
    unread_notifications_count: number;
    applications_count: number;
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

// Application Types
export interface MeetingApplication {
  id: string;
  application_number: string;
  user_id: string;
  celebrity_id: string;
  application_type: 'professional' | 'personal';
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'cancelled';

  // Common fields
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;

  // Professional fields
  professional_summary?: string;
  why_celebrity?: string;
  meeting_goals?: string;
  what_you_bring?: string;
  next_steps?: string;
  linkedin_url?: string;
  company_website?: string;
  portfolio_url?: string;
  social_media?: string;

  // Personal fields
  your_story?: string;
  what_they_mean?: string;
  why_now?: string;
  meeting_vision?: string;
  your_case?: string;
  additional_context?: string;
  instagram_url?: string;
  personal_links?: string;

  // Review fields
  review_notes?: string;
  reviewed_at?: string;
  reviewed_by?: string;

  created_at: string;
  updated_at: string;
}

export interface ProfessionalApplicationRequest {
  celebritySlug: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  professionalSummary: string;
  whyCelebrity: string;
  meetingGoals: string;
  whatYouBring: string;
  nextSteps: string;
  linkedinUrl: string;
  companyWebsite?: string;
  portfolioUrl?: string;
  socialMedia?: string;
}

export interface PersonalApplicationRequest {
  celebritySlug: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  yourStory: string;
  whatTheyMean: string;
  whyNow: string;
  meetingVision: string;
  yourCase: string;
  additionalContext?: string;
  instagramUrl?: string;
  personalLinks?: string;
}

export interface ApplicationResponse {
  application_number: string;
  message: string;
}

export interface DashboardApplication {
  id: string;
  application_number: string;
  application_type: 'professional' | 'personal';
  status: string;
  created_at: string;
  celebrity_name: string;
  celebrity_slug: string;
  celebrity_image: string;
  category: string;
}
