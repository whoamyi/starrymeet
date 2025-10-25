/**
 * Progressive Browse Page Loading
 * Loads first batch quickly, displays with skeletons, then loads rest in background
 */

let allCelebrities = [];
let filteredCelebrities = [];
let currentCategory = null;
let currentSearch = null;
let isLoading = false;
let isLoadingMore = false;

const INITIAL_LOAD = 50; // Load this many first - FAST
const BATCH_SIZE = 200;  // Then load rest in batches
const CACHE_KEY = 'starrymeet_celebrities_cache_v2';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Initialize browse page
document.addEventListener('DOMContentLoaded', async function() {
    // Show skeleton loaders immediately
    showSkeletonLoaders(12);

    // Load first batch FAST
    await loadInitialBatch();

    // Handle URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentCategory = urlParams.get('category');
    currentSearch = urlParams.get('search');

    // Apply filters
    if (currentCategory) {
        filterByCategory(currentCategory);
    } else if (currentSearch) {
        searchCelebrities(currentSearch);
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = currentSearch;
    }

    // Set up event listeners
    setupEventListeners();

    // Continue loading rest in background
    loadRemainingBatches();
});

/**
 * Show skeleton loaders
 */
function showSkeletonLoaders(count = 12) {
    const resultsGrid = document.getElementById('celebritiesGrid');
    if (!resultsGrid) return;

    const skeletons = Array(count).fill(0).map(() => `
        <div class="skeleton-card">
            <div class="skeleton-image skeleton"></div>
            <div class="skeleton-content">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text short"></div>
                <div style="margin-top: 12px;">
                    <div class="skeleton skeleton-badge"></div>
                    <div class="skeleton skeleton-badge"></div>
                </div>
                <div class="skeleton skeleton-price"></div>
            </div>
        </div>
    `).join('');

    resultsGrid.innerHTML = skeletons;
}

/**
 * Load initial batch quickly (50 celebrities)
 */
async function loadInitialBatch() {
    try {
        isLoading = true;

        // Try cache first
        const cached = tryLoadFromCache();
        if (cached) {
            console.log('✅ Using cached data:', cached.length, 'celebrities');
            allCelebrities = cached;
            filteredCelebrities = [...allCelebrities];
            updateGlobalState();
            renderCurrentView();
            isLoading = false;

            // Refresh cache in background
            setTimeout(() => refreshCacheInBackground(), 5000);
            return;
        }

        console.log('📥 Loading initial batch from API...');
        console.log('📍 API URL:', window.api.baseURL);

        // Load first 50 FAST
        const response = await window.api.getCelebrityCards({
            limit: INITIAL_LOAD,
            offset: 0
        });

        console.log('📦 API Response:', response);

        if (!response.success || !response.data) {
            console.error('❌ API response failed:', response);
            showErrorState();
            return;
        }

        // Transform and display immediately
        allCelebrities = response.data.celebrities.map(transformCelebrity);
        filteredCelebrities = [...allCelebrities];

        console.log(`✅ Loaded ${allCelebrities.length} celebrities - displaying now!`);
        console.log('📊 Sample celebrity data:', allCelebrities[0]);

        updateGlobalState();
        renderCurrentView();

    } catch (error) {
        console.error('❌ Error loading initial batch:', error);
        console.error('Error details:', error.message, error.code);
        showErrorState();
    } finally {
        isLoading = false;
    }
}

/**
 * Load remaining celebrities in background
 */
async function loadRemainingBatches() {
    try {
        // Get total count
        const initialResponse = await window.api.getCelebrityCards({
            limit: 1,
            offset: 0
        });

        if (!initialResponse.success) return;

        const total = initialResponse.data.pagination.total;
        const remaining = total - INITIAL_LOAD;

        if (remaining <= 0) {
            saveToCache();
            return;
        }

        console.log(`📊 Loading remaining ${remaining} celebrities in background...`);

        // Show "loading more" indicator
        showLoadingMoreIndicator();

        // Load in batches
        const batches = Math.ceil(remaining / BATCH_SIZE);

        for (let i = 0; i < batches; i++) {
            const offset = INITIAL_LOAD + (i * BATCH_SIZE);

            const response = await window.api.getCelebrityCards({
                limit: BATCH_SIZE,
                offset: offset
            });

            if (response.success && response.data) {
                const newCelebs = response.data.celebrities.map(transformCelebrity);
                allCelebrities = allCelebrities.concat(newCelebs);

                // Update every few batches to show progress
                if ((i + 1) % 5 === 0 || i === batches - 1) {
                    filteredCelebrities = [...allCelebrities];
                    updateGlobalState();
                    console.log(`✅ Progress: ${allCelebrities.length}/${total} celebrities`);
                }
            }

            // Small delay to not overwhelm backend
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Final update
        filteredCelebrities = [...allCelebrities];
        updateGlobalState();
        hideLoadingMoreIndicator();

        console.log(`🎉 Loaded all ${allCelebrities.length} celebrities!`);

        // Save to cache
        saveToCache();

    } catch (error) {
        console.error('Error loading remaining batches:', error);
        hideLoadingMoreIndicator();
    }
}

/**
 * Try to load from cache
 */
function tryLoadFromCache() {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp > CACHE_DURATION) {
            localStorage.removeItem(CACHE_KEY);
            return null;
        }

        console.log('✅ Loaded from cache:', data.length, 'celebrities');
        return data;
    } catch (e) {
        console.warn('⚠️ Cache error:', e.message);
        localStorage.removeItem(CACHE_KEY);
        return null;
    }
}

/**
 * Save to cache
 */
function saveToCache() {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: allCelebrities,
            timestamp: Date.now()
        }));
        console.log('💾 Cached', allCelebrities.length, 'celebrities');
    } catch (e) {
        console.warn('⚠️ Could not cache:', e.message);
    }
}

/**
 * Update global state
 */
function updateGlobalState() {
    window.celebrities = allCelebrities;
    window.filteredCelebrities = filteredCelebrities;

    console.log('🔄 Updating global state with', allCelebrities.length, 'celebrities');

    // Rebuild filters
    if (typeof window.buildCategoryTree === 'function') {
        console.log('📋 Calling buildCategoryTree...');
        window.buildCategoryTree();
    } else {
        console.warn('⚠️ buildCategoryTree function not found');
    }

    if (typeof window.buildLocationTree === 'function') {
        console.log('📍 Calling buildLocationTree...');
        window.buildLocationTree();
    } else {
        console.warn('⚠️ buildLocationTree function not found');
    }
}

/**
 * Render current view
 */
function renderCurrentView() {
    if (typeof window.renderCelebrities === 'function') {
        window.renderCelebrities();
    }
}

/**
 * Show loading more indicator
 */
function showLoadingMoreIndicator() {
    const container = document.querySelector('.browse-container');
    if (!container) return;

    let indicator = document.getElementById('loadingMoreIndicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'loadingMoreIndicator';
        indicator.className = 'loading-more';
        indicator.innerHTML = `
            <div class="spinner"></div>
            <div>Loading more celebrities...</div>
        `;
        container.appendChild(indicator);
    }
}

/**
 * Hide loading more indicator
 */
function hideLoadingMoreIndicator() {
    const indicator = document.getElementById('loadingMoreIndicator');
    if (indicator) {
        indicator.remove();
    }
}

/**
 * Show error state
 */
function showErrorState() {
    const resultsGrid = document.getElementById('celebritiesGrid');
    if (resultsGrid) {
        resultsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #9CA3AF;">
                <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
                <div style="font-size: 18px; margin-bottom: 8px; color: #EF4444;">Failed to load celebrities</div>
                <div style="font-size: 14px; opacity: 0.7; margin-bottom: 20px;">Please check your connection and try again</div>
                <button onclick="location.reload()" style="background: #8B5CF6; color: white; border: none; padding: 10px 24px; border-radius: 8px; cursor: pointer; font-size: 14px;">
                    Reload Page
                </button>
            </div>
        `;
    }
}

/**
 * Transform celebrity data
 */
function transformCelebrity(celeb) {
    // Parse location into city and country
    let city = '';
    let country = '';
    if (celeb.location) {
        const parts = celeb.location.split(',').map(p => p.trim());
        if (parts.length >= 2) {
            city = parts[0]; // First part is city
            country = parts[parts.length - 1]; // Last part is country
        } else if (parts.length === 1) {
            city = parts[0];
        }
    }

    return {
        id: celeb.id,
        name: celeb.display_name,
        username: celeb.username,
        category: celeb.category,
        subcategory: celeb.subcategory,
        niche: celeb.niche_category,
        bio: celeb.bio,
        location: celeb.location,
        city: city,
        country: country,
        price: celeb.standard_meet_price_cents ? (celeb.standard_meet_price_cents / 100) : 0,
        rating: parseFloat(celeb.average_rating) || 0,
        reviews: celeb.total_reviews || 0,
        verified: celeb.is_verified || false,
        featured: celeb.is_featured || false,
        responseTime: celeb.response_time_hours || 24
    };
}

/**
 * Refresh cache in background
 */
async function refreshCacheInBackground() {
    console.log('🔄 Refreshing cache in background...');
    // Silently reload data without showing UI updates
    try {
        const response = await window.api.getCelebrityCards({ limit: 10000, offset: 0 });
        if (response.success && response.data) {
            const freshData = response.data.celebrities.map(transformCelebrity);
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data: freshData,
                timestamp: Date.now()
            }));
            console.log('✅ Cache refreshed');
        }
    } catch (e) {
        console.warn('⚠️ Background refresh failed:', e.message);
    }
}

/**
 * Apply all filters
 */
window.applyAllFilters = function() {
    if (!window.celebrities || window.celebrities.length === 0) return;

    let filtered = [...window.celebrities];

    // Category filters
    const activeCategories = document.querySelectorAll('#categoryTree .filter-tree-child.active');
    if (activeCategories.length > 0) {
        const selectedSubcategories = new Set();
        activeCategories.forEach(el => {
            const subcat = el.dataset.subcategory;
            if (subcat) selectedSubcategories.add(subcat);
        });

        if (selectedSubcategories.size > 0) {
            filtered = filtered.filter(celeb =>
                selectedSubcategories.has(celeb.subcategory)
            );
        }
    }

    // Location filters
    const activeCities = document.querySelectorAll('#locationTree .filter-tree-child.active');
    if (activeCities.length > 0) {
        const selectedCities = new Set();
        activeCities.forEach(el => {
            const city = el.dataset.city;
            if (city) selectedCities.add(city);
        });

        if (selectedCities.size > 0) {
            filtered = filtered.filter(celeb => {
                const celebCity = celeb.location ? celeb.location.split(',')[0].trim() : '';
                return selectedCities.has(celebCity);
            });
        }
    }

    // Price filter
    const priceSlider = document.getElementById('priceSlider');
    if (priceSlider) {
        const maxPrice = parseInt(priceSlider.value);
        if (maxPrice < 60000) {
            filtered = filtered.filter(celeb => celeb.price <= maxPrice);
        }
    }

    // Verified filter
    const verifiedFilter = document.getElementById('verifiedFilter');
    if (verifiedFilter && verifiedFilter.checked) {
        filtered = filtered.filter(celeb => celeb.verified === true);
    }

    // Trending/Featured filter
    const trendingFilter = document.getElementById('trendingFilter');
    if (trendingFilter && trendingFilter.checked) {
        filtered = filtered.filter(celeb => celeb.featured === true);
    }

    window.filteredCelebrities = filtered;

    // Update UI
    if (typeof window.renderCelebrities === 'function') {
        window.renderCelebrities();
    }
};

/**
 * Filter by category
 */
function filterByCategory(category) {
    // Handled by applyAllFilters now
}

/**
 * Search celebrities
 */
function searchCelebrities(query) {
    if (!query || !window.celebrities) {
        window.filteredCelebrities = [...window.celebrities];
        if (typeof window.renderCelebrities === 'function') {
            window.renderCelebrities();
        }
        return;
    }

    const searchTerm = query.toLowerCase();
    window.filteredCelebrities = window.celebrities.filter(celeb => {
        return celeb.name.toLowerCase().includes(searchTerm) ||
               (celeb.category && celeb.category.toLowerCase().includes(searchTerm)) ||
               (celeb.subcategory && celeb.subcategory.toLowerCase().includes(searchTerm)) ||
               (celeb.niche && celeb.niche.toLowerCase().includes(searchTerm)) ||
               (celeb.location && celeb.location.toLowerCase().includes(searchTerm));
    });

    if (typeof window.renderCelebrities === 'function') {
        window.renderCelebrities();
    }
}

window.searchCelebrities = searchCelebrities;

function setupEventListeners() {
    // Handled by browse.html
}
