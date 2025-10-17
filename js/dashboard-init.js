/**
 * Dashboard Initialization
 * Loads real user data, bookings, and favorites
 */

let currentUser = null;
let currentTab = 'bookings';

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    // Require authentication
    if (!requireAuth()) {
        return;
    }

    // Load user data
    currentUser = getCurrentUser();
    if (!currentUser) {
        sessionStorage.setItem('authReturnUrl', 'dashboard.html');
        window.location.href = 'index.html';
        return;
    }

    // Display user info
    displayUserInfo();

    // Check URL for tab parameter
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    const statusParam = urlParams.get('status');

    if (tabParam) {
        currentTab = tabParam;
        switchToTab(tabParam);
    } else {
        loadBookings();
    }

    // If status parameter, filter bookings
    if (statusParam && tabParam === 'bookings') {
        setTimeout(() => {
            filterBookingsByStatus(statusParam);
        }, 100);
    }

    // Set up event listeners
    setupEventListeners();
});

/**
 * Display user information
 */
function displayUserInfo() {
    // Update user name
    const userNameElements = document.querySelectorAll('[data-user-name]');
    userNameElements.forEach(el => {
        el.textContent = currentUser.name;
    });

    // Update user email
    const userEmailElements = document.querySelectorAll('[data-user-email]');
    userEmailElements.forEach(el => {
        el.textContent = currentUser.email;
    });

    // Update avatar
    const avatarElements = document.querySelectorAll('[data-user-avatar]');
    avatarElements.forEach(el => {
        if (currentUser.avatar) {
            el.innerHTML = `<img src="${currentUser.avatar}" alt="${currentUser.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        } else {
            el.innerHTML = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--primary); color: white; font-size: 2rem; font-weight: 600; border-radius: 50%;">${getInitials(currentUser.name)}</div>`;
        }
    });

    // Set form values in settings
    const nameInput = document.getElementById('settingsName');
    const emailInput = document.getElementById('settingsEmail');
    const phoneInput = document.getElementById('settingsPhone');

    if (nameInput) nameInput.value = currentUser.name;
    if (emailInput) emailInput.value = currentUser.email;
    if (phoneInput) phoneInput.value = currentUser.phone || '';
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Tab switching
    const tabButtons = document.querySelectorAll('[data-tab]');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            switchToTab(tab);
        });
    });

    // Settings form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSettingsUpdate);
    }

    // Logout button
    const logoutButtons = document.querySelectorAll('[data-action="logout"]');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    });
}

/**
 * Switch to a specific tab
 */
function switchToTab(tab) {
    currentTab = tab;

    // Update active tab button
    const tabButtons = document.querySelectorAll('[data-tab]');
    tabButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === tab) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Hide all tab contents
    const tabContents = document.querySelectorAll('[data-tab-content]');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });

    // Show selected tab
    const selectedTab = document.querySelector(`[data-tab-content="${tab}"]`);
    if (selectedTab) {
        selectedTab.style.display = 'block';
    }

    // Load tab data
    switch (tab) {
        case 'bookings':
            loadBookings();
            break;
        case 'favorites':
            loadFavorites();
            break;
        case 'messages':
            loadMessages();
            break;
        case 'settings':
            // Already populated
            break;
    }
}

/**
 * Load user bookings
 */
function loadBookings() {
    const bookings = getBookings(currentUser.id);
    const bookingsContainer = document.getElementById('bookingsContainer');

    if (!bookingsContainer) return;

    if (bookings.length === 0) {
        bookingsContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <p style="font-size: 1.2rem; opacity: 0.6; margin-bottom: 20px;">No bookings yet</p>
                <a href="browse.html" class="btn btn-primary">Browse Celebrities</a>
            </div>
        `;
        return;
    }

    bookingsContainer.innerHTML = bookings.map(booking => {
        const statusColor = {
            pending: '#FFA500',
            approved: '#10B981',
            rejected: '#EF4444',
            completed: '#6B46C1',
            cancelled: '#6B7280'
        }[booking.status] || '#6B7280';

        return `
            <div class="booking-card" style="background: rgba(234, 18, 121, 0.05); border: 1px solid rgba(234, 18, 121, 0.2); border-radius: 16px; padding: 24px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                    <div>
                        <h3 style="font-size: 1.5rem; margin-bottom: 8px;">${booking.celebrityName}</h3>
                        <span style="display: inline-block; background: ${statusColor}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.875rem; font-weight: 600; text-transform: uppercase;">${booking.status}</span>
                    </div>
                    <div style="text-align: right;">
                        <p style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${formatPrice(booking.price)}</p>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 16px;">
                    <div>
                        <p style="opacity: 0.6; font-size: 0.875rem; margin-bottom: 4px;">Date</p>
                        <p style="font-weight: 600;">${formatDate(booking.date)}</p>
                    </div>
                    <div>
                        <p style="opacity: 0.6; font-size: 0.875rem; margin-bottom: 4px;">Time</p>
                        <p style="font-weight: 600;">${booking.time}</p>
                    </div>
                    <div>
                        <p style="opacity: 0.6; font-size: 0.875rem; margin-bottom: 4px;">Location</p>
                        <p style="font-weight: 600;">${booking.location}</p>
                    </div>
                </div>
                <div style="padding-top: 16px; border-top: 1px solid rgba(234, 18, 121, 0.1);">
                    <p style="opacity: 0.6; font-size: 0.875rem; margin-bottom: 4px;">Booked on ${formatDate(booking.createdAt)}</p>
                    ${booking.status === 'pending' ? '<p style="opacity: 0.8; font-size: 0.875rem;">⏳ Awaiting celebrity approval</p>' : ''}
                    ${booking.status === 'approved' ? '<p style="color: #10B981; font-size: 0.875rem;">✓ Approved! Check your email for details</p>' : ''}
                </div>
            </div>
        `;
    }).join('');

    // Add filter buttons
    addBookingFilters(bookingsContainer, bookings);
}

/**
 * Add booking filter buttons
 */
function addBookingFilters(container, bookings) {
    const statuses = ['all', 'pending', 'approved', 'completed', 'rejected', 'cancelled'];
    const counts = {
        all: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        approved: bookings.filter(b => b.status === 'approved').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        rejected: bookings.filter(b => b.status === 'rejected').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length
    };

    const filtersHTML = `
        <div style="margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
            ${statuses.map(status =>
                `<button onclick="filterBookingsByStatus('${status}')" style="padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(234, 18, 121, 0.3); background: rgba(234, 18, 121, 0.05); color: white; cursor: pointer; font-size: 0.875rem;">
                    ${status.charAt(0).toUpperCase() + status.slice(1)} (${counts[status]})
                </button>`
            ).join('')}
        </div>
    `;

    container.insertAdjacentHTML('beforebegin', filtersHTML);
}

/**
 * Filter bookings by status
 */
function filterBookingsByStatus(status) {
    const bookings = status === 'all'
        ? getBookings(currentUser.id)
        : getBookings(currentUser.id, status);

    const bookingsContainer = document.getElementById('bookingsContainer');
    if (!bookingsContainer) return;

    // Remove old filters
    const oldFilters = bookingsContainer.previousElementSibling;
    if (oldFilters && oldFilters.querySelector('button')) {
        oldFilters.remove();
    }

    // Reload bookings
    loadBookings();
}

/**
 * Load user favorites
 */
function loadFavorites() {
    const favoriteCelebrities = getFavorites(currentUser.id);
    const favoritesContainer = document.getElementById('favoritesContainer');

    if (!favoritesContainer) return;

    if (favoriteCelebrities.length === 0) {
        favoritesContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <p style="font-size: 1.2rem; opacity: 0.6; margin-bottom: 20px;">No favorites yet</p>
                <a href="browse.html" class="btn btn-primary">Browse Celebrities</a>
            </div>
        `;
        return;
    }

    // Get full celebrity data for favorites
    const celebrities = favoriteCelebrities
        .map(name => getCelebrityByName(name))
        .filter(Boolean);

    favoritesContainer.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">
            ${celebrities.map(celeb => `
                <div class="celebrity-card" onclick="window.location.href='celebrity-profile.html?name=${encodeURIComponent(celeb.name)}'" style="background: rgba(234, 18, 121, 0.05); border: 1px solid rgba(234, 18, 121, 0.2); border-radius: 16px; padding: 20px; cursor: pointer; transition: all 0.3s; text-align: center;">
                    <div style="width: 100px; height: 100px; margin: 0 auto 16px; border-radius: 50%; background: ${getColorForCelebrity(celeb.name)}; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 600; color: white;">
                        ${getInitials(celeb.name)}
                    </div>
                    <h4 style="font-size: 1.25rem; margin-bottom: 8px;">${celeb.name}</h4>
                    <p style="opacity: 0.6; margin-bottom: 8px;">${celeb.category}</p>
                    <p style="font-size: 1.25rem; font-weight: 700; color: var(--primary);">${formatPrice(celeb.price)}</p>
                    <button onclick="event.stopPropagation(); removeFromFavorites('${currentUser.id}', '${celeb.name}'); loadFavorites();" style="margin-top: 12px; padding: 8px 16px; border-radius: 20px; border: 1px solid var(--primary); background: transparent; color: var(--primary); cursor: pointer; font-size: 0.875rem;">
                        Remove
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Load messages (placeholder)
 */
function loadMessages() {
    const messagesContainer = document.getElementById('messagesContainer');
    if (!messagesContainer) return;

    const bookings = getBookings(currentUser.id);
    const approvedBookings = bookings.filter(b => b.status === 'approved' || b.status === 'completed');

    if (approvedBookings.length === 0) {
        messagesContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <p style="font-size: 1.2rem; opacity: 0.6; margin-bottom: 10px;">No messages yet</p>
                <p style="opacity: 0.5;">Messages will appear here once your bookings are approved</p>
            </div>
        `;
        return;
    }

    messagesContainer.innerHTML = `
        <div style="background: rgba(234, 18, 121, 0.05); border: 1px solid rgba(234, 18, 121, 0.2); border-radius: 16px; padding: 24px;">
            <h3 style="margin-bottom: 20px;">Message your celebrities</h3>
            ${approvedBookings.map(booking => `
                <div style="padding: 16px; margin-bottom: 12px; background: rgba(0, 0, 0, 0.3); border-radius: 12px;">
                    <h4 style="margin-bottom: 8px;">${booking.celebrityName}</h4>
                    <p style="opacity: 0.6; font-size: 0.875rem; margin-bottom: 12px;">Meeting scheduled for ${formatDate(booking.date)} at ${booking.time}</p>
                    <button class="btn btn-outline" style="padding: 8px 16px; font-size: 0.875rem;" onclick="alert('Messaging feature coming soon!')">Send Message</button>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Handle settings form update
 */
function handleSettingsUpdate(e) {
    e.preventDefault();

    const nameInput = document.getElementById('settingsName');
    const emailInput = document.getElementById('settingsEmail');
    const phoneInput = document.getElementById('settingsPhone');

    try {
        const updatedUser = updateUserProfile(currentUser.id, {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value
        });

        currentUser = updatedUser;
        displayUserInfo();
        showSuccessMessage('Profile updated successfully!');
    } catch (error) {
        alert('Error updating profile: ' + error.message);
    }
}

/**
 * Make functions globally available
 */
window.switchToTab = switchToTab;
window.filterBookingsByStatus = filterBookingsByStatus;
window.loadBookings = loadBookings;
window.loadFavorites = loadFavorites;
window.loadMessages = loadMessages;

console.log('Dashboard initialized for user:', currentUser?.name);
