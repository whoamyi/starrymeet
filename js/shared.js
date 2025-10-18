/**
 * StarryMeet Shared JavaScript
 * Common data, utilities, and functions used across all pages
 */

// Celebrity Data - Complete list used across the platform
// Note: imageUrl field can be added to each celebrity for profile pictures (e.g., imageUrl: "path/to/image.jpg")
// If imageUrl is not provided, the app will display colored initials as a fallback
// Structure: mainCategory is the primary grouping, subCategory is the specific type
const CELEBRITIES = [
    // Actors
    {
        name: "Emma Watson",
        mainCategory: "Actors",
        subCategory: "Hollywood",
        location: "London • Mar 15",
        city: "London",
        country: "UK",
        price: 5000,
        verified: true,
        trending: true,
        imageUrl: null,
        bio: "British actress and activist best known for playing Hermione Granger in the Harry Potter series. UN Women Goodwill Ambassador and advocate for gender equality. Graduate of Brown University.",
        rating: 4.9,
        reviews: 156,
        meetings: 180
    },
    {
        name: "Chris Hemsworth",
        mainCategory: "Actors",
        subCategory: "Hollywood",
        location: "Sydney • Mar 20",
        city: "Sydney",
        country: "Australia",
        price: 7500,
        verified: true,
        trending: true,
        imageUrl: null,
        bio: "Australian actor famous for portraying Thor in the Marvel Cinematic Universe. Known for action roles and charismatic personality. Fitness enthusiast and family man.",
        rating: 4.8,
        reviews: 203,
        meetings: 245
    },
    {
        name: "Zendaya",
        mainCategory: "Actors",
        subCategory: "Hollywood",
        location: "Los Angeles • Mar 18",
        city: "Los Angeles",
        country: "USA",
        price: 6000,
        verified: true,
        trending: true,
        imageUrl: null,
        bio: "Emmy Award-winning actress and singer. Star of Euphoria and Spider-Man films. Fashion icon and youngest woman to win Emmy for Outstanding Lead Actress in a Drama Series.",
        rating: 4.95,
        reviews: 189,
        meetings: 210
    },
    {
        name: "Tom Holland",
        mainCategory: "Actors",
        subCategory: "Hollywood",
        location: "New York • Mar 22",
        city: "New York",
        country: "USA",
        price: 5500,
        verified: true,
        trending: false,
        imageUrl: null,
        bio: "British actor portraying Spider-Man in the Marvel Cinematic Universe. Known for incredible stunts and youthful energy. BAFTA Rising Star Award winner.",
        rating: 4.85,
        reviews: 167,
        meetings: 195
    },
    {
        name: "Margot Robbie",
        mainCategory: "Actors",
        subCategory: "Hollywood",
        location: "Sydney • Apr 5",
        city: "Sydney",
        country: "Australia",
        price: 6500,
        verified: true,
        trending: true,
        imageUrl: null,
        bio: "Australian actress and producer. Academy Award nominee for I, Tonya and Bombshell. Star of Barbie (2023) and co-founder of production company LuckyChap Entertainment.",
        rating: 4.92,
        reviews: 178,
        meetings: 205
    },
    {
        name: "Ryan Reynolds",
        mainCategory: "Actors",
        subCategory: "Hollywood",
        location: "Vancouver • Mar 25",
        city: "Vancouver",
        country: "Canada",
        price: 8000,
        verified: true,
        trending: false,
        imageUrl: null,
        bio: "Canadian actor and entrepreneur best known for Deadpool franchise. Known for witty humor and philanthropic work. Owner of Aviation Gin and Wrexham AFC football club.",
        rating: 4.88,
        reviews: 234,
        meetings: 280
    },
    {
        name: "Scarlett Johansson",
        mainCategory: "Actors",
        subCategory: "Hollywood",
        location: "New York • Apr 1",
        city: "New York",
        country: "USA",
        price: 7000,
        verified: true,
        trending: false,
        imageUrl: null,
        bio: "Two-time Academy Award nominee and highest-grossing actress of all time. Known for Black Widow in Marvel films. Versatile performer in drama, action, and comedy.",
        rating: 4.87,
        reviews: 198,
        meetings: 240
    },
    {
        name: "Timothée Chalamet",
        mainCategory: "Actors",
        subCategory: "Hollywood",
        location: "Paris • Mar 28",
        city: "Paris",
        country: "France",
        price: 5500,
        verified: true,
        trending: true,
        imageUrl: null,
        bio: "Oscar-nominated actor known for Call Me by Your Name and Dune. Rising star of his generation with acclaimed performances in indie and blockbuster films. Fluent in English and French.",
        rating: 4.91,
        reviews: 145,
        meetings: 165
    },
    {
        name: "Florence Pugh",
        mainCategory: "Actors",
        subCategory: "Hollywood",
        location: "London • Apr 3",
        city: "London",
        country: "UK",
        price: 4500,
        verified: true,
        trending: false,
        imageUrl: null,
        bio: "British actress and Academy Award nominee for Little Women. Known for powerful performances in Midsommar, Black Widow, and Don't Worry Darling. Rising talent in Hollywood.",
        rating: 4.89,
        reviews: 132,
        meetings: 155
    },
    {
        name: "Michael B. Jordan",
        mainCategory: "Actors",
        subCategory: "Hollywood",
        location: "Atlanta • Mar 30",
        city: "Atlanta",
        country: "USA",
        price: 6000,
        verified: true,
        trending: false,
        imageUrl: null,
        bio: "Actor and director known for Black Panther, Creed franchise, and Fruitvale Station. Named one of Time's 100 most influential people. Producer and advocate for diversity in film.",
        rating: 4.86,
        reviews: 171,
        meetings: 190
    },
    {
        name: "Dwayne Johnson",
        mainCategory: "Actors",
        subCategory: "Hollywood",
        location: "Miami • Apr 10",
        city: "Miami",
        country: "USA",
        price: 15000,
        verified: true,
        trending: true,
        imageUrl: null,
        bio: "Actor, former WWE Champion, and entrepreneur. One of highest-paid actors in the world. Star of Fast & Furious, Jumanji, and Black Adam. Motivational speaker and fitness icon.",
        rating: 4.93,
        reviews: 312,
        meetings: 380
    },
    {
        name: "Gal Gadot",
        mainCategory: "Actors",
        subCategory: "Hollywood",
        location: "Tel Aviv • Apr 8",
        city: "Tel Aviv",
        country: "Israel",
        price: 7000,
        verified: true,
        trending: false,
        imageUrl: null,
        bio: "Israeli actress and model. Star of Wonder Woman franchise and Fast & Furious series. Former Miss Israel and IDF combat instructor. Advocate for women's empowerment.",
        rating: 4.84,
        reviews: 187,
        meetings: 215
    },
    {
        name: "Robert Downey Jr.",
        mainCategory: "Actors",
        subCategory: "Hollywood",
        location: "Los Angeles • Apr 12",
        city: "Los Angeles",
        country: "USA",
        price: 12000,
        verified: true,
        trending: false,
        imageUrl: null,
        bio: "Academy Award winner and icon of Marvel Cinematic Universe as Iron Man. One of Hollywood's highest-paid actors. Known for incredible comeback story and versatile performances.",
        rating: 4.96,
        reviews: 289,
        meetings: 340
    },
    {
        name: "Jennifer Lawrence",
        mainCategory: "Actors",
        subCategory: "Hollywood",
        location: "New York • Apr 6",
        city: "New York",
        country: "USA",
        price: 8500,
        verified: true,
        trending: false,
        imageUrl: null,
        bio: "Academy Award winner for Silver Linings Playbook. Star of Hunger Games franchise and X-Men series. Known for relatable personality and powerful dramatic performances.",
        rating: 4.88,
        reviews: 245,
        meetings: 290
    },
    {
        name: "Brad Pitt",
        mainCategory: "Actors",
        subCategory: "Hollywood",
        location: "Los Angeles • Apr 15",
        city: "Los Angeles",
        country: "USA",
        price: 10000,
        verified: true,
        trending: false,
        imageUrl: null,
        bio: "Academy Award-winning actor and producer. Star of Fight Club, Once Upon a Time in Hollywood, and Ocean's Eleven. Co-founder of Plan B Entertainment production company.",
        rating: 4.91,
        reviews: 267,
        meetings: 315
    },

    // K-Drama actors (under Actors category)
    {
        name: "Park Seo-joon",
        mainCategory: "Actors",
        subCategory: "K-Drama",
        location: "Seoul • Mar 16",
        city: "Seoul",
        country: "South Korea",
        price: 4000,
        verified: true,
        trending: true,
        imageUrl: null,
        bio: "South Korean actor known for What's Wrong with Secretary Kim, Itaewon Class, and Parasite. Rising star in Korean entertainment with roles in Marvel's The Marvels. Charismatic leading man.",
        rating: 4.87,
        reviews: 142,
        meetings: 165
    },
    {
        name: "Song Hye-kyo",
        mainCategory: "Actors",
        subCategory: "K-Drama",
        location: "Seoul • Mar 19",
        city: "Seoul",
        country: "South Korea",
        price: 4500,
        verified: true,
        trending: false,
        imageUrl: null,
        bio: "Legendary Korean actress known for Descendants of the Sun and The Glory. One of the highest-paid actresses in South Korea. Fashion icon and Hallyu wave pioneer.",
        rating: 4.92,
        reviews: 158,
        meetings: 185
    },
    {
        name: "Lee Min-ho",
        mainCategory: "Actors",
        subCategory: "K-Drama",
        location: "Seoul • Mar 21",
        city: "Seoul",
        country: "South Korea",
        price: 5000,
        verified: true,
        trending: true,
        imageUrl: null,
        bio: "Top Hallyu star known for Boys Over Flowers, The Heirs, and King: Eternal Monarch. One of Asia's most popular actors. Brand ambassador and philanthropist.",
        rating: 4.9,
        reviews: 176,
        meetings: 200
    },
    // K-Pop artists (under Musicians category)
    {
        name: "IU (Lee Ji-eun)",
        mainCategory: "Musicians",
        subCategory: "K-Pop",
        location: "Seoul • Mar 24",
        city: "Seoul",
        country: "South Korea",
        price: 6000,
        verified: true,
        trending: true,
        imageUrl: null,
        bio: "Multi-talented Korean singer-songwriter and actress. National Little Sister of Korea. Chart-topping solo artist with acclaimed K-drama roles in Hotel Del Luna and My Mister.",
        rating: 4.94,
        reviews: 198,
        meetings: 225
    },
    {
        name: "Kim Soo-hyun",
        mainCategory: "Actors",
        subCategory: "K-Drama",
        location: "Seoul • Apr 2",
        city: "Seoul",
        country: "South Korea",
        price: 5500,
        verified: true,
        trending: false,
        imageUrl: null,
        bio: "Top Korean actor known for My Love from the Star, It's Okay to Not Be Okay, and Dream High. Baeksang Arts Award winner. One of the highest-paid actors in Korea.",
        rating: 4.88,
        reviews: 164,
        meetings: 190
    },
    {
        name: "BTS (Group)",
        mainCategory: "Musicians",
        subCategory: "K-Pop Groups",
        location: "Seoul • Apr 26",
        city: "Seoul",
        country: "South Korea",
        price: 35000,
        verified: true,
        trending: true,
        imageUrl: null,
        bio: "Global K-pop phenomenon and Grammy-nominated group. Multiple Billboard Hot 100 #1 hits. First Korean act to top Billboard 200. UN speakers and cultural ambassadors. ARMY fandom worldwide.",
        rating: 4.98,
        reviews: 456,
        meetings: 520
    },

    // Business
    {
        name: "Elon Musk",
        mainCategory: "Business",
        subCategory: "Tech CEOs",
        location: "San Francisco • Mar 17",
        city: "San Francisco",
        country: "USA",
        price: 50000,
        verified: true,
        trending: true,
        imageUrl: null,
        bio: "CEO of Tesla, SpaceX, and X (formerly Twitter). Entrepreneur revolutionizing electric vehicles, space exploration, and renewable energy. World's wealthiest person and visionary innovator.",
        rating: 4.7,
        reviews: 892,
        meetings: 45
    },
    {
        name: "Jeff Bezos",
        mainCategory: "Business",
        subCategory: "Tech CEOs",
        location: "Seattle • Mar 29",
        city: "Seattle",
        country: "USA",
        price: 45000,
        verified: true,
        trending: false,
        imageUrl: null,
        bio: "Founder of Amazon and Blue Origin. Transformed e-commerce and cloud computing. One of the world's wealthiest individuals. Space exploration pioneer and philanthropist.",
        rating: 4.6,
        reviews: 678,
        meetings: 38
    },
    {
        name: "Bill Gates",
        mainCategory: "Business",
        subCategory: "Tech CEOs",
        location: "Seattle • Apr 4",
        city: "Seattle",
        country: "USA",
        price: 40000,
        verified: true,
        trending: false,
        imageUrl: null,
        bio: "Co-founder of Microsoft. Leading philanthropist through the Bill & Melinda Gates Foundation. Focus on global health, education, and poverty. Technology pioneer and humanitarian.",
        rating: 4.85,
        reviews: 734,
        meetings: 52
    },
    {
        name: "Mark Zuckerberg",
        mainCategory: "Business",
        subCategory: "Tech CEOs",
        location: "Palo Alto • Mar 26",
        city: "Palo Alto",
        country: "USA",
        price: 35000,
        verified: true,
        trending: false,
        imageUrl: null,
        bio: "Co-founder and CEO of Meta (Facebook, Instagram, WhatsApp). Pioneered social media revolution. Leading development of virtual reality and metaverse technologies. Tech entrepreneur and programmer.",
        rating: 4.5,
        reviews: 589,
        meetings: 41
    },
    {
        name: "Oprah Winfrey",
        mainCategory: "Business",
        subCategory: "Motivational Speakers",
        location: "Chicago • Apr 9",
        city: "Chicago",
        country: "USA",
        price: 30000,
        verified: true,
        trending: true,
        imageUrl: null,
        bio: "Media mogul, talk show host, and philanthropist. Former host of The Oprah Winfrey Show. Actress, producer, and founder of OWN network. Inspirational speaker and advocate for education.",
        rating: 4.95,
        reviews: 823,
        meetings: 156
    },

    // Athletes
    {
        name: "Cristiano Ronaldo",
        mainCategory: "Athletes",
        subCategory: "Football/Soccer",
        location: "Riyadh • Mar 31",
        city: "Riyadh",
        country: "Saudi Arabia",
        price: 25000,
        verified: true,
        trending: true,
        imageUrl: null,
        bio: "Five-time Ballon d'Or winner and one of the greatest footballers of all time. All-time top scorer in Champions League history. Record international goal scorer. Currently playing for Al Nassr in Saudi Arabia.",
        rating: 4.92,
        reviews: 1247,
        meetings: 89
    },
    {
        name: "Lionel Messi",
        mainCategory: "Athletes",
        subCategory: "Football/Soccer",
        location: "Miami • Apr 8",
        city: "Miami",
        country: "USA",
        price: 30000,
        verified: true,
        trending: true,
        imageUrl: null,
        bio: "Eight-time Ballon d'Or winner and 2022 World Cup champion with Argentina. Barcelona legend and current Inter Miami star. Widely considered the greatest footballer of all time. Record seven Golden Boot awards.",
        rating: 4.97,
        reviews: 1389,
        meetings: 92
    },
    {
        name: "LeBron James",
        mainCategory: "Athletes",
        subCategory: "Basketball",
        location: "Los Angeles • Apr 11",
        city: "Los Angeles",
        country: "USA",
        price: 20000,
        verified: true,
        trending: true,
        imageUrl: null,
        bio: "Four-time NBA champion and four-time MVP. All-time NBA leading scorer. Los Angeles Lakers star and basketball icon. Philanthropist and entrepreneur. 20-time NBA All-Star.",
        rating: 4.88,
        reviews: 934,
        meetings: 127
    },
    {
        name: "Serena Williams",
        mainCategory: "Athletes",
        subCategory: "Tennis",
        location: "Miami • Apr 7",
        city: "Miami",
        country: "USA",
        price: 18000,
        verified: true,
        trending: false,
        imageUrl: null,
        bio: "23-time Grand Slam singles champion. Widely regarded as one of the greatest tennis players ever. Olympic gold medalist and fashion entrepreneur. Advocate for women's rights and equality in sports.",
        rating: 4.91,
        reviews: 687,
        meetings: 112
    },
    {
        name: "Tom Brady",
        mainCategory: "Athletes",
        subCategory: "American Football",
        location: "Tampa • Apr 14",
        city: "Tampa",
        country: "USA",
        price: 22000,
        verified: true,
        trending: false,
        imageUrl: null,
        bio: "Seven-time Super Bowl champion and three-time MVP. Widely considered the greatest quarterback in NFL history. Retired after 23 seasons. Sports broadcaster and entrepreneur.",
        rating: 4.86,
        reviews: 756,
        meetings: 98
    },

    // Musicians
    {
        name: "Taylor Swift",
        mainCategory: "Musicians",
        subCategory: "Pop",
        location: "Nashville • Mar 20",
        city: "Nashville",
        country: "USA",
        price: 20000,
        verified: true,
        trending: true,
        imageUrl: null,
        bio: "14-time Grammy winner and global pop superstar. Record-breaking Eras Tour. Songwriter of the Decade. Re-recording artist who owns her masters. Cultural icon with millions of devoted Swifties worldwide.",
        rating: 4.96,
        reviews: 1534,
        meetings: 203
    },
    {
        name: "Beyoncé",
        mainCategory: "Musicians",
        subCategory: "R&B",
        location: "Houston • Mar 28",
        city: "Houston",
        country: "USA",
        price: 25000,
        verified: true,
        trending: true,
        imageUrl: null,
        bio: "32-time Grammy winner, most awarded artist in Grammy history. Queen of R&B and pop culture icon. Former Destiny's Child member. Renaissance World Tour star. Entrepreneur and activist.",
        rating: 4.98,
        reviews: 1672,
        meetings: 187
    },
    {
        name: "Ed Sheeran",
        mainCategory: "Musicians",
        subCategory: "Pop",
        location: "London • Apr 5",
        city: "London",
        country: "UK",
        price: 15000,
        verified: true,
        trending: false,
        imageUrl: null,
        bio: "British singer-songwriter with multiple chart-topping hits. Grammy and Brit Award winner. Known for Shape of You, Perfect, and Thinking Out Loud. One of the world's best-selling music artists.",
        rating: 4.89,
        reviews: 923,
        meetings: 165
    },
    {
        name: "Ariana Grande",
        mainCategory: "Musicians",
        subCategory: "Pop",
        location: "Los Angeles • Apr 10",
        city: "Los Angeles",
        country: "USA",
        price: 18000,
        verified: true,
        trending: true,
        imageUrl: null,
        bio: "Grammy-winning pop star with powerful four-octave vocal range. Known for hits like thank u, next and 7 rings. Broadway actress turned music icon. Advocate for mental health and LGBTQ+ rights.",
        rating: 4.93,
        reviews: 1189,
        meetings: 178
    }
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
    // Check both mainCategory and subCategory for backwards compatibility
    return CELEBRITIES.filter(c =>
        c.mainCategory === category ||
        c.subCategory === category ||
        c.category === category  // Legacy support
    );
}

/**
 * Get all unique main categories
 * @returns {array} Array of main category names
 */
function getAllMainCategories() {
    const mainCategories = new Set();
    CELEBRITIES.forEach(c => {
        if (c.mainCategory) mainCategories.add(c.mainCategory);
    });
    return Array.from(mainCategories).sort();
}

/**
 * Get all subcategories for a main category
 * @param {string} mainCategory - Main category name
 * @returns {array} Array of subcategory names
 */
function getSubCategories(mainCategory) {
    const subCategories = new Set();
    CELEBRITIES.forEach(c => {
        if (c.mainCategory === mainCategory && c.subCategory) {
            subCategories.add(c.subCategory);
        }
    });
    return Array.from(subCategories).sort();
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
