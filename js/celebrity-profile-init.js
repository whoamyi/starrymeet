/**
 * Celebrity Profile Page Initialization
 * Fetches celebrity data from API and populates the page
 */

// Get celebrity username from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username') || urlParams.get('name'); // Support both parameters for backward compatibility

let currentCelebrity = null;

if (!username) {
    // Redirect to browse if no celebrity specified
    window.location.href = 'browse.html';
} else {
    // Load celebrity data from API
    loadCelebrityProfile();
}

async function loadCelebrityProfile() {
    try {
        console.log('🔍 Loading celebrity profile for username:', username);

        // Show loading state
        showLoadingState();

        // Check if API is available
        if (!window.api || typeof window.api.getCelebrity !== 'function') {
            console.error('❌ API not available!');
            showErrorState('API not loaded');
            return;
        }

        // Fetch celebrity from API
        console.log('📡 Fetching from API...');
        const response = await window.api.getCelebrity(username);

        console.log('📥 API Response:', response);

        if (!response) {
            console.error('❌ No response from API');
            showErrorState('No response from server');
            return;
        }

        if (!response.success) {
            console.error('❌ API returned error:', response);
            showErrorState(response.error?.message || 'Celebrity not found');
            return;
        }

        if (!response.data || !response.data.celebrity) {
            console.error('❌ No celebrity data in response');
            showErrorState('Celebrity not found');
            return;
        }

        currentCelebrity = response.data.celebrity;
        console.log('✅ Celebrity loaded:', currentCelebrity.display_name);

        // Populate the page with celebrity data
        populateCelebrityProfile(currentCelebrity);

    } catch (error) {
        console.error('❌ Error loading celebrity profile:', error);
        showErrorState(`Failed to load: ${error.message}`);
    }
}

function showLoadingState() {
    const container = document.querySelector('.container');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 200px 20px; color: white;">
                <div style="font-size: 48px; margin-bottom: 16px;">⏳</div>
                <div style="font-size: 18px;">Loading celebrity profile...</div>
            </div>
        `;
    }
}

function showErrorState(message) {
    document.body.innerHTML = `
        <nav role="navigation" aria-label="Main navigation" id="navbar">
            <div class="nav-container">
                <a href="index.html" class="logo" style="color: #ffffff;">StarryMeet</a>
            </div>
        </nav>
        <div style="text-align: center; padding: 200px 20px; color: white;">
            <h1 style="font-size: 3rem; margin-bottom: 20px;">${message}</h1>
            <p style="font-size: 1.2rem; margin-bottom: 40px; opacity: 0.8;">Sorry, we couldn't find that celebrity.</p>
            <a href="browse.html" class="btn btn-primary" style="padding: 16px 32px; font-size: 1rem;">Browse All Celebrities</a>
        </div>
    `;
}

function populateCelebrityProfile(celebrity) {
    // Transform API response to match frontend format
    const celebData = {
        name: celebrity.display_name,
        username: celebrity.username,
        category: celebrity.category,
        mainCategory: celebrity.category,
        subCategory: celebrity.subcategory,
        niche_category: celebrity.niche_category,
        bio: celebrity.bio,
        location: celebrity.location,
        verified: celebrity.is_verified,
        trending: celebrity.is_featured,
        rating: parseFloat(celebrity.average_rating || 4.9),
        reviews: celebrity.total_reviews || 0,
        meetings: celebrity.total_bookings || 0,
        response_time: celebrity.response_time_hours || 24,
        prices: {
            quick: Math.round(celebrity.quick_meet_price_cents / 100),
            standard: Math.round(celebrity.standard_meet_price_cents / 100),
            premium: Math.round(celebrity.premium_meet_price_cents / 100)
        },
        price: Math.round(celebrity.standard_meet_price_cents / 100) // Default to standard price
    };

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => updatePageContent(celebData));
    } else {
        updatePageContent(celebData);
    }
}

function updatePageContent(celebrity) {
    // Update hero image with photo or initials
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        if (celebrity.imageUrl) {
            heroImage.style.backgroundImage = `url('${celebrity.imageUrl}')`;
            heroImage.style.backgroundSize = 'cover';
            heroImage.style.backgroundPosition = 'center';
            heroImage.textContent = '';
        } else {
            // Fallback to colored initials
            const initials = getInitials(celebrity.name);
            const color = getColorForCelebrity(celebrity.name);
            heroImage.textContent = initials;
            heroImage.style.background = color;
        }
    }

    // Update hero section
    const heroNameElement = document.querySelector('.celebrity-name');
    if (heroNameElement) {
        heroNameElement.textContent = celebrity.name;
    }

    const categoryBadge = document.querySelector('.category-badge');
    if (categoryBadge) {
        categoryBadge.textContent = celebrity.subCategory || celebrity.mainCategory || celebrity.category || '';
    }

    // Update location if element exists
    const locationElement = document.querySelector('.celebrity-location');
    if (locationElement && celebrity.location) {
        locationElement.textContent = celebrity.location;
    }

    // Update bio if available
    const bioElement = document.querySelector('.bio');
    if (bioElement && celebrity.bio) {
        bioElement.textContent = celebrity.bio;
    }

    // Update rating
    const ratingElement = document.querySelector('.rating span:last-child');
    if (ratingElement) {
        ratingElement.textContent = `${celebrity.rating.toFixed(2)} (${celebrity.reviews} reviews)`;
    }

    // Update quick stats
    const statsContainer = document.querySelector('.quick-stats');
    if (statsContainer) {
        const statValues = statsContainer.querySelectorAll('.stat-value');
        if (statValues.length >= 2) {
            // Update meetings count
            statValues[0].textContent = `${celebrity.meetings}+`;
            // Update rating value
            statValues[1].textContent = `${celebrity.rating.toFixed(2)}★`;
        }
    }

    // Update pricing with all three tiers
    updatePricingDisplay(celebrity.prices);

    // Generate dynamic meeting options based on celebrity pricing
    generateMeetingOptions(celebrity.prices);

    // Store celebrity data globally for booking flow
    window.currentCelebrity = celebrity;

    console.log('✅ Celebrity profile loaded:', celebrity.name);
}

function updatePricingDisplay(prices) {
    // Update all price displays
    const priceElements = document.querySelectorAll('.price-display');
    priceElements.forEach(el => {
        el.textContent = formatPrice(prices.standard);
    });

    // Update selected price (default to standard)
    const selectedPrice = document.getElementById('selectedPrice');
    if (selectedPrice) {
        selectedPrice.textContent = formatPrice(prices.standard);
    }

    // Update sticky price
    const stickyPrice = document.getElementById('stickyPrice');
    if (stickyPrice) {
        stickyPrice.textContent = formatPrice(prices.standard);
    }
}

function generateMeetingOptions(prices) {
    // Update meeting package cards with real prices
    const packages = [
        {
            selector: '.package-card:nth-child(1)',
            name: 'Quick Meet',
            price: prices.quick,
            duration: '15-30 min',
            description: 'Perfect for a quick selfie and brief chat'
        },
        {
            selector: '.package-card:nth-child(2)',
            name: 'Standard Meet',
            price: prices.standard,
            duration: '45-60 min',
            description: 'Ideal for conversation and multiple photos',
            featured: true
        },
        {
            selector: '.package-card:nth-child(3)',
            name: 'Premium Experience',
            price: prices.premium,
            duration: '90-120 min',
            description: 'Extended time for deep conversation and personalized experience'
        }
    ];

    packages.forEach(pkg => {
        const card = document.querySelector(pkg.selector);
        if (card) {
            const titleEl = card.querySelector('.package-title');
            const priceEl = card.querySelector('.package-price');
            const durationEl = card.querySelector('.package-duration');
            const descEl = card.querySelector('.package-description, p');

            if (titleEl) titleEl.textContent = pkg.name;
            if (priceEl) priceEl.textContent = formatPrice(pkg.price);
            if (durationEl) durationEl.textContent = pkg.duration;
            if (descEl) descEl.textContent = pkg.description;

            // Update onclick to pass package type and celebrity username
            card.onclick = function() {
                selectPackage(pkg.name.toLowerCase().replace(' ', '-'), pkg.price);
            };
        }
    });
}

// Helper functions
function getInitials(name) {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function getColorForCelebrity(name) {
    const colorPalettes = [
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
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colorPalettes[index % colorPalettes.length];
}

function formatPrice(cents) {
    if (typeof cents === 'number') {
        return `$${cents.toLocaleString()}`;
    }
    return `$${cents}`;
}

function selectPackage(packageType, price) {
    if (!window.currentCelebrity) {
        console.error('No celebrity data available');
        return;
    }

    // Store selected package in sessionStorage
    sessionStorage.setItem('selectedPackage', packageType);
    sessionStorage.setItem('selectedPrice', price);
    sessionStorage.setItem('celebrityUsername', window.currentCelebrity.username);
    sessionStorage.setItem('celebrityName', window.currentCelebrity.name);

    // Navigate to booking flow
    window.location.href = `booking-step-1.html?username=${window.currentCelebrity.username}&package=${packageType}`;
}

// Export for use in booking flow
window.selectPackage = selectPackage;
window.currentCelebrity = null;
