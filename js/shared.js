/**
 * StarryMeet Shared JavaScript
 * Common data, utilities, and functions used across all pages
 */

// Celebrity Data - Complete list used across the platform
// Note: imageUrl field can be added to each celebrity for profile pictures (e.g., imageUrl: "path/to/image.jpg")
// If imageUrl is not provided, the app will display colored initials as a fallback
const CELEBRITIES = [
    { name: "Emma Watson", category: "Hollywood", location: "London • Mar 15", city: "London", country: "UK", price: 5000, verified: true, trending: true, imageUrl: null },
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
    const overlay = document.getElementById('mobileMenuOverlay');
    if (menu) {
        menu.classList.toggle('show');
    }
    if (overlay) {
        overlay.classList.toggle('show');
    }
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    if (menu) {
        menu.classList.remove('show');
    }
    if (overlay) {
        overlay.classList.remove('show');
    }
}

/**
 * Toggle categories dropdown in nav
 */
function toggleCategoriesDropdown() {
    const dropdown = document.getElementById('categoriesDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

/**
 * Toggle mobile categories submenu
 */
function toggleMobileCategoriesSubmenu() {
    const submenu = document.getElementById('mobileSubmenu');
    if (submenu) {
        submenu.classList.toggle('active');
    }
}

/**
 * Locale detection and management
 */
const LOCALE_DATA = {
    languages: [
        { code: 'EN', name: 'English' },
        { code: 'ES', name: 'Español' },
        { code: 'FR', name: 'Français' },
        { code: 'DE', name: 'Deutsch' },
        { code: 'IT', name: 'Italiano' },
        { code: 'PT', name: 'Português' }
    ],
    countries: {
        'United States': '$ USD',
        'Spain': '€ EUR',
        'France': '€ EUR',
        'Germany': '€ EUR',
        'Italy': '€ EUR',
        'United Kingdom': '£ GBP',
        'Canada': '$ CAD',
        'Australia': '$ AUD',
        'Brazil': 'R$ BRL',
        'Mexico': '$ MXN'
    }
};

function detectLocale() {
    const stored = localStorage.getItem('starryMeetLocale');
    if (stored) {
        return JSON.parse(stored);
    }

    // Auto-detect from browser
    const browserLang = navigator.language.split('-')[0].toUpperCase();
    const language = LOCALE_DATA.languages.find(l => l.code === browserLang)?.code || 'EN';

    return {
        language: language,
        country: 'United States',
        currency: '$ USD'
    };
}

function updateLocaleDisplay() {
    const locale = detectLocale();
    const text = `${locale.language} | ${locale.country} | ${locale.currency}`;

    const mobileText = document.getElementById('mobileLocaleText');
    const footerText = document.getElementById('footerLocaleText');

    if (mobileText) mobileText.textContent = text;
    if (footerText) footerText.textContent = text;
}

function openLocaleModal() {
    const locale = detectLocale();
    const modal = document.createElement('div');
    modal.id = 'localeModal';
    modal.className = 'locale-modal';
    modal.innerHTML = `
        <div class="locale-modal-overlay" onclick="closeLocaleModal()"></div>
        <div class="locale-modal-content">
            <button class="locale-modal-close" onclick="closeLocaleModal()">×</button>
            <h2>Locale Preferences</h2>
            <p class="locale-modal-subtitle">Select your preferred language, country, and currency</p>

            <div class="locale-form">
                <div class="locale-field">
                    <label>Language</label>
                    <select id="localeLanguage">
                        ${LOCALE_DATA.languages.map(l =>
                            `<option value="${l.code}" ${l.code === locale.language ? 'selected' : ''}>${l.name}</option>`
                        ).join('')}
                    </select>
                </div>

                <div class="locale-field">
                    <label>Country</label>
                    <p class="locale-note">To select a country, please login or create an account</p>
                    <select id="localeCountry" disabled>
                        ${Object.keys(LOCALE_DATA.countries).map(country =>
                            `<option value="${country}" ${country === locale.country ? 'selected' : ''}>${country}</option>`
                        ).join('')}
                    </select>
                </div>

                <div class="locale-field">
                    <label>Currency</label>
                    <input type="text" id="localeCurrency" value="${locale.currency}" disabled>
                </div>

                <button class="locale-save-btn" onclick="saveLocale()">Save Preferences</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeLocaleModal() {
    const modal = document.getElementById('localeModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function saveLocale() {
    const language = document.getElementById('localeLanguage').value;
    const country = document.getElementById('localeCountry').value;
    const currency = LOCALE_DATA.countries[country] || '$ USD';

    const locale = { language, country, currency };
    localStorage.setItem('starryMeetLocale', JSON.stringify(locale));

    updateLocaleDisplay();
    closeLocaleModal();
}

// Initialize locale on page load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', updateLocaleDisplay);
}

// Close dropdown when clicking outside
if (typeof document !== 'undefined') {
    document.addEventListener('click', function(event) {
        const dropdown = document.getElementById('categoriesDropdown');
        const navItem = document.querySelector('.nav-item-categories');
        if (dropdown && navItem && !navItem.contains(event.target)) {
            dropdown.classList.remove('active');
        }
    });
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
        closeMobileMenu,
        handleMessageClick
    };

    // Handle message click - requires authentication and booking
    function handleMessageClick() {
        const user = getUserProfile();
        const bookings = getBookings();

        if (!user || !user.name) {
            showSuccessMessage('Please create an account to message celebrities');
            setTimeout(() => {
                window.location.href = 'dashboard.html?tab=settings';
            }, 1500);
            return;
        }

        if (!bookings || bookings.length === 0) {
            showSuccessMessage('Book a meeting first to unlock messaging');
            return;
        }

        window.location.href = 'dashboard.html?tab=messages';
    }

    // Testimonial pools for generating unique testimonials
    const TESTIMONIAL_NAMES = [
        'Sarah Mitchell', 'Emily Chen', 'Jessica Williams', 'Amanda Foster', 'Rachel Anderson',
        'Michael Torres', 'David Park', 'James Rodriguez', 'Christopher Lee', 'Daniel Kim',
        'Maria Garcia', 'Lisa Thompson', 'Jennifer Martinez', 'Michelle Davis', 'Laura Wilson',
        'Robert Johnson', 'Kevin Brown', 'Brandon White', 'Justin Taylor', 'Tyler Moore'
    ];

    const TESTIMONIAL_LOCATIONS = [
        'Los Angeles, CA', 'New York, NY', 'Chicago, IL', 'Miami, FL', 'Seattle, WA',
        'Austin, TX', 'Boston, MA', 'Denver, CO', 'Portland, OR', 'San Francisco, CA',
        'Atlanta, GA', 'Phoenix, AZ', 'Nashville, TN', 'Las Vegas, NV', 'San Diego, CA'
    ];

    const TESTIMONIAL_TEXTS = [
        'This was absolutely incredible! The meeting felt so genuine and personal.',
        'Worth every penny! Such a warm and authentic experience.',
        'A dream come true! Professional, friendly, and the celebrity was amazing.',
        'Exceeded all my expectations! Truly unforgettable moment.',
        'Best experience ever! The platform made it so easy and seamless.',
        'Absolutely amazing! The celebrity was so down-to-earth and kind.',
        'Once in a lifetime opportunity! Everything was perfectly organized.',
        'Incredible experience! The team was professional and supportive.',
        'Beyond my wildest dreams! The meetup was better than I imagined.',
        'Totally worth it! The celebrity was generous with their time.',
        'Outstanding service! From booking to meeting, everything was perfect.',
        'Life-changing experience! I\'ll treasure this memory forever.',
        'Fantastic! The celebrity was engaging and made me feel special.',
        'Highly recommend! Professional, authentic, and truly memorable.',
        'Surpassed my expectations! The entire experience was flawless.'
    ];

    // Generate unique testimonials for a celebrity
    function generateTestimonialsForCelebrity(celebrityName) {
        const testimonials = [];
        const seed = celebrityName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

        for (let i = 0; i < 3; i++) {
            const nameIndex = (seed + i * 7) % TESTIMONIAL_NAMES.length;
            const locationIndex = (seed + i * 11) % TESTIMONIAL_LOCATIONS.length;
            const textIndex = (seed + i * 13) % TESTIMONIAL_TEXTS.length;

            const name = TESTIMONIAL_NAMES[nameIndex];
            const location = TESTIMONIAL_LOCATIONS[locationIndex];
            const text = TESTIMONIAL_TEXTS[textIndex];

            const monthsAgo = ((seed + i) % 6) + 1;
            const date = `${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;

            testimonials.push({
                name: name,
                location: location,
                rating: 5,
                text: text,
                date: date,
                initials: getInitials(name),
                color: getColorForCelebrity(name)
            });
        }

        return testimonials;
    }

    // Add to public API
    window.StarryMeet.generateTestimonialsForCelebrity = generateTestimonialsForCelebrity;
}

// Log initialization
console.log('StarryMeet Shared JS loaded -', CELEBRITIES.length, 'celebrities available');

// ========================================
// AUTHENTICATION MODAL INJECTION
// ========================================

/**
 * Dynamically load and inject the authentication modal into the page
 */
function loadAuthModal() {
    // Detect if we're in a subdirectory (like blog/)
    const path = window.location.pathname;
    const isSubdirectory = path.includes('/blog/');
    const prefix = isSubdirectory ? '../' : '';

    fetch(`${prefix}components/auth-modal.html`)
        .then(response => response.text())
        .then(html => {
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = html;
            document.body.appendChild(modalContainer.firstElementChild);

            // Load auth.js after modal is injected
            const authScript = document.createElement('script');
            authScript.src = `${prefix}js/auth.js`;
            document.head.appendChild(authScript);
        })
        .catch(error => {
            console.error('Failed to load auth modal:', error);
        });
}

// Load auth modal when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', loadAuthModal);
}

// ========================================
// FULL-STACK DATA MANAGEMENT (localStorage MVP)
// ========================================

/**
 * localStorage Keys
 */
const STORAGE_KEYS = {
    USERS: 'starrymeet_users',
    BOOKINGS: 'starrymeet_bookings',
    FAVORITES: 'starrymeet_favorites',
    SESSION: 'starrymeet_session',
    CURRENT_BOOKING: 'starrymeet_currentBooking'
};

// ========================================
// USER MANAGEMENT
// ========================================

/**
 * Create a new user account
 * @param {object} userData - User data {name, email, password}
 * @returns {object} Created user object (without password)
 */
function createUser(userData) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    
    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
        throw new Error('User with this email already exists');
    }
    
    const newUser = {
        id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: userData.password, // In production, this would be hashed
        avatar: userData.avatar || null,
        phone: userData.phone || '',
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
}

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {object} User object (without password) or null
 */
function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
    );
    
    if (!user) {
        return null;
    }
    
    // Set session
    setSession(user.id);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

/**
 * Logout current user
 */
function logoutUser() {
    clearSession();
    // Also clear legacy auth data
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
}

/**
 * Get current logged-in user
 * @returns {object|null} User object or null
 */
function getCurrentUser() {
    const session = getSession();
    if (!session || !session.userId) {
        return null;
    }
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find(u => u.id === session.userId);
    
    if (!user) {
        return null;
    }
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {object} updates - Fields to update
 * @returns {object} Updated user object
 */
function updateUserProfile(userId, updates) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        throw new Error('User not found');
    }
    
    // Don't allow updating certain fields
    delete updates.id;
    delete updates.createdAt;
    
    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    const { password, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
}

// ========================================
// SESSION MANAGEMENT
// ========================================

/**
 * Set user session
 * @param {string} userId - User ID
 */
function setSession(userId) {
    const session = {
        userId: userId,
        isAuthenticated: true,
        loginTime: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

/**
 * Get current session
 * @returns {object|null} Session object or null
 */
function getSession() {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    return session ? JSON.parse(session) : null;
}

/**
 * Clear session (logout)
 */
function clearSession() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
}

/**
 * Check if user is authenticated (for page protection)
 * @returns {boolean} True if authenticated
 */
function isAuthenticated() {
    const session = getSession();
    return session && session.isAuthenticated === true;
}

/**
 * Require authentication - redirect to homepage if not logged in
 */
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// ========================================
// BOOKING MANAGEMENT
// ========================================

/**
 * Create a new booking
 * @param {object} bookingData - Booking details
 * @returns {object} Created booking object
 */
function createBooking(bookingData) {
    const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    const user = getCurrentUser();
    
    if (!user) {
        throw new Error('Must be logged in to create booking');
    }
    
    const newBooking = {
        id: 'booking_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        userId: user.id,
        celebrityName: bookingData.celebrityName,
        date: bookingData.date,
        time: bookingData.time,
        location: bookingData.location,
        meetingType: bookingData.meetingType || 'Private Meet & Greet',
        duration: bookingData.duration || '30 minutes',
        price: bookingData.price,
        status: 'pending', // pending, approved, rejected, completed, cancelled
        applicationData: {
            occupation: bookingData.occupation || '',
            hometown: bookingData.hometown || '',
            whyMeet: bookingData.whyMeet || '',
            topics: bookingData.topics || ''
        },
        createdAt: new Date().toISOString()
    };
    
    bookings.push(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    
    return newBooking;
}

/**
 * Get bookings for a user
 * @param {string} userId - User ID (optional, uses current user if not provided)
 * @param {string} status - Filter by status (optional)
 * @returns {array} Array of booking objects
 */
function getBookings(userId = null, status = null) {
    const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    const targetUserId = userId || getCurrentUser()?.id;
    
    if (!targetUserId) {
        return [];
    }
    
    let userBookings = bookings.filter(b => b.userId === targetUserId);
    
    if (status) {
        userBookings = userBookings.filter(b => b.status === status);
    }
    
    // Sort by creation date (newest first)
    return userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Update booking status
 * @param {string} bookingId - Booking ID
 * @param {string} status - New status
 * @returns {object} Updated booking object
 */
function updateBookingStatus(bookingId, status) {
    const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex === -1) {
        throw new Error('Booking not found');
    }
    
    bookings[bookingIndex].status = status;
    bookings[bookingIndex].updatedAt = new Date().toISOString();
    
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    return bookings[bookingIndex];
}

/**
 * Get booking by ID
 * @param {string} bookingId - Booking ID
 * @returns {object|null} Booking object or null
 */
function getBookingById(bookingId) {
    const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    return bookings.find(b => b.id === bookingId) || null;
}

// ========================================
// FAVORITES MANAGEMENT
// ========================================

/**
 * Add celebrity to favorites
 * @param {string} userId - User ID (optional, uses current user if not provided)
 * @param {string} celebrityName - Celebrity name
 * @returns {boolean} Success
 */
function addToFavorites(userId, celebrityName) {
    const favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
    const targetUserId = userId || getCurrentUser()?.id;
    
    if (!targetUserId) {
        throw new Error('Must be logged in to add favorites');
    }
    
    // Check if already favorited
    const existingFav = favorites.find(f => 
        f.userId === targetUserId && f.celebrityName === celebrityName
    );
    
    if (existingFav) {
        return false; // Already favorited
    }
    
    favorites.push({
        userId: targetUserId,
        celebrityName: celebrityName,
        addedAt: new Date().toISOString()
    });
    
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    return true;
}

/**
 * Remove celebrity from favorites
 * @param {string} userId - User ID (optional, uses current user if not provided)
 * @param {string} celebrityName - Celebrity name
 * @returns {boolean} Success
 */
function removeFromFavorites(userId, celebrityName) {
    const favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
    const targetUserId = userId || getCurrentUser()?.id;
    
    if (!targetUserId) {
        return false;
    }
    
    const filteredFavorites = favorites.filter(f => 
        !(f.userId === targetUserId && f.celebrityName === celebrityName)
    );
    
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filteredFavorites));
    return true;
}

/**
 * Get user's favorite celebrities
 * @param {string} userId - User ID (optional, uses current user if not provided)
 * @returns {array} Array of celebrity names
 */
function getFavorites(userId = null) {
    const favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
    const targetUserId = userId || getCurrentUser()?.id;
    
    if (!targetUserId) {
        return [];
    }
    
    return favorites
        .filter(f => f.userId === targetUserId)
        .map(f => f.celebrityName);
}

/**
 * Check if celebrity is favorited
 * @param {string} userId - User ID (optional, uses current user if not provided)
 * @param {string} celebrityName - Celebrity name
 * @returns {boolean} True if favorited
 */
function isFavorite(userId, celebrityName) {
    const favorites = getFavorites(userId);
    return favorites.includes(celebrityName);
}

// ========================================
// BOOKING FLOW STATE MANAGEMENT
// ========================================

/**
 * Save current booking in progress (temporary)
 * @param {object} bookingData - Partial booking data
 */
function saveCurrentBooking(bookingData) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_BOOKING, JSON.stringify(bookingData));
}

/**
 * Get current booking in progress
 * @returns {object|null} Booking data or null
 */
function getCurrentBooking() {
    const booking = localStorage.getItem(STORAGE_KEYS.CURRENT_BOOKING);
    return booking ? JSON.parse(booking) : null;
}

/**
 * Clear current booking (after completion or cancellation)
 */
function clearCurrentBooking() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_BOOKING);
}

// Log initialization
console.log('StarryMeet Full-Stack Data Management loaded');
