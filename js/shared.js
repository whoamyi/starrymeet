/**
 * StarryMeet Shared JavaScript
 * Common data, utilities, and functions used across all pages
 */

// Celebrity Data - Complete list used across the platform
const CELEBRITIES = [
    { name: "Emma Watson", category: "Hollywood", location: "London • Mar 15", city: "London", country: "UK", price: 5000, verified: true, trending: true },
    { name: "Chris Hemsworth", category: "Hollywood", location: "Sydney • Mar 20", city: "Sydney", country: "Australia", price: 7500, verified: true, trending: true },
    { name: "Zendaya", category: "Hollywood", location: "Los Angeles • Mar 18", city: "Los Angeles", country: "USA", price: 6000, verified: true, trending: true },
    { name: "Tom Holland", category: "Hollywood", location: "New York • Mar 22", city: "New York", country: "USA", price: 5500, verified: true, trending: false },
    { name: "Margot Robbie", category: "Hollywood", location: "Sydney • Apr 5", city: "Sydney", country: "Australia", price: 6500, verified: true, trending: true },
    { name: "Ryan Reynolds", category: "Hollywood", location: "Vancouver • Mar 25", city: "Vancouver", country: "Canada", price: 8000, verified: true, trending: false },
    { name: "Scarlett Johansson", category: "Hollywood", location: "New York • Apr 1", city: "New York", country: "USA", price: 7000, verified: true, trending: false },
    { name: "Timothée Chalamet", category: "Hollywood", location: "Paris • Mar 28", city: "Paris", country: "France", price: 5500, verified: true, trending: true },
    { name: "Florence Pugh", category: "Hollywood", location: "London • Apr 3", city: "London", country: "UK", price: 4500, verified: true, trending: false },
    { name: "Michael B. Jordan", category: "Hollywood", location: "Atlanta • Mar 30", city: "Atlanta", country: "USA", price: 6000, verified: true, trending: false },
    { name: "Dwayne Johnson", category: "Hollywood", location: "Miami • Apr 10", city: "Miami", country: "USA", price: 15000, verified: true, trending: true },
    { name: "Gal Gadot", category: "Hollywood", location: "Tel Aviv • Apr 8", city: "Tel Aviv", country: "Israel", price: 7000, verified: true, trending: false },
    { name: "Robert Downey Jr.", category: "Hollywood", location: "Los Angeles • Apr 12", city: "Los Angeles", country: "USA", price: 12000, verified: true, trending: false },
    { name: "Jennifer Lawrence", category: "Hollywood", location: "New York • Apr 6", city: "New York", country: "USA", price: 8500, verified: true, trending: false },
    { name: "Brad Pitt", category: "Hollywood", location: "Los Angeles • Apr 15", city: "Los Angeles", country: "USA", price: 10000, verified: true, trending: false },
    { name: "Park Seo-joon", category: "K-Drama", location: "Seoul • Mar 16", city: "Seoul", country: "South Korea", price: 4000, verified: true, trending: true },
    { name: "Song Hye-kyo", category: "K-Drama", location: "Seoul • Mar 19", city: "Seoul", country: "South Korea", price: 4500, verified: true, trending: false },
    { name: "Lee Min-ho", category: "K-Drama", location: "Seoul • Mar 21", city: "Seoul", country: "South Korea", price: 5000, verified: true, trending: true },
    { name: "IU (Lee Ji-eun)", category: "K-Drama", location: "Seoul • Mar 24", city: "Seoul", country: "South Korea", price: 6000, verified: true, trending: true },
    { name: "Kim Soo-hyun", category: "K-Drama", location: "Seoul • Apr 2", city: "Seoul", country: "South Korea", price: 5500, verified: true, trending: false },
    { name: "Elon Musk", category: "Business", location: "San Francisco • Mar 17", city: "San Francisco", country: "USA", price: 50000, verified: true, trending: true },
    { name: "Jeff Bezos", category: "Business", location: "Seattle • Mar 29", city: "Seattle", country: "USA", price: 45000, verified: true, trending: false },
    { name: "Bill Gates", category: "Business", location: "Seattle • Apr 4", city: "Seattle", country: "USA", price: 40000, verified: true, trending: false },
    { name: "Mark Zuckerberg", category: "Business", location: "Palo Alto • Mar 26", city: "Palo Alto", country: "USA", price: 35000, verified: true, trending: false },
    { name: "Oprah Winfrey", category: "Business", location: "Chicago • Apr 9", city: "Chicago", country: "USA", price: 30000, verified: true, trending: true },
    { name: "Cristiano Ronaldo", category: "Athletes", location: "Riyadh • Mar 31", city: "Riyadh", country: "Saudi Arabia", price: 25000, verified: true, trending: true },
    { name: "Lionel Messi", category: "Athletes", location: "Miami • Apr 8", city: "Miami", country: "USA", price: 30000, verified: true, trending: true },
    { name: "LeBron James", category: "Athletes", location: "Los Angeles • Apr 11", city: "Los Angeles", country: "USA", price: 20000, verified: true, trending: true },
    { name: "Serena Williams", category: "Athletes", location: "Miami • Apr 7", city: "Miami", country: "USA", price: 18000, verified: true, trending: false },
    { name: "Tom Brady", category: "Athletes", location: "Tampa • Apr 14", city: "Tampa", country: "USA", price: 22000, verified: true, trending: false },
    { name: "Taylor Swift", category: "Musicians", location: "Nashville • Mar 20", city: "Nashville", country: "USA", price: 20000, verified: true, trending: true },
    { name: "Beyoncé", category: "Musicians", location: "Houston • Mar 28", city: "Houston", country: "USA", price: 25000, verified: true, trending: true },
    { name: "Ed Sheeran", category: "Musicians", location: "London • Apr 5", city: "London", country: "UK", price: 15000, verified: true, trending: false },
    { name: "Ariana Grande", category: "Musicians", location: "Los Angeles • Apr 10", city: "Los Angeles", country: "USA", price: 18000, verified: true, trending: true },
    { name: "BTS (Group)", category: "Musicians", location: "Seoul • Apr 26", city: "Seoul", country: "South Korea", price: 35000, verified: true, trending: true }
];

// Color palettes for celebrity avatars
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
// UTILITY FUNCTIONS
// ========================================

/**
 * Get celebrity by exact name match
 * @param {string} name - Celebrity name
 * @returns {object|null} Celebrity object or null if not found
 */
function getCelebrityByName(name) {
    if (!name) return null;
    return CELEBRITIES.find(c => c.name.toLowerCase() === name.toLowerCase());
}

/**
 * Get all celebrities (returns copy of array)
 * @returns {array} Array of all celebrities
 */
function getAllCelebrities() {
    return [...CELEBRITIES];
}

/**
 * Filter celebrities by category
 * @param {string} category - Category name
 * @returns {array} Filtered celebrities
 */
function getCelebritiesByCategory(category) {
    if (!category) return [...CELEBRITIES];
    return CELEBRITIES.filter(c => c.category === category);
}

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
 * @param {number} price - Price value
 * @returns {string} Formatted price string
 */
function formatPrice(price) {
    if (!price) return '$0';
    return '$' + price.toLocaleString('en-US');
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

/**
 * Clear entire watchlist
 */
function clearWatchlist() {
    localStorage.removeItem('starryMeetWatchlist');
}

/**
 * Get user profile from localStorage
 * @returns {object} User profile object
 */
function getUserProfile() {
    const stored = localStorage.getItem('starryMeetUser');
    return stored ? JSON.parse(stored) : {
        name: 'Guest User',
        email: '',
        phone: '',
        photo: null
    };
}

/**
 * Save user profile to localStorage
 * @param {object} profile - User profile object
 */
function saveUserProfile(profile) {
    localStorage.setItem('starryMeetUser', JSON.stringify(profile));
}

/**
 * Get all bookings from localStorage
 * @returns {array} Array of booking objects
 */
function getBookings() {
    const stored = localStorage.getItem('starryMeetBookings');
    return stored ? JSON.parse(stored) : [];
}

/**
 * Save booking to localStorage
 * @param {object} booking - Booking object
 */
function saveBooking(booking) {
    const bookings = getBookings();
    bookings.push({
        ...booking,
        id: Date.now(),
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('starryMeetBookings', JSON.stringify(bookings));
}

// ========================================
// UI HELPER FUNCTIONS
// ========================================

/**
 * Show loading spinner
 * @param {string} elementId - ID of element to show spinner in
 */
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div style="text-align: center; padding: 4rem;"><div style="display: inline-block; width: 50px; height: 50px; border: 4px solid #f3f4f6; border-top-color: #6B46C1; border-radius: 50%; animation: spin 1s linear infinite;"></div></div>';
    }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 * @param {string} elementId - ID of element to show error in
 */
function showError(message, elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div style="text-align: center; padding: 3rem; color: #EF4444;"><p style="font-size: 1.2rem; font-weight: 600;">${message}</p></div>`;
    }
}

/**
 * Show success message
 * @param {string} message - Success message to display
 */
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = 'position: fixed; top: 100px; right: 20px; background: #10B981; color: white; padding: 1rem 2rem; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); z-index: 9999; font-weight: 600;';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.style.transition = 'opacity 0.3s';
        successDiv.style.opacity = '0';
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.toggle('show');
    }
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.remove('show');
    }
}

// ========================================
// INITIALIZATION
// ========================================

// Add CSS animation for spinner
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
}

// Export for use in other files (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CELEBRITIES,
        COLOR_PALETTES,
        getCelebrityByName,
        getAllCelebrities,
        getCelebritiesByCategory,
        getInitials,
        getColorForCelebrity,
        formatPrice,
        formatDate,
        getURLParameter,
        navigateToPage,
        saveToWatchlist,
        removeFromWatchlist,
        getWatchlist,
        isInWatchlist,
        clearWatchlist,
        getUserProfile,
        saveUserProfile,
        getBookings,
        saveBooking,
        showLoading,
        showError,
        showSuccessMessage,
        toggleMobileMenu,
        closeMobileMenu
    };
}

// Log initialization
console.log('StarryMeet Shared JS loaded -', CELEBRITIES.length, 'celebrities available');
