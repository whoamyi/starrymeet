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
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('auth-storage');
      if (window.location.pathname !== '/react/auth') {
        window.location.href = '/react/auth';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/signin', data);
    return response.data.data;
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/signup', data);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
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
    const response = await api.get<ApiResponse<Celebrity[]>>('/celebrity-profiles', {
      params: filters,
    });
    return response.data.data;
  },

  getFeatured: async (limit: number = 6): Promise<Celebrity[]> => {
    const response = await api.get<ApiResponse<Celebrity[]>>('/celebrity-profiles/featured', {
      params: { limit },
    });
    return response.data.data;
  },

  getBySlug: async (slug: string): Promise<Celebrity> => {
    const response = await api.get<ApiResponse<Celebrity>>(`/celebrity-profiles/${slug}`);
    return response.data.data;
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
    const response = await api.get<ApiResponse<Booking[]>>('/bookings', {
      params: filters,
    });
    return response.data.data;
  },

  getById: async (id: string): Promise<Booking> => {
    const response = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data.data;
  },

  create: async (data: {
    celebrity_id: string;
    booking_date: string;
    booking_time: string;
    duration_hours: number;
  }): Promise<Booking> => {
    const response = await api.post<ApiResponse<Booking>>('/bookings', data);
    return response.data.data;
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

export default api;
