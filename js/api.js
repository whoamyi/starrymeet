/**
 * StarryMeet API Client
 * Handles all communication with the backend API
 */

// Environment-aware API URL configuration
const getAPIBaseURL = () => {
    // Check if we're in development (localhost)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
    }

    // Production - Render backend URL
    return 'https://starrymeet-backend.onrender.com/api';
};

const API_BASE_URL = getAPIBaseURL();

class APIClient {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('starryMeetToken');
        this.mockMode = false; // Flag for mock data mode
    }

    /**
     * Make HTTP request to API
     */
    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add auth token if available
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);

            // Check if response is ok (status 200-299)
            if (!response.ok && response.status !== 401) {
                // Try to parse error message
                try {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
                } catch (parseError) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            }

            const data = await response.json();

            // Handle unauthorized - clear token and redirect to login
            if (response.status === 401) {
                this.clearAuth();
                // Optionally redirect to login
                // window.location.href = '/login.html';
            }

            if (!data.success && response.status >= 400) {
                throw new Error(data.error?.message || 'API request failed');
            }

            return data;
        } catch (error) {
            // Enhanced error handling with better messages
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                console.error('❌ Backend server is not running or not accessible');
                console.error('   → Make sure the backend server is started at', this.baseURL);
                console.error('   → Run: cd backend && npm run dev');

                // Create a more user-friendly error
                const backendError = new Error('Backend server is not available. Please start the server or contact support.');
                backendError.code = 'BACKEND_UNAVAILABLE';
                throw backendError;
            }

            console.error('API Error:', error);
            throw error;
        }
    }

    // ==========================================
    // AUTHENTICATION
    // ==========================================

    /**
     * Register new user
     */
    async register(userData) {
        const response = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        if (response.success) {
            this.setAuth(response.data.token, response.data.user);
        }

        return response;
    }

    /**
     * Login user
     */
    async login(email, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (response.success) {
            this.setAuth(response.data.token, response.data.user);
        }

        return response;
    }

    /**
     * Get current user
     */
    async getMe() {
        return this.request('/auth/me');
    }

    /**
     * Logout user
     */
    logout() {
        this.clearAuth();
        window.location.href = '/index.html';
    }

    /**
     * Set authentication token and user data
     */
    setAuth(token, user) {
        this.token = token;
        localStorage.setItem('starryMeetToken', token);
        localStorage.setItem('starryMeetUser', JSON.stringify(user));
    }

    /**
     * Clear authentication
     */
    clearAuth() {
        this.token = null;
        localStorage.removeItem('starryMeetToken');
        localStorage.removeItem('starryMeetUser');
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.token;
    }

    /**
     * Get current user from localStorage
     */
    getCurrentUser() {
        const userStr = localStorage.getItem('starryMeetUser');
        return userStr ? JSON.parse(userStr) : null;
    }

    // ==========================================
    // CELEBRITIES
    // ==========================================

    /**
     * Get all celebrities with optional filters
     */
    async getCelebrities(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/celebrities?${params.toString()}`);
    }

    /**
     * Get single celebrity by ID or username
     */
    async getCelebrity(id) {
        return this.request(`/celebrities/${id}`);
    }

    /**
     * Get celebrity reviews
     */
    async getCelebrityReviews(id, limit = 10, offset = 0) {
        return this.request(`/celebrities/${id}/reviews?limit=${limit}&offset=${offset}`);
    }

    // ==========================================
    // BOOKINGS
    // ==========================================

    /**
     * Create new booking
     */
    async createBooking(bookingData) {
        return this.request('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
    }

    /**
     * Get user's bookings
     */
    async getMyBookings(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/bookings?${params.toString()}`);
    }

    /**
     * Get booking by ID
     */
    async getBooking(id) {
        return this.request(`/bookings/${id}`);
    }

    /**
     * Cancel booking
     */
    async cancelBooking(id) {
        return this.request(`/bookings/${id}/cancel`, {
            method: 'PATCH'
        });
    }

    // ==========================================
    // PAYMENTS
    // ==========================================

    /**
     * Create Stripe payment intent
     */
    async createPaymentIntent(bookingId) {
        return this.request('/payments/create-intent', {
            method: 'POST',
            body: JSON.stringify({ booking_id: bookingId })
        });
    }
}

// Create singleton instance
const api = new APIClient();

// Make it available globally
if (typeof window !== 'undefined') {
    window.api = api;
}
