/**
 * API Client
 * Centralized API communication for StarryMeet
 */

class APIClient {
    constructor() {
        this.baseURL = window.API_BASE_URL || 'https://starrymeet-backend.onrender.com';
    }

    getToken() {
        return localStorage.getItem('starryMeetToken') || this.getCookie('token');
    }

    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    async request(endpoint, options = {}) {
        const token = this.getToken();

        const config = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(`${this.baseURL}/api${endpoint}`, config);

            // Handle 401 Unauthorized
            if (response.status === 401) {
                localStorage.removeItem('starryMeetToken');
                window.location.href = 'auth.html';
                throw new Error('Unauthorized');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Convenience methods
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    async put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    async patch(endpoint, body) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined
        });
    }
}

// Create global instance
window.api = new APIClient();
