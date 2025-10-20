/**
 * Browse Page Initialization
 * Fetches celebrities from API and implements filtering
 */

let allCelebrities = [];
let filteredCelebrities = [];
let currentCategory = null;
let currentSearch = null;
let isLoading = false;

// Initialize browse page
document.addEventListener('DOMContentLoaded', async function() {
    // Show loading state
    showLoadingState();

    // Load celebrities from API
    await loadCelebritiesFromAPI();

    // Handle URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentCategory = urlParams.get('category');
    currentSearch = urlParams.get('search');

    // Apply filters after data loads
    if (currentCategory) {
        filterByCategory(currentCategory);
    } else if (currentSearch) {
        searchCelebrities(currentSearch);
        // Set search input value
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = currentSearch;
        }
    }

    // Set up event listeners
    setupEventListeners();
});

/**
 * Load celebrities from API - loads ALL celebrities in batches
 */
async function loadCelebritiesFromAPI() {
    try {
        isLoading = true;

        // First, get total count
        const initialResponse = await window.api.getCelebrities({
            limit: 1000,
            offset: 0
        });

        if (!initialResponse.success || !initialResponse.data) {
            console.error('Failed to load celebrities:', initialResponse);
            showErrorState();
            return;
        }

        // Transform first batch
        let allCelebsData = initialResponse.data.celebrities.map(transformCelebrity);

        const total = initialResponse.data.pagination.total;
        console.log(`📊 Total celebrities in database: ${total}`);
        console.log(`✅ Loaded batch 1: ${allCelebsData.length} celebrities`);

        // Load remaining celebrities in batches
        const batchSize = 1000;
        const totalBatches = Math.ceil(total / batchSize);

        for (let batch = 1; batch < totalBatches; batch++) {
            const offset = batch * batchSize;
            console.log(`📥 Loading batch ${batch + 1}/${totalBatches} (offset: ${offset})...`);

            const batchResponse = await window.api.getCelebrities({
                limit: batchSize,
                offset: offset
            });

            if (batchResponse.success && batchResponse.data) {
                const batchData = batchResponse.data.celebrities.map(transformCelebrity);
                allCelebsData = allCelebsData.concat(batchData);
                console.log(`✅ Loaded batch ${batch + 1}: ${batchData.length} celebrities (Total: ${allCelebsData.length})`);
            }
        }

        // Set all celebrities
        allCelebrities = allCelebsData;
        filteredCelebrities = [...allCelebrities];

        // Update global celebrities variable for browse.html functions
        if (typeof window !== 'undefined') {
            window.celebrities = allCelebrities;
            window.filteredCelebrities = filteredCelebrities;
        }

        console.log(`🎉 Loaded ALL ${allCelebrities.length} celebrities from database!`);

        // Rebuild category and location trees with new data
        if (typeof window.buildCategoryTree === 'function') {
            window.buildCategoryTree();
        }
        if (typeof window.buildLocationTree === 'function') {
            window.buildLocationTree();
        }

        // Render celebrities after data is loaded
        if (typeof window.renderCelebrities === 'function') {
            window.renderCelebrities();
        }

    } catch (error) {
        console.error('Error loading celebrities:', error);
        showErrorState();
    } finally {
        isLoading = false;
        hideLoadingState();
    }
}

/**
 * Transform celebrity data from API format to frontend format
 */
function transformCelebrity(celeb) {
    return {
        name: celeb.display_name,
        username: celeb.username,
        mainCategory: celeb.category,
        subCategory: celeb.subcategory || celeb.category,
        category: celeb.category, // Add for compatibility
        subcategory: celeb.subcategory,
        niche_category: celeb.niche_category,
        location: celeb.location,
        city: celeb.location ? celeb.location.split(',')[0].trim() : '',
        country: celeb.location ? celeb.location.split(',')[1]?.trim() : '',
        price: Math.round(celeb.standard_meet_price_cents / 100),
        verified: celeb.is_verified,
        trending: celeb.is_featured,
        imageUrl: celeb.avatar_url,
        bio: celeb.bio,
        rating: parseFloat(celeb.average_rating),
        reviews: celeb.total_reviews,
        meetings: celeb.total_bookings,
        response_time: celeb.response_time_hours
    };
}

/**
 * Show loading state
 */
function showLoadingState() {
    const resultsGrid = document.getElementById('resultsGrid');
    if (resultsGrid) {
        resultsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #9CA3AF;">
                <div style="font-size: 48px; margin-bottom: 16px;">⏳</div>
                <div style="font-size: 18px; margin-bottom: 8px;">Loading celebrities...</div>
                <div style="font-size: 14px; opacity: 0.7;">Fetching profiles from database</div>
            </div>
        `;
    }
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    // Handled by displayCelebrities()
}

/**
 * Show error state
 */
function showErrorState() {
    const resultsGrid = document.getElementById('resultsGrid');
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
 * Set up event listeners
 * Note: Most event listeners are handled by browse.html
 * This is just for legacy support and initialization
 */
function setupEventListeners() {
    // Event listeners are now handled in browse.html's initializeFilters()
    // This function is kept for backward compatibility
    console.log('✅ Browse-init event listeners ready');
}

/**
 * Apply all filters (pills, search, price, checkboxes)
 */
function applyAllFilters() {
    const searchTerm = document.getElementById('searchInput')?.value?.toLowerCase() || '';

    // Get selected subcategories from tree
    const selectedSubCategories = Array.from(document.querySelectorAll('#categoryTree .filter-tree-child.active'))
        .map(el => ({
            main: el.getAttribute('data-category'),
            sub: el.getAttribute('data-subcategory')
        }));

    // Get selected cities from tree
    const selectedCities = Array.from(document.querySelectorAll('#locationTree .filter-tree-child.active'))
        .map(el => ({
            country: el.getAttribute('data-country'),
            city: el.getAttribute('data-city')
        }));

    // Get price filter
    const priceSlider = document.getElementById('priceSlider');
    const maxPrice = priceSlider ? parseInt(priceSlider.value) : 60000;

    // Get checkboxes
    const trendingFilter = document.getElementById('trendingFilter');
    const verifiedFilter = document.getElementById('verifiedFilter');
    const trendingOnly = trendingFilter ? trendingFilter.checked : false;
    const verifiedOnly = verifiedFilter ? verifiedFilter.checked : false;

    // Count active filters
    let activeFilterCount = 0;
    if (selectedSubCategories.length > 0) activeFilterCount += selectedSubCategories.length;
    if (selectedCities.length > 0) activeFilterCount += selectedCities.length;
    if (maxPrice < 60000) activeFilterCount++;
    if (trendingOnly) activeFilterCount++;
    if (verifiedOnly) activeFilterCount++;

    // Update active filters badge
    const badge = document.getElementById('activeFiltersBadge');
    const countEl = document.getElementById('activeFiltersCount');
    if (activeFilterCount > 0) {
        badge.style.display = 'flex';
        countEl.textContent = `${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active`;
    } else {
        badge.style.display = 'none';
    }

    // Filter celebrities
    filteredCelebrities = allCelebrities.filter(celeb => {
        // Search filter
        if (searchTerm) {
            const matchesSearch =
                celeb.name.toLowerCase().includes(searchTerm) ||
                (celeb.mainCategory && celeb.mainCategory.toLowerCase().includes(searchTerm)) ||
                (celeb.subCategory && celeb.subCategory.toLowerCase().includes(searchTerm)) ||
                (celeb.category && celeb.category.toLowerCase().includes(searchTerm)) ||
                celeb.location.toLowerCase().includes(searchTerm);
            if (!matchesSearch) return false;
        }

        // Subcategory filter (hierarchical)
        if (selectedSubCategories.length > 0) {
            const matchesCategory = selectedSubCategories.some(selected =>
                celeb.mainCategory === selected.main && celeb.subCategory === selected.sub
            );
            if (!matchesCategory) return false;
        }

        // City filter (hierarchical)
        if (selectedCities.length > 0) {
            const matchesLocation = selectedCities.some(selected =>
                celeb.country === selected.country && celeb.city === selected.city
            );
            if (!matchesLocation) return false;
        }

        // Price filter
        if (celeb.price > maxPrice) return false;

        // Trending filter
        if (trendingOnly && !celeb.trending) return false;

        // Verified filter
        if (verifiedOnly && !celeb.verified) return false;

        return true;
    });

    // Export filtered results to global scope
    // Let browse.html handle the actual rendering with pagination
    window.filteredCelebrities = filteredCelebrities;
}

// Make functions and data available globally for inline event handlers
window.applyAllFilters = applyAllFilters;
window.displayCelebrities = displayCelebrities;

/**
 * Display celebrities in grid
 */
function displayCelebrities(celebrities) {
    const container = document.getElementById('celebritiesGrid') || document.querySelector('.celebrities-grid');

    if (!container) {
        console.error('Celebrity grid container not found');
        return;
    }

    if (celebrities.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <h3 style="font-size: 1.5rem; margin-bottom: 12px;">No celebrities found</h3>
                <p style="opacity: 0.6; margin-bottom: 20px;">Try adjusting your search or filters</p>
                <button onclick="window.location.href='browse.html'" class="btn btn-primary">View All</button>
            </div>
        `;
        return;
    }

    container.innerHTML = celebrities.map(celeb => {
        const initials = getInitials(celeb.name);
        const color = getColorForCelebrity(celeb.name);
        const rating = celeb.rating || 4.9;
        const reviews = celeb.reviews || 127;

        // Use image if available, otherwise show colored initials
        const avatarStyle = celeb.imageUrl
            ? `background-image: url('${celeb.imageUrl}'); background-size: cover; background-position: center;`
            : `background: ${color};`;

        return `
            <div class="celebrity-card" onclick="window.location.href='celebrity-profile.html?name=${encodeURIComponent(celeb.name)}'" style="cursor: pointer; transition: transform 0.3s, box-shadow 0.3s;">
                <div class="celebrity-avatar" style="width: 100%; aspect-ratio: 1; ${avatarStyle} border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 3rem; font-weight: 700; color: white; margin-bottom: 16px; position: relative;">
                    ${celeb.imageUrl ? '' : initials}
                    ${celeb.verified ? '<span style="position: absolute; top: 8px; right: 8px; background: gold; color: black; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;">✓</span>' : ''}
                    ${celeb.trending ? '<span style="position: absolute; top: 8px; left: 8px; background: var(--primary); color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">TRENDING</span>' : ''}
                </div>
                <div class="celebrity-info" style="padding: 0 8px;">
                    <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${celeb.name}</h3>
                    <p style="opacity: 0.6; font-size: 0.875rem; margin-bottom: 4px;">${celeb.mainCategory || celeb.category || ''}</p>
                    <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
                        <span style="color: gold; font-size: 0.875rem;">★</span>
                        <span style="opacity: 0.8; font-size: 0.875rem;">${rating} (${reviews})</span>
                    </div>
                    <p style="opacity: 0.5; font-size: 0.875rem; margin-bottom: 8px;">${celeb.location}</p>
                    <p style="opacity: 0.6; font-size: 0.875rem; margin: 0;">From ${formatPrice(celeb.price)}</p>
                </div>
            </div>
        `;
    }).join('');

    // Update results count
    updateResultsCount(celebrities.length);
}

/**
 * Filter by category
 */
function filterByCategory(category) {
    currentCategory = category;
    currentSearch = null;

    // Clear search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }

    if (category === 'All' || !category) {
        filteredCelebrities = [...allCelebrities];
        currentCategory = null;
    } else {
        filteredCelebrities = getCelebritiesByCategory(category);
    }

    displayCelebrities(filteredCelebrities);

    // Update active filter button
    const filterButtons = document.querySelectorAll('.filter-btn, [data-filter-category]');
    filterButtons.forEach(btn => {
        const btnCategory = btn.getAttribute('data-filter-category') || btn.textContent.trim();
        if (btnCategory === category || (!category && btnCategory === 'All')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update URL without page reload
    if (category && category !== 'All') {
        window.history.pushState({}, '', `browse.html?category=${encodeURIComponent(category)}`);
    } else {
        window.history.pushState({}, '', 'browse.html');
    }
}

/**
 * Search celebrities
 */
function searchCelebrities(query) {
    currentSearch = query;
    const searchQuery = query.toLowerCase().trim();

    if (!searchQuery) {
        filteredCelebrities = currentCategory
            ? getCelebritiesByCategory(currentCategory)
            : [...allCelebrities];
    } else {
        const baseList = currentCategory
            ? getCelebritiesByCategory(currentCategory)
            : allCelebrities;

        filteredCelebrities = baseList.filter(celeb =>
            celeb.name.toLowerCase().includes(searchQuery) ||
            celeb.category.toLowerCase().includes(searchQuery) ||
            celeb.location.toLowerCase().includes(searchQuery) ||
            celeb.city.toLowerCase().includes(searchQuery) ||
            celeb.country.toLowerCase().includes(searchQuery)
        );
    }

    displayCelebrities(filteredCelebrities);

    // Update URL
    if (searchQuery) {
        const url = currentCategory
            ? `browse.html?category=${encodeURIComponent(currentCategory)}&search=${encodeURIComponent(query)}`
            : `browse.html?search=${encodeURIComponent(query)}`;
        window.history.pushState({}, '', url);
    }
}

/**
 * Update results count display
 */
function updateResultsCount(count) {
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        const text = currentSearch
            ? `${count} results for "${currentSearch}"`
            : currentCategory
                ? `${count} ${currentCategory} celebrities`
                : `${count} celebrities available`;
        countElement.textContent = text;
    }
}

/**
 * Make functions globally available
 */
window.filterByCategory = filterByCategory;
window.searchCelebrities = searchCelebrities;
window.displayCelebrities = displayCelebrities;

console.log('Browse page initialized with', allCelebrities.length, 'celebrities');
