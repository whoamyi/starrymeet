/**
 * Dashboard.js - User Dashboard Functionality
 * Handles display of bookings, notifications, and saved celebrities
 */

class DashboardPage {
    constructor() {
        this.dashboardData = null;
        this.api = new APIClient();
        this.init();
    }

    async init() {
        // Check authentication
        const token = localStorage.getItem('starryMeetToken');
        if (!token) {
            window.location.href = 'auth.html';
            return;
        }

        // Load dashboard data
        await this.loadDashboardData();

        // Setup refresh interval
        this.setupAutoRefresh();
    }

    async loadDashboardData() {
        try {
            const response = await this.api.request('/dashboard/user');

            if (response.success && response.data) {
                this.dashboardData = response.data;
                this.renderDashboard();
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
            this.showError('Failed to load dashboard data');
        }
    }

    renderDashboard() {
        if (!this.dashboardData) return;

        // Render stats
        this.renderStats();

        // Render upcoming meetings
        this.renderUpcomingMeetings();

        // Render pending requests
        this.renderPendingRequests();

        // Render past meetings
        this.renderPastMeetings();

        // Render saved celebrities
        this.renderSavedCelebrities();

        // Render notifications
        this.renderNotifications();
    }

    renderStats() {
        const stats = this.dashboardData.stats;

        document.getElementById('upcoming-count').textContent = stats.upcoming_count || 0;
        document.getElementById('completed-count').textContent = stats.completed_count || 0;
        document.getElementById('pending-count').textContent = stats.pending_count || 0;
        document.getElementById('saved-count').textContent = stats.saved_count || 0;

        // Update notification badge
        const badge = document.getElementById('notifBadge');
        if (stats.unread_notifications_count > 0) {
            badge.textContent = stats.unread_notifications_count;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }

    renderUpcomingMeetings() {
        const container = document.getElementById('upcomingMeetings');
        if (!container) return;

        const meetings = this.dashboardData.upcoming_meetings || [];

        if (meetings.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No upcoming meetings</p>
                    <a href="browse.html" class="btn-primary">Browse Celebrities</a>
                </div>
            `;
            return;
        }

        container.innerHTML = meetings.map(meeting => `
            <div class="meeting-card" data-booking-id="${meeting.id}">
                <div class="meeting-header">
                    <img src="${meeting.celebrity_image || 'assets/images/placeholder.jpg'}" alt="${meeting.celebrity_name}" class="meeting-avatar">
                    <div class="meeting-info">
                        <h4>${meeting.celebrity_name}</h4>
                        <span class="meeting-category">${meeting.category || 'Celebrity'}</span>
                    </div>
                    <span class="meeting-status status-${meeting.status}">${this.formatStatus(meeting.status)}</span>
                </div>
                <div class="meeting-details">
                    <div class="detail-row">
                        <span class="detail-label">📅 Date:</span>
                        <span class="detail-value">${this.formatDate(meeting.meeting_date)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">⏱️ Duration:</span>
                        <span class="detail-value">${meeting.duration_minutes} minutes</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">📍 Type:</span>
                        <span class="detail-value">${meeting.meeting_type} ${meeting.location ? `- ${meeting.location}` : ''}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">💰 Amount:</span>
                        <span class="detail-value">$${parseFloat(meeting.total_amount).toLocaleString()}</span>
                    </div>
                </div>
                <div class="meeting-actions">
                    <a href="booking-details.html?id=${meeting.id}" class="btn-secondary">View Details</a>
                    <button onclick="dashboardPage.cancelBooking('${meeting.id}')" class="btn-danger">Cancel</button>
                </div>
            </div>
        `).join('');
    }

    renderPendingRequests() {
        const container = document.getElementById('pendingRequests');
        if (!container) return;

        const requests = this.dashboardData.pending_requests || [];

        if (requests.length === 0) {
            container.innerHTML = `<div class="empty-state"><p>No pending requests</p></div>`;
            return;
        }

        container.innerHTML = requests.map(request => `
            <div class="request-card" data-booking-id="${request.id}">
                <div class="request-header">
                    <img src="${request.celebrity_image || 'assets/images/placeholder.jpg'}" alt="${request.celebrity_name}" class="request-avatar">
                    <div class="request-info">
                        <h4>${request.celebrity_name}</h4>
                        <span class="request-date">Requested ${this.timeAgo(request.created_at)}</span>
                    </div>
                    <span class="request-status status-${request.status}">${this.formatStatus(request.status)}</span>
                </div>
                <div class="request-details">
                    <p><strong>Booking #:</strong> ${request.booking_number}</p>
                    <p><strong>Meeting Date:</strong> ${this.formatDate(request.meeting_date)}</p>
                    <p><strong>Amount:</strong> $${parseFloat(request.total_amount).toLocaleString()}</p>
                </div>
                <div class="request-actions">
                    <a href="booking-details.html?id=${request.id}" class="btn-secondary">View Details</a>
                </div>
            </div>
        `).join('');
    }

    renderPastMeetings() {
        const container = document.getElementById('pastMeetings');
        if (!container) return;

        const meetings = this.dashboardData.past_meetings || [];

        if (meetings.length === 0) {
            container.innerHTML = `<div class="empty-state"><p>No past meetings</p></div>`;
            return;
        }

        container.innerHTML = meetings.map(meeting => `
            <div class="past-meeting-card">
                <div class="past-meeting-header">
                    <img src="${meeting.celebrity_image || 'assets/images/placeholder.jpg'}" alt="${meeting.celebrity_name}" class="past-meeting-avatar">
                    <div class="past-meeting-info">
                        <h4>${meeting.celebrity_name}</h4>
                        <span class="past-meeting-date">Completed ${this.formatDate(meeting.completed_at)}</span>
                    </div>
                </div>
                <div class="past-meeting-actions">
                    <a href="booking-details.html?id=${meeting.id}" class="btn-link">View Details</a>
                    ${!meeting.has_review ? `<button onclick="dashboardPage.openReviewModal('${meeting.id}', '${meeting.celebrity_name}')" class="btn-primary">Leave Review</button>` : '<span class="review-badge">✓ Reviewed</span>'}
                </div>
            </div>
        `).join('');
    }

    renderSavedCelebrities() {
        const container = document.getElementById('savedCelebrities');
        if (!container) return;

        const saved = this.dashboardData.saved_celebrities || [];

        if (saved.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No saved celebrities</p>
                    <a href="browse.html" class="btn-primary">Browse Celebrities</a>
                </div>
            `;
            return;
        }

        container.innerHTML = saved.map(celeb => `
            <div class="saved-card">
                <a href="celebrity-profile.html?slug=${celeb.slug}">
                    <img src="${celeb.avatar_url || 'assets/images/placeholder.jpg'}" alt="${celeb.name}" class="saved-avatar">
                    <div class="saved-info">
                        <h5>${celeb.name}</h5>
                        <span class="saved-category">${celeb.category || 'Celebrity'}</span>
                        <span class="saved-price">From $${parseFloat(celeb.min_price || 0).toLocaleString()}</span>
                    </div>
                </a>
                <button onclick="dashboardPage.removeSaved(${celeb.celebrity_id})" class="btn-remove" title="Remove from favorites">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </button>
            </div>
        `).join('');
    }

    renderNotifications() {
        const container = document.getElementById('notificationsList');
        if (!container) return;

        const notifications = this.dashboardData.notifications || [];

        if (notifications.length === 0) {
            container.innerHTML = `<div class="empty-state"><p>No notifications</p></div>`;
            return;
        }

        container.innerHTML = notifications.map(notif => `
            <div class="notification-item ${notif.read_status ? '' : 'unread'}" data-notif-id="${notif.id}">
                <div class="notification-icon">${this.getNotificationIcon(notif.type)}</div>
                <div class="notification-content">
                    <h5>${notif.title}</h5>
                    <p>${notif.message}</p>
                    <span class="notification-time">${this.timeAgo(notif.created_at)}</span>
                </div>
                ${notif.link ? `<a href="${notif.link}" class="notification-link">→</a>` : ''}
            </div>
        `).join('');

        // Mark notifications as read when viewed
        this.markNotificationsAsRead(notifications);
    }

    async cancelBooking(bookingId) {
        if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await this.api.request(`/bookings/${bookingId}/cancel`, {
                method: 'PATCH'
            });

            if (response.success) {
                this.showSuccess('Booking cancelled successfully');
                await this.loadDashboardData();
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            this.showError('Failed to cancel booking');
        }
    }

    async removeSaved(celebrityId) {
        try {
            const response = await this.api.request('/saved/remove', {
                method: 'DELETE',
                body: JSON.stringify({ celebrity_id: celebrityId })
            });

            if (response.success) {
                this.showSuccess('Celebrity removed from favorites');
                await this.loadDashboardData();
            }
        } catch (error) {
            console.error('Error removing saved celebrity:', error);
            this.showError('Failed to remove from favorites');
        }
    }

    async markNotificationsAsRead(notifications) {
        const unread = notifications.filter(n => !n.read_status);
        for (const notif of unread) {
            try {
                await this.api.request(`/dashboard/notifications/${notif.id}/read`, {
                    method: 'PATCH'
                });
            } catch (error) {
                console.error('Error marking notification as read:', error);
            }
        }
    }

    setupAutoRefresh() {
        // Refresh dashboard every 2 minutes
        setInterval(() => {
            this.loadDashboardData();
        }, 120000);
    }

    // Utility methods
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    timeAgo(dateString) {
        const date = new Date(dateString);
        const seconds = Math.floor((new Date() - date) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
            }
        }

        return 'Just now';
    }

    formatStatus(status) {
        const statusMap = {
            'pending_approval': 'Pending Approval',
            'approved': 'Approved',
            'declined': 'Declined',
            'payment_pending': 'Payment Pending',
            'payment_complete': 'Payment Complete',
            'confirmed': 'Confirmed',
            'completed': 'Completed',
            'cancelled': 'Cancelled',
            'refunded': 'Refunded'
        };
        return statusMap[status] || status;
    }

    getNotificationIcon(type) {
        const icons = {
            'booking_created': '📅',
            'booking_approved': '✅',
            'booking_declined': '❌',
            'payment_complete': '💰',
            'meeting_reminder': '⏰',
            'review_request': '⭐',
            'booking_cancelled': '🚫'
        };
        return icons[type] || '📬';
    }

    showSuccess(message) {
        this.showToast(message, 'success');
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#D4A574'};
            color: #fff;
            padding: 16px 24px;
            border-radius: 12px;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    openReviewModal(bookingId, celebrityName) {
        // TODO: Implement review modal
        console.log('Opening review modal for', bookingId, celebrityName);
    }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// Initialize dashboard
let dashboardPage;
document.addEventListener('DOMContentLoaded', () => {
    dashboardPage = new DashboardPage();
});
