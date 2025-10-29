/**
 * StarryMeet Shared JavaScript
 * Common utilities and functions used across all pages
 */

// ========================================
// COLOR PALETTE FOR AVATARS
// ========================================

const COLOR_PALETTES = [
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #fa709a, #fee140)',
    'linear-gradient(135deg, #30cfd0, #330867)',
    'linear-gradient(135deg, #a8edea, #fed6e3)',
    'linear-gradient(135deg, #ff9a9e, #fecfef)',
    'linear-gradient(135deg, #ffecd2, #fcb69f)',
    'linear-gradient(135deg, #ff6e7f, #bfe9ff)'
];

// ========================================
// AUTHENTICATION UTILITIES
// ========================================

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid session
 */
function isAuthenticated() {
    try {
        const sessionData = localStorage.getItem('starrymeet_session');
        if (!sessionData) return false;

        const session = JSON.parse(sessionData);
        if (!session.token || !session.expiresAt) return false;

        // Check if session has expired
        const expiresAt = new Date(session.expiresAt);
        if (expiresAt <= new Date()) {
            // Session expired, clear it
            localStorage.removeItem('starrymeet_session');
            localStorage.removeItem('starrymeet_user');
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
}

/**
 * Get current user data
 * @returns {object|null} User object or null
 */
function getCurrentUser() {
    try {
        const userData = localStorage.getItem('starrymeet_user');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
}

/**
 * Require authentication before action
 * Redirects to auth.html if not authenticated, preserving return URL
 * @param {string} returnUrl - Optional return URL (defaults to current page)
 * @returns {boolean} True if authenticated, false if redirecting
 */
function requireAuth(returnUrl = null) {
    if (isAuthenticated()) {
        return true;
    }

    // Save return URL
    const redirectUrl = returnUrl || window.location.pathname + window.location.search;
    window.location.href = `auth.html?redirect=${encodeURIComponent(redirectUrl)}`;
    return false;
}

/**
 * Update navigation to show logged-in state
 * Should be called after navigation is injected
 */
function updateNavForAuth() {
    if (!isAuthenticated()) return;

    const user = getCurrentUser();
    if (!user) return;

    // Update desktop nav
    const navAuthLink = document.getElementById('navAuthLink');
    if (navAuthLink) {
        navAuthLink.textContent = user.firstName || 'Dashboard';
        navAuthLink.href = 'dashboard.html';
    }

    // Update mobile nav
    const mobileNavAuthLink = document.getElementById('mobileNavAuthLink');
    if (mobileNavAuthLink) {
        mobileNavAuthLink.textContent = user.firstName || 'Dashboard';
        mobileNavAuthLink.href = 'dashboard.html';
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 characters)
 */
function getInitials(name) {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

/**
 * Get consistent color for celebrity based on name
 * @param {string} name - Celebrity name
 * @returns {string} CSS gradient string
 */
function getColorForCelebrity(name) {
    if (!name) return COLOR_PALETTES[0];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return COLOR_PALETTES[index % COLOR_PALETTES.length];
}

/**
 * Format price with currency symbol and thousands separator
 * @param {number} price - Price value in cents
 * @returns {string} Formatted price string
 */
function formatPrice(price) {
    if (!price) return '$0';
    return '$' + Math.round(price / 100).toLocaleString('en-US');
}

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

/**
 * Get URL parameter value
 * @param {string} param - Parameter name
 * @returns {string|null} Parameter value or null
 */
function getURLParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Navigate to page with parameters
 * @param {string} page - Page URL
 * @param {object} params - Parameters object
 */
function navigateToPage(page, params = {}) {
    const urlParams = new URLSearchParams(params);
    const queryString = urlParams.toString();
    window.location.href = queryString ? `${page}?${queryString}` : page;
}

// ========================================
// LOCALSTORAGE FUNCTIONS
// ========================================

/**
 * Save celebrity to watchlist
 * @param {string} celebrityName - Name of celebrity to save
 */
function saveToWatchlist(celebrityName) {
    const watchlist = getWatchlist();
    if (!watchlist.includes(celebrityName)) {
        watchlist.push(celebrityName);
        localStorage.setItem('starryMeetWatchlist', JSON.stringify(watchlist));
        return true;
    }
    return false;
}

/**
 * Remove celebrity from watchlist
 * @param {string} celebrityName - Name of celebrity to remove
 */
function removeFromWatchlist(celebrityName) {
    const watchlist = getWatchlist();
    const filtered = watchlist.filter(name => name !== celebrityName);
    localStorage.setItem('starryMeetWatchlist', JSON.stringify(filtered));
}

/**
 * Get all celebrities in watchlist
 * @returns {array} Array of celebrity names
 */
function getWatchlist() {
    const stored = localStorage.getItem('starryMeetWatchlist');
    return stored ? JSON.parse(stored) : [];
}

/**
 * Check if celebrity is in watchlist
 * @param {string} celebrityName - Name to check
 * @returns {boolean} True if in watchlist
 */
function isInWatchlist(celebrityName) {
    return getWatchlist().includes(celebrityName);
}

// ========================================
// TESTIMONIALS GENERATOR (for reviews)
// ========================================

/**
 * Generate sample testimonials for a celebrity
 * @param {string} celebrityName - Celebrity name
 * @returns {array} Array of testimonial objects
 */
function generateTestimonialsForCelebrity(celebrityName) {
    const names = ['Sarah M.', 'John D.', 'Emma L.', 'Mike R.', 'Lisa K.', 'David P.'];
    const texts = [
        'Amazing experience! Worth every penny. So professional and friendly.',
        'Dream come true! Can\'t believe I got to meet them in person.',
        'The best birthday gift ever! They were so kind and took time to chat.',
        'Incredible! They made my day. Highly recommend booking through StarryMeet.',
        'Exceeded all expectations. A memory I\'ll cherish forever.',
        'So down to earth and genuine. Thank you for this opportunity!'
    ];
    const dates = ['2 days ago', '5 days ago', '1 week ago', '2 weeks ago', '3 weeks ago', '1 month ago'];

    return names.map((name, i) => ({
        name,
        text: texts[i],
        date: dates[i],
        rating: 5,
        initials: getInitials(name),
        color: getColorForCelebrity(name)
    }));
}
