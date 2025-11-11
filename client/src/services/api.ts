import axios, { type AxiosError, type AxiosInstance } from 'axios';
import type {
  User,
  Celebrity,
  Booking,
  Message,
  SavedCelebrity,
  PaymentMethod,
  LoginRequest,
  SignupRequest,
  AuthResponse,
  DashboardData,
  ApiResponse,
  ApiError,
  PaginatedResponse,
  CelebrityFilters,
  BookingFilters,
  Conversation,
  MeetingApplication,
  ProfessionalApplicationRequest,
  PersonalApplicationRequest,
  ApplicationResponse,
  DashboardApplication,
} from '../types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.PROD
    ? 'https://starrymeet-backend.onrender.com/api'
    : '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Only redirect if we're on a protected route (dashboard, profile, messages, bookings, favorites, settings)
      const protectedRoutes = ['/dashboard', '/profile', '/messages', '/bookings', '/favorites', '/settings'];
      const isProtectedRoute = protectedRoutes.some(route => window.location.pathname.startsWith(route));

      if (isProtectedRoute) {
        // Unauthorized on protected route - clear auth and redirect to login
        localStorage.removeItem('auth-storage');
        window.location.href = '/auth';
      }
      // For public routes, just reject the error without redirecting
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<{ success: boolean; session: { token: string }; user: User }>('/auth/signin', data);
    return {
      token: response.data.session.token,
      user: response.data.user
    };
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post<{ success: boolean; session: { token: string }; user: User }>('/auth/signup', data);
    return {
      token: response.data.session.token,
      user: response.data.user
    };
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/signout');
  },
};

// User Profile API
export const profileApi = {
  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/profile');
    return response.data.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>('/profile', data);
    return response.data.data;
  },

  uploadProfilePicture: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    const response = await api.post<ApiResponse<User>>('/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};

// Dashboard API
export const dashboardApi = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await api.get<ApiResponse<DashboardData>>('/dashboard/user');
    return response.data.data;
  },
};

// Celebrity API
export const celebrityApi = {
  getAll: async (filters?: CelebrityFilters): Promise<Celebrity[]> => {
    const response = await api.get<ApiResponse<{ celebrities: Celebrity[] }>>('/celebrity-profiles', {
      params: filters,
    });
    return response.data.data.celebrities;
  },

  getFeatured: async (limit: number = 6): Promise<Celebrity[]> => {
    const response = await api.get<ApiResponse<{ celebrities: Celebrity[] }>>('/celebrity-profiles/featured', {
      params: { limit },
    });
    return response.data.data.celebrities;
  },

  getBySlug: async (slug: string): Promise<Celebrity> => {
    const response = await api.get<ApiResponse<{ profile: any }>>(`/celebrity-profiles/${slug}`);
    const profile = response.data.data.profile;

    // Flatten availability from {physical: [], virtual: []} to single array
    if (profile.availability && typeof profile.availability === 'object') {
      const physical = profile.availability.physical || [];
      const virtual = profile.availability.virtual || [];

      // Combine and normalize the data
      profile.availability = [...physical, ...virtual].map((slot: any) => ({
        ...slot,
        slots_remaining: Number(slot.slots_remaining) || 0,
        price_cents: Number(slot.price_cents) || 0,
        duration: Number(slot.duration) || 0,
      }));
    }

    return profile;
  },

  search: async (query: string): Promise<Celebrity[]> => {
    const response = await api.get<ApiResponse<Celebrity[]>>('/celebrity-profiles/search', {
      params: { q: query },
    });
    return response.data.data;
  },
};

// Bookings API
export const bookingsApi = {
  getAll: async (filters?: BookingFilters): Promise<Booking[]> => {
    const response = await api.get<ApiResponse<{ bookings: Booking[]; pagination: any }>>('/bookings', {
      params: filters,
    });
    return response.data.data.bookings;
  },

  getById: async (id: string): Promise<Booking> => {
    const response = await api.get<ApiResponse<{ booking: Booking }>>(`/bookings/${id}`);
    return response.data.data.booking;
  },

  create: async (data: {
    celebrity_id: string;
    booking_date: string;
    booking_time: string;
    duration_hours: number;
  }): Promise<Booking> => {
    const response = await api.post<ApiResponse<{ booking: Booking }>>('/bookings', data);
    return response.data.data.booking;
  },

  cancel: async (id: string): Promise<void> => {
    await api.delete(`/bookings/${id}`);
  },
};

// Messages API
export const messagesApi = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get<ApiResponse<Conversation[]>>('/messages/conversations');
    return response.data.data;
  },

  getMessages: async (userId: string): Promise<Message[]> => {
    const response = await api.get<ApiResponse<Message[]>>(`/messages/${userId}`);
    return response.data.data;
  },

  send: async (data: { recipient_id: string; content: string }): Promise<Message> => {
    const response = await api.post<ApiResponse<Message>>('/messages', data);
    return response.data.data;
  },

  markAsRead: async (messageId: string): Promise<void> => {
    await api.put(`/messages/${messageId}/read`);
  },
};

// Saved/Favorites API
export const savedApi = {
  getAll: async (): Promise<SavedCelebrity[]> => {
    const response = await api.get<ApiResponse<SavedCelebrity[]>>('/saved');
    return response.data.data;
  },

  add: async (celebrityId: string): Promise<SavedCelebrity> => {
    const response = await api.post<ApiResponse<SavedCelebrity>>('/saved', {
      celebrity_id: celebrityId,
    });
    return response.data.data;
  },

  remove: async (celebrityId: string): Promise<void> => {
    await api.delete(`/saved/${celebrityId}`);
  },

  check: async (celebrityId: string): Promise<boolean> => {
    try {
      const response = await api.get<ApiResponse<{ is_saved: boolean }>>(
        `/saved/check/${celebrityId}`
      );
      return response.data.data.is_saved;
    } catch {
      return false;
    }
  },
};

// Payment Methods API
export const paymentApi = {
  getAll: async (): Promise<PaymentMethod[]> => {
    const response = await api.get<ApiResponse<PaymentMethod[]>>('/payment-methods');
    return response.data.data;
  },

  add: async (data: {
    type: PaymentMethod['type'];
    last_four?: string;
    brand?: string;
  }): Promise<PaymentMethod> => {
    const response = await api.post<ApiResponse<PaymentMethod>>('/payment-methods', data);
    return response.data.data;
  },

  setDefault: async (id: string): Promise<void> => {
    await api.put(`/payment-methods/${id}/default`);
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/payment-methods/${id}`);
  },
};

// Applications API
export const applicationApi = {
  submitProfessional: async (data: ProfessionalApplicationRequest): Promise<ApplicationResponse> => {
    const response = await api.post<ApiResponse<ApplicationResponse>>('/applications/professional', data);
    return response.data.data;
  },

  submitPersonal: async (data: PersonalApplicationRequest): Promise<ApplicationResponse> => {
    const response = await api.post<ApiResponse<ApplicationResponse>>('/applications/personal', data);
    return response.data.data;
  },

  getAll: async (): Promise<DashboardApplication[]> => {
    const response = await api.get<ApiResponse<DashboardApplication[]>>('/applications');
    return response.data.data;
  },

  getById: async (id: string): Promise<MeetingApplication> => {
    const response = await api.get<ApiResponse<MeetingApplication>>(`/applications/${id}`);
    return response.data.data;
  },

  updateStatus: async (id: string, status: string, notes?: string): Promise<void> => {
    await api.patch(`/applications/${id}/status`, { status, notes });
  },
};

export default api;

// ============================================
// ADMIN PANEL APIs
// ============================================

// Admin Dashboard API
export const adminDashboardApi = {
  getStats: async (): Promise<AdminDashboardStats> => {
    const response = await api.get<ApiResponse<AdminDashboardStats>>('/admin/dashboard/stats');
    return response.data.data;
  },

  getCelebrityOverview: async (category?: string): Promise<AdminCelebrityOverview[]> => {
    const response = await api.get<ApiResponse<AdminCelebrityOverview[]>>('/admin/dashboard/celebrity-overview', {
      params: { category }
    });
    return response.data.data;
  },

  getRecentActivity: async (limit: number = 20): Promise<AdminRecentActivity[]> => {
    const response = await api.get<ApiResponse<AdminRecentActivity[]>>('/admin/dashboard/recent-activity', {
      params: { limit }
    });
    return response.data.data;
  },
};

// Admin Messages API
export const adminMessagesApi = {
  getConversationsByCelebrity: async (): Promise<AdminConversationByCelebrity[]> => {
    const response = await api.get<ApiResponse<AdminConversationByCelebrity[]>>('/admin/messages/by-celebrity');
    return response.data.data;
  },

  getCelebrityConversations: async (celebrityId: string, status?: string): Promise<AdminConversation[]> => {
    const response = await api.get<ApiResponse<AdminConversation[]>>(`/admin/messages/celebrity/${celebrityId}`, {
      params: { status }
    });
    return response.data.data;
  },

  getCelebrityUserMessages: async (celebrityId: string, userId: string): Promise<AdminMessage[]> => {
    const response = await api.get<ApiResponse<AdminMessage[]>>(`/admin/messages/celebrity/${celebrityId}/user/${userId}`);
    return response.data.data;
  },

  sendMessageAsCelebrity: async (celebrityId: string, data: AdminSendMessageRequest): Promise<Message> => {
    const response = await api.post<ApiResponse<Message>>(`/admin/messages/celebrity/${celebrityId}/send`, data);
    return response.data.data;
  },

  updateConversationStatus: async (conversationId: string, data: AdminUpdateConversationStatusRequest): Promise<void> => {
    await api.patch(`/admin/messages/conversation/${conversationId}/status`, data);
  },

  getMessagingStats: async (): Promise<AdminMessagingStats> => {
    const response = await api.get<ApiResponse<AdminMessagingStats>>('/admin/messages/stats');
    return response.data.data;
  },
};

// Admin Applications API
export const adminApplicationsApi = {
  getOverview: async (): Promise<AdminApplicationOverview[]> => {
    const response = await api.get<ApiResponse<AdminApplicationOverview[]>>('/admin/applications/overview');
    return response.data.data;
  },

  getCelebrityApplications: async (
    celebrityId: string,
    filters?: { status?: string; type?: string; limit?: number; offset?: number }
  ): Promise<{ data: AdminApplicationDetail[]; pagination: { total: number; limit: number; offset: number } }> => {
    const response = await api.get<ApiResponse<AdminApplicationDetail[]>>(`/admin/applications/celebrity/${celebrityId}`, {
      params: filters
    });
    return response.data as any;
  },

  getApplicationDetail: async (applicationId: string): Promise<AdminApplicationDetail> => {
    const response = await api.get<ApiResponse<AdminApplicationDetail>>(`/admin/applications/${applicationId}`);
    return response.data.data;
  },

  updateApplicationStatus: async (applicationId: string, data: AdminUpdateApplicationStatusRequest): Promise<void> => {
    await api.patch(`/admin/applications/${applicationId}/status`, data);
  },

  addApplicationNotes: async (applicationId: string, notes: string): Promise<void> => {
    await api.post(`/admin/applications/${applicationId}/notes`, { notes });
  },

  getApplicationStats: async (): Promise<AdminApplicationStats> => {
    const response = await api.get<ApiResponse<AdminApplicationStats>>('/admin/applications/stats');
    return response.data.data;
  },

  getRecentApplications: async (limit: number = 10): Promise<AdminApplicationDetail[]> => {
    const response = await api.get<ApiResponse<AdminApplicationDetail[]>>('/admin/applications/recent', {
      params: { limit }
    });
    return response.data.data;
  },
};
