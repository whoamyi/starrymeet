/**
 * Dashboard Initialization
 * Loads real user data from backend API
 */

let currentUser = null;
let userBookings = [];
let userFavorites = [];

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', async function() {
    // Require authentication
    if (!requireAuth()) {
        return;
    }

    // Load user data from localStorage (set during login)
    currentUser = getCurrentUser();

    if (!currentUser) {
        console.error('No user data found');
        sessionStorage.setItem('authReturnUrl', 'dashboard.html');
        window.location.href = 'index.html';
        return;
    }

    console.log('Dashboard initialized for user:', currentUser.name || `${currentUser.first_name} ${currentUser.last_name}`);

    // Display user info in UI
    displayUserInfo();

    // Load dashboard data from backend
    await loadDashboardData();
});

/**
 * Display user information in the UI
 */
function displayUserInfo() {
    // Ensure we have a name
    const userName = currentUser.name || `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || 'User';

    // Update user name
    const userNameElements = document.querySelectorAll('[data-user-name]');
    userNameElements.forEach(el => {
        el.textContent = userName;
    });

    // Update user email
    const userEmailElements = document.querySelectorAll('[data-user-email]');
    userEmailElements.forEach(el => {
        el.textContent = currentUser.email || '';
    });

    // Update avatar with initials
    const avatarElements = document.querySelectorAll('[data-user-avatar]');
    avatarElements.forEach(el => {
        if (currentUser.avatar || currentUser.avatar_url) {
            el.innerHTML = `<img src="${currentUser.avatar || currentUser.avatar_url}" alt="${userName}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        } else {
            el.textContent = getInitials(userName);
        }
    });
}

/**
 * Load all dashboard data from backend API
 */
async function loadDashboardData() {
    try {
        // Load bookings from backend
        await loadBookingsFromAPI();

        // Update stats based on bookings
        updateStats();

        // Load favorites (if API endpoint exists)
        // await loadFavoritesFromAPI();

    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showErrorMessage('Failed to load dashboard data. Please refresh the page.');
    }
}

/**
 * Load user bookings from backend API
 */
async function loadBookingsFromAPI() {
    try {
        const response = await window.api.getMyBookings();

        if (response.success && response.data) {
            userBookings = response.data;
            console.log('Loaded bookings:', userBookings);

            // Display upcoming bookings
            displayUpcomingBookings();
        } else {
            console.log('No bookings found or API call failed');
            userBookings = [];
            displayUpcomingBookings();
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        // Show empty state on error
        userBookings = [];
        displayUpcomingBookings();
    }
}

/**
 * Display upcoming bookings on overview page
 */
function displayUpcomingBookings() {
    const container = document.getElementById('upcoming-bookings-container');
    if (!container) return;

    // Filter for upcoming bookings (pending or confirmed)
    const upcomingBookings = userBookings.filter(booking => {
        return booking.status === 'pending' || booking.status === 'confirmed';
    });

    if (upcomingBookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📅</div>
                <h3>No upcoming meetings</h3>
                <p>Book your first celebrity meeting to get started</p>
                <a href="browse.html" class="btn-primary-small">Browse Celebrities</a>
            </div>
        `;
        return;
    }

    // Display upcoming bookings
    container.innerHTML = upcomingBookings.slice(0, 3).map(booking => {
        const statusClass = booking.status === 'confirmed' ? 'confirmed' : 'pending';
        const statusText = booking.status === 'confirmed' ? 'Confirmed' : 'Pending Approval';

        // Get celebrity info
        const celebrityName = booking.celebrity?.name || booking.celebrity_name || 'Celebrity';
        const initials = getInitials(celebrityName);

        // Format date and time
        const bookingDate = booking.booking_date || booking.date || 'TBD';
        const bookingTime = booking.time_slot || booking.booking_time || booking.time || 'TBD';
        const location = booking.location || booking.celebrity?.location || 'Location TBD';

        return `
            <div class="booking-card">
                <div class="booking-avatar">${initials}</div>
                <div class="booking-info">
                    <h3>${celebrityName}</h3>
                    <div class="booking-meta">
                        <span>📅 ${formatDate(bookingDate)}</span>
                        <span>⏰ ${bookingTime}</span>
                        <span>📍 ${location}</span>
                    </div>
                    <span class="booking-status ${statusClass}">${statusText}</span>
                </div>
                <div class="booking-actions">
                    <button class="btn-primary-small" onclick="viewBookingDetails('${booking.id}')">View Details</button>
                    ${booking.status === 'pending' ? `<button class="btn-small" onclick="cancelBooking('${booking.id}')">Cancel</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Update dashboard statistics
 */
function updateStats() {
    // Total meetings
    const totalMeetings = userBookings.length;
    document.getElementById('stat-total-meetings').textContent = totalMeetings;

    // Upcoming meetings
    const upcoming = userBookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length;
    document.getElementById('stat-upcoming').textContent = upcoming;

    // Update upcoming next text
    if (upcoming > 0) {
        const nextBooking = userBookings
            .filter(b => b.status === 'confirmed')
            .sort((a, b) => new Date(a.booking_date) - new Date(b.booking_date))[0];

        if (nextBooking) {
            document.getElementById('stat-upcoming-next').textContent = `Next: ${formatDate(nextBooking.booking_date)}`;
        }
    }

    // Total spent (price is in cents in backend)
    const totalSpent = userBookings
        .filter(b => b.status === 'completed' || b.status === 'confirmed')
        .reduce((sum, b) => {
            const amount = b.total_cents ? b.total_cents / 100 : (parseFloat(b.price) || 0);
            return sum + amount;
        }, 0);
    document.getElementById('stat-total-spent').textContent = formatPrice(totalSpent);

    // Favorites (from localStorage for now, until we have API)
    const favoritesCount = getFavorites(currentUser.id)?.length || 0;
    document.getElementById('stat-favorites').textContent = favoritesCount;
}

/**
 * Show section (for navigation)
 */
function showSection(section) {
    // Hide all sections
    document.getElementById('overview-section').style.display = 'none';
    document.getElementById('bookings-section').style.display = 'none';
    document.getElementById('favorites-section').style.display = 'none';
    document.getElementById('settings-section').style.display = 'none';

    // Show selected section
    document.getElementById(section + '-section').style.display = 'block';

    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item')?.classList.add('active');

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar')?.classList.remove('show');
        document.getElementById('mobileSidebarOverlay')?.classList.remove('show');
    }

    // Load section-specific data
    if (section === 'bookings') {
        displayAllBookings();
    } else if (section === 'favorites') {
        displayFavorites();
    }
}

/**
 * Display all bookings
 */
function displayAllBookings() {
    const container = document.getElementById('bookings-section');
    if (!container) return;

    if (userBookings.length === 0) {
        container.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">My Bookings</h1>
                <p class="page-subtitle">All your past and upcoming meetings</p>
            </div>
            <div class="empty-state">
                <div class="empty-state-icon">📅</div>
                <h3>No bookings yet</h3>
                <p>Start exploring celebrities and book your first meeting</p>
                <a href="browse.html" class="btn-primary-small">Browse Celebrities</a>
            </div>
        `;
        return;
    }

    // Display all bookings grouped by status
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">My Bookings</h1>
            <p class="page-subtitle">All your past and upcoming meetings (${userBookings.length})</p>
        </div>
        <div class="bookings-grid">
            ${userBookings.map(booking => {
                const statusClass = booking.status;
                const celebrityName = booking.celebrity?.name || booking.celebrity_name || 'Celebrity';
                const initials = getInitials(celebrityName);

                return `
                    <div class="booking-card">
                        <div class="booking-avatar">${initials}</div>
                        <div class="booking-info">
                            <h3>${celebrityName}</h3>
                            <div class="booking-meta">
                                <span>📅 ${formatDate(booking.booking_date || booking.date)}</span>
                                <span>⏰ ${booking.time_slot || booking.booking_time || booking.time || 'TBD'}</span>
                                <span>📍 ${booking.location || booking.celebrity?.location || 'TBD'}</span>
                            </div>
                            <span class="booking-status ${statusClass}">${booking.status}</span>
                        </div>
                        <div class="booking-actions">
                            <button class="btn-primary-small" onclick="viewBookingDetails('${booking.id}')">View Details</button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

/**
 * Display favorites
 */
function displayFavorites() {
    const container = document.getElementById('favorites-section');
    if (!container) return;

    // Get favorites from localStorage (legacy)
    const favorites = getFavorites(currentUser.id) || [];

    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Favorites</h1>
            <p class="page-subtitle">Celebrities you want to meet</p>
        </div>
        ${favorites.length === 0 ? `
            <div class="empty-state">
                <div class="empty-state-icon">⭐</div>
                <h3>No favorites yet</h3>
                <p>Save celebrities you're interested in meeting</p>
                <a href="browse.html" class="btn-primary-small">Browse Celebrities</a>
            </div>
        ` : `
            <p>Favorites: ${favorites.join(', ')}</p>
            <a href="browse.html" class="btn-primary-small">Browse More Celebrities</a>
        `}
    `;
}

/**
 * Helper: Format date
 */
function formatDate(dateString) {
    if (!dateString || dateString === 'TBD') return 'TBD';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
}

/**
 * Helper: Format price
 */
function formatPrice(amount) {
    if (typeof amount === 'string') {
        amount = parseFloat(amount);
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(amount || 0);
}

/**
 * Helper: Get initials from name
 */
function getInitials(name) {
    if (!name) return '??';

    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

/**
 * Action handlers
 */
function viewBookingDetails(bookingId) {
    alert(`Booking details for ID: ${bookingId}\n\nFull booking details page coming soon!`);
}

function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        alert(`Cancellation feature coming soon!\nBooking ID: ${bookingId}`);
    }
}

function toggleSidebar() {
    document.getElementById('sidebar')?.classList.toggle('show');
    document.getElementById('mobileSidebarOverlay')?.classList.toggle('show');
}

// Make functions globally available
window.showSection = showSection;
window.viewBookingDetails = viewBookingDetails;
window.cancelBooking = cancelBooking;
window.toggleSidebar = toggleSidebar;
