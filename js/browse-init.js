/**
 * Browse Page Initialization
 * Implements real filtering and search with CELEBRITIES array
 */

let allCelebrities = [];
let filteredCelebrities = [];
let currentCategory = null;
let currentSearch = null;

// Initialize browse page
document.addEventListener('DOMContentLoaded', function() {
    // Load all celebrities from shared.js
    allCelebrities = getAllCelebrities();
    filteredCelebrities = [...allCelebrities];

    // Handle URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentCategory = urlParams.get('category');
    currentSearch = urlParams.get('search');

    // Apply filters
    if (currentCategory) {
        filterByCategory(currentCategory);
    } else if (currentSearch) {
        searchCelebrities(currentSearch);
        // Set search input value
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = currentSearch;
        }
    } else {
        displayCelebrities(allCelebrities);
    }

    // Set up event listeners
    setupEventListeners();
});

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value;
            if (query.length > 0) {
                searchCelebrities(query);
            } else {
                filteredCelebrities = currentCategory
                    ? getCelebritiesByCategory(currentCategory)
                    : [...allCelebrities];
                displayCelebrities(filteredCelebrities);
            }
        });
    }

    // Category filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn, [data-filter-category]');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-filter-category') || this.textContent.trim();
            filterByCategory(category);
        });
    });
}

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

        return `
            <div class="celebrity-card" onclick="window.location.href='celebrity-profile.html?name=${encodeURIComponent(celeb.name)}'" style="cursor: pointer; transition: transform 0.3s, box-shadow 0.3s;">
                <div class="celebrity-avatar" style="width: 100%; aspect-ratio: 1; background: ${color}; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 3rem; font-weight: 700; color: white; margin-bottom: 16px; position: relative;">
                    ${initials}
                    ${celeb.verified ? '<span style="position: absolute; top: 8px; right: 8px; background: gold; color: black; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;">✓</span>' : ''}
                    ${celeb.trending ? '<span style="position: absolute; top: 8px; left: 8px; background: var(--primary); color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">TRENDING</span>' : ''}
                </div>
                <div class="celebrity-info" style="padding: 0 8px;">
                    <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${celeb.name}</h3>
                    <p style="opacity: 0.6; font-size: 0.875rem; margin-bottom: 4px;">${celeb.category}</p>
                    <p style="opacity: 0.5; font-size: 0.875rem; margin-bottom: 12px;">${celeb.location}</p>
                    <p style="font-size: 1.25rem; font-weight: 700; color: var(--primary);">${formatPrice(celeb.price)}</p>
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
