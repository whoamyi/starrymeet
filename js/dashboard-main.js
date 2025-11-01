/**
 * Dashboard Main - Core dashboard logic
 * Handles loading and displaying user dashboard data
 */

class DashboardMain {
    constructor() {
        this.user = null;
        this.init();
    }

    async init() {
        this.user = await AuthHelper.checkAuth();
        if (!this.user) return;

        this.setupUserInterface();
        this.loadDashboardData();
        this.setupEventListeners();
        this.updateTime();
    }

    setupUserInterface() {
        // Set user name and initials
        const firstName = this.user.first_name || this.user.firstName || '';
        const lastName = this.user.last_name || this.user.lastName || '';
        const email = this.user.email || '';

        const initials = AuthHelper.getUserInitials(firstName, lastName);

        // Update user interface elements
        const userInitialsEl = document.getElementById('userInitials');
        if (userInitialsEl) userInitialsEl.textContent = initials;

        const userNameEl = document.getElementById('userName');
        if (userNameEl) userNameEl.textContent = `${firstName} ${lastName}`.trim() || 'User';

        const userEmailEl = document.getElementById('userEmail');
        if (userEmailEl) userEmailEl.textContent = email;

        const welcomeNameEl = document.getElementById('welcomeName');
        if (welcomeNameEl) welcomeNameEl.textContent = firstName || 'there';

        // Set profile image if exists
        if (this.user.avatar_url || this.user.profile_image) {
            const avatar = document.getElementById('userAvatar');
            if (avatar) {
                avatar.innerHTML = `<img src="${this.user.avatar_url || this.user.profile_image}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
            }
        }
    }

    async loadDashboardData() {
        try {
            // Load dashboard data from our API
            const response = await AuthHelper.apiCall('/api/dashboard/user');

            if (!response.ok) {
                throw new Error('Failed to load dashboard data');
            }

            const result = await response.json();
            const data = result.data || result;

            this.renderDashboardData(data);
        } catch (error) {
            console.error('Dashboard load error:', error);
            // Show empty states instead of error
            this.renderEmptyStates();
        }
    }

    renderDashboardData(data) {
        // Update counts
        const celebCountEl = document.getElementById('celebCount');
        if (celebCountEl) {
            celebCountEl.textContent = `${data.total_celebrities || 150} available`;
        }

        const favCountEl = document.getElementById('favCount');
        if (favCountEl) {
            const savedCount = data.stats?.saved_count || data.saved_celebrities?.length || 0;
            favCountEl.textContent = `${savedCount} saved`;
        }

        const messageStatusEl = document.getElementById('messageStatus');
        if (messageStatusEl) {
            const unreadCount = data.stats?.unread_messages_count || 0;
            messageStatusEl.textContent = unreadCount > 0 ?
                `${unreadCount} new message${unreadCount > 1 ? 's' : ''}` :
                'No new messages';
        }

        // Update notification badges
        const unreadNotifications = data.stats?.unread_notifications_count || 0;
        if (unreadNotifications > 0) {
            const notifBadge = document.getElementById('notifBadge');
            if (notifBadge) {
                notifBadge.textContent = unreadNotifications;
                notifBadge.style.display = 'flex';
            }
        }

        // Render upcoming bookings
        this.renderUpcomingBookings(data.upcoming_meetings || []);

        // Render saved celebrities
        this.renderSavedCelebrities(data.saved_celebrities || []);
    }

    renderUpcomingBookings(bookings) {
        const container = document.getElementById('upcomingBookings');
        if (!container) return;

        if (bookings.length === 0) {
            container.innerHTML = `
                <div class="empty-state-inline">
                    <p>No upcoming meetings</p>
                    <a href="browse.html" class="btn-link">Browse celebrities</a>
                </div>
            `;
            return;
        }

        container.innerHTML = bookings.slice(0, 3).map(booking => `
            <div class="booking-card">
                <img src="${booking.celebrity_image || '/assets/images/placeholder.jpg'}" alt="${booking.celebrity_name}" class="booking-img">
                <div class="booking-info">
                    <h4>${booking.celebrity_name}</h4>
                    <p class="booking-date">
                        ${AuthHelper.formatDate(booking.meeting_date)}
                    </p>
                    <span class="badge badge-${booking.status}">${this.formatStatus(booking.status)}</span>
                </div>
            </div>
        `).join('');
    }

    renderSavedCelebrities(celebrities) {
        const container = document.getElementById('savedCelebrities');
        if (!container) return;

        if (celebrities.length === 0) {
            container.innerHTML = `
                <div class="empty-state-inline">
                    <p>No favorites yet</p>
                    <a href="browse.html" class="btn-link">Start exploring</a>
                </div>
            `;
            return;
        }

        container.innerHTML = celebrities.slice(0, 6).map(celeb => `
            <div class="celebrity-card-mini" onclick="window.location.href='celebrity-profile.html?slug=${celeb.slug}'">
                <img src="${celeb.avatar_url || '/assets/images/placeholder.jpg'}" alt="${celeb.name}" class="celeb-img">
                <div class="celeb-info">
                    <h4>${celeb.name}</h4>
                    <p>${celeb.category || ''}</p>
                </div>
            </div>
        `).join('');
    }

    renderEmptyStates() {
        const upcomingBookings = document.getElementById('upcomingBookings');
        if (upcomingBookings) {
            upcomingBookings.innerHTML = `
                <div class="empty-state-inline">
                    <p>No upcoming meetings</p>
                    <a href="browse.html" class="btn-link">Browse celebrities</a>
                </div>
            `;
        }

        const savedCelebrities = document.getElementById('savedCelebrities');
        if (savedCelebrities) {
            savedCelebrities.innerHTML = `
                <div class="empty-state-inline">
                    <p>No favorites yet</p>
                    <a href="browse.html" class="btn-link">Start exploring</a>
                </div>
            `;
        }
    }

    setupEventListeners() {
        // User menu toggle
        const userAvatar = document.getElementById('userAvatar');
        const userMenu = document.getElementById('userMenu');
        const userDropdown = document.getElementById('userDropdown');

        if (userAvatar && userDropdown) {
            userAvatar.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (userMenu && !userMenu.contains(e.target)) {
                    userDropdown.classList.remove('active');
                }
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                try {
                    await AuthHelper.apiCall('/api/logout', { method: 'POST' });
                } catch (error) {
                    console.error('Logout error:', error);
                } finally {
                    // Always clear and redirect
                    AuthHelper.clearAuth();
                    window.location.href = 'auth.html';
                }
            });
        }
    }

    updateTime() {
        const now = new Date();
        const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
        const dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };

        const currentTimeEl = document.getElementById('currentTime');
        if (currentTimeEl) {
            currentTimeEl.textContent = now.toLocaleTimeString('en-US', timeOptions);
        }

        const currentDateEl = document.getElementById('currentDate');
        if (currentDateEl) {
            currentDateEl.textContent = now.toLocaleDateString('en-US', dateOptions);
        }

        setTimeout(() => this.updateTime(), 60000); // Update every minute
    }

    formatStatus(status) {
        if (!status) return '';
        return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    new DashboardMain();
});
