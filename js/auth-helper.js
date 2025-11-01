/**
 * Authentication Helper - Shared across all protected pages
 * Adapted for StarryMeet system
 */

class AuthHelper {
    static API_BASE = window.API_BASE_URL || 'https://starrymeet-backend.onrender.com';

    static getToken() {
        return localStorage.getItem('starryMeetToken') || this.getCookie('token');
    }

    static getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    static async checkAuth() {
        const token = this.getToken();
        if (!token) {
            window.location.href = 'auth.html';
            return null;
        }

        try {
            const response = await fetch(`${this.API_BASE}/api/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                this.clearAuth();
                window.location.href = 'auth.html';
                return null;
            }

            const result = await response.json();
            return result.data || result;
        } catch (error) {
            console.error('Auth check failed:', error);
            this.clearAuth();
            window.location.href = 'auth.html';
            return null;
        }
    }

    static async apiCall(url, options = {}) {
        const token = this.getToken();
        const fullUrl = url.startsWith('http') ? url : `${this.API_BASE}${url}`;

        const defaultOptions = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        const response = await fetch(fullUrl, { ...options, ...defaultOptions });

        if (response.status === 401) {
            this.clearAuth();
            window.location.href = 'auth.html';
            throw new Error('Unauthorized');
        }

        return response;
    }

    static clearAuth() {
        localStorage.removeItem('starryMeetToken');
        localStorage.removeItem('starryMeetUser');
        localStorage.removeItem('starrymeet_session');
        localStorage.removeItem('starrymeet_user');
    }

    static showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
            padding: 12px 24px; background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white; border-radius: 10px; font-weight: 600; z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideUp 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    static getUserInitials(firstName, lastName) {
        const first = firstName ? firstName.charAt(0).toUpperCase() : '';
        const last = lastName ? lastName.charAt(0).toUpperCase() : '';
        return first + last || 'U';
    }

    static formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    static formatTime(timeString) {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }
}

// Add slide animations
if (!document.getElementById('auth-helper-styles')) {
    const style = document.createElement('style');
    style.id = 'auth-helper-styles';
    style.textContent = `
        @keyframes slideUp {
            from { opacity: 0; transform: translate(-50%, 20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes slideOut {
            from { opacity: 1; transform: translate(-50%, 0); }
            to { opacity: 0; transform: translate(-50%, -20px); }
        }
    `;
    document.head.appendChild(style);
}

// Export for global use
window.AuthHelper = AuthHelper;
