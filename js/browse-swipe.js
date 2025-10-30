/**
 * browse-swipe.js - Main browse page functionality
 * Grid view + Swipe view with advanced filtering
 */

class BrowsePage {
    constructor() {
        this.currentView = 'grid';
        this.filters = {
            category: 'all',
            price: 'all',
            tier: 'all',
            availability: 'all',
            search: ''
        };
        this.celebrities = [];
        this.filteredCelebrities = [];
        this.sortBy = 'recommended';

        this.init();
    }

    async init() {
        // Load celebrities
        await this.loadCelebrities();

        // Set up event listeners
        this.setupEventListeners();

        // Initial render
        this.applyFilters();
        this.renderGrid();

        // Check if mobile and set swipe as default
        if (window.innerWidth <= 768) {
            this.switchView('swipe');
            // Update view switcher UI
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.view === 'swipe');
            });
        }
    }

    async loadCelebrities() {
        try {
            const api = new APIClient();
            const response = await api.getFeaturedCelebrities(100);

            console.log('📡 API Response:', response);

            if (response.success && response.data) {
                // Handle both response formats
                const celebrityData = response.data.celebrities || response.data.profiles || [];
                this.celebrities = celebrityData;
                this.filteredCelebrities = [...this.celebrities];

                // Update total count
                const totalCountEl = document.getElementById('totalCount');
                if (totalCountEl) {
                    const total = response.data.pagination?.total || this.celebrities.length;
                    totalCountEl.textContent = total;
                }

                console.log('✅ Loaded', this.celebrities.length, 'celebrities');
            } else {
                console.warn('⚠️ Unexpected response structure:', response);
                throw new Error('Invalid API response');
            }
        } catch (error) {
            console.error('❌ Error loading celebrities:', error);
            this.celebrities = [];
            this.filteredCelebrities = [];
        }
    }

    setupEventListeners() {
        // Search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.applyFilters();
                this.renderGrid();
            });
        }

        // Category filters
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active from all
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active to clicked
                e.target.classList.add('active');

                this.filters.category = e.target.dataset.category;
                this.applyFilters();
                this.renderGrid();
            });
        });

        // View switcher
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);

                // Update active state
                viewBtns.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        // More filters modal
        const moreFiltersBtn = document.getElementById('moreFiltersBtn');
        const filtersModal = document.getElementById('filtersModal');
        const closeModal = document.getElementById('closeFiltersModal');
        const applyFiltersBtn = document.getElementById('applyFilters');
        const clearFiltersBtn = document.getElementById('clearFilters');

        if (moreFiltersBtn && filtersModal) {
            moreFiltersBtn.addEventListener('click', () => {
                filtersModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        if (closeModal && filtersModal) {
            closeModal.addEventListener('click', () => {
                filtersModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        if (filtersModal) {
            filtersModal.addEventListener('click', (e) => {
                if (e.target === filtersModal) {
                    filtersModal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // Filter options in modal
        const filterOptions = document.querySelectorAll('.filter-option');
        filterOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const parent = e.target.closest('.filter-group');
                const siblings = parent.querySelectorAll('.filter-option');
                siblings.forEach(s => s.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        if (applyFiltersBtn && filtersModal) {
            applyFiltersBtn.addEventListener('click', () => {
                this.applyModalFilters();
                filtersModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

        // Sort button
        const sortBtn = document.getElementById('sortBtn');
        if (sortBtn) {
            sortBtn.addEventListener('click', () => {
                this.cycleSortOrder();
            });
        }
    }

    switchView(view) {
        this.currentView = view;

        const gridView = document.getElementById('gridView');
        const swipeView = document.getElementById('swipeView');

        if (view === 'grid') {
            gridView.style.display = 'block';
            swipeView.style.display = 'none';
            this.renderGrid();
        } else {
            gridView.style.display = 'none';
            swipeView.style.display = 'block';
            // Initialize swipe view
            if (window.initSwipeView) {
                window.initSwipeView();
            }
        }
    }

    applyFilters() {
        this.filteredCelebrities = this.celebrities.filter(celeb => {
            // Category filter
            if (this.filters.category !== 'all' && celeb.category !== this.filters.category) {
                return false;
            }

            // Price filter
            if (this.filters.price !== 'all') {
                const minPrice = parseFloat(celeb.min_price) || 0;
                const parts = this.filters.price.split('-');

                if (parts.length === 2) {
                    const min = parseInt(parts[0]);
                    const max = parseInt(parts[1]);
                    if (minPrice < min || minPrice > max) return false;
                } else if (this.filters.price.endsWith('+')) {
                    const min = parseInt(this.filters.price);
                    if (minPrice < min) return false;
                }
            }

            // Tier filter
            if (this.filters.tier !== 'all' && celeb.tier !== this.filters.tier) {
                return false;
            }

            // Availability filter
            if (this.filters.availability === 'available') {
                if (!celeb.availability_count || celeb.availability_count === 0) {
                    return false;
                }
            }

            // Search filter
            if (this.filters.search) {
                const searchLower = this.filters.search.toLowerCase();
                const nameMatch = celeb.name.toLowerCase().includes(searchLower);
                const categoryMatch = (celeb.category || '').toLowerCase().includes(searchLower);
                return nameMatch || categoryMatch;
            }

            return true;
        });

        // Update results count
        this.updateResultsCount();

        // Update active filters display
        this.updateActiveFilters();
    }

    applyModalFilters() {
        // Get selected filter values from modal
        const priceFilter = document.querySelector('.filter-option[data-price].active');
        const tierFilter = document.querySelector('.filter-option[data-tier].active');
        const availabilityFilter = document.querySelector('.filter-option[data-availability].active');

        if (priceFilter) this.filters.price = priceFilter.dataset.price;
        if (tierFilter) this.filters.tier = tierFilter.dataset.tier;
        if (availabilityFilter) this.filters.availability = availabilityFilter.dataset.availability;

        this.applyFilters();
        this.renderGrid();
    }

    clearAllFilters() {
        this.filters = {
            category: 'all',
            price: 'all',
            tier: 'all',
            availability: 'all',
            search: ''
        };

        // Reset UI
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === 'all');
        });

        document.querySelectorAll('.filter-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.price === 'all' || opt.dataset.tier === 'all' || opt.dataset.availability === 'all');
        });

        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';

        this.applyFilters();
        this.renderGrid();
    }

    updateResultsCount() {
        const countElement = document.getElementById('resultsCount');
        if (countElement) {
            const count = this.filteredCelebrities.length;
            countElement.textContent = `Showing ${count} icon${count !== 1 ? 's' : ''}`;
        }
    }

    updateActiveFilters() {
        const container = document.getElementById('activeFilters');
        if (!container) return;

        container.innerHTML = '';

        const activeFilters = [];

        if (this.filters.price !== 'all') {
            activeFilters.push({ key: 'price', label: `Price: ${this.filters.price}` });
        }
        if (this.filters.tier !== 'all') {
            activeFilters.push({ key: 'tier', label: `Tier ${this.filters.tier}` });
        }
        if (this.filters.availability !== 'all') {
            activeFilters.push({ key: 'availability', label: this.filters.availability });
        }

        activeFilters.forEach(filter => {
            const tag = document.createElement('div');
            tag.className = 'active-filter-tag';
            tag.innerHTML = `
                ${filter.label}
                <span class="remove-filter" data-key="${filter.key}">×</span>
            `;

            tag.querySelector('.remove-filter').addEventListener('click', () => {
                this.filters[filter.key] = 'all';
                this.applyFilters();
                this.renderGrid();
            });

            container.appendChild(tag);
        });
    }

    renderGrid() {
        const container = document.getElementById('gridContainer');
        if (!container) return;

        // Clear existing cards
        container.innerHTML = '';

        // Render filtered celebrities
        this.filteredCelebrities.forEach(celeb => {
            const card = this.createCard(celeb);
            container.appendChild(card);
        });

        // Show empty state if no results
        if (this.filteredCelebrities.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 80px 20px;">
                    <h3 style="color: #FFFFFF; font-size: 24px; margin-bottom: 16px;">
                        No icons match your filters
                    </h3>
                    <p style="color: rgba(255,255,255,0.6); margin-bottom: 30px;">
                        Try adjusting your search criteria
                    </p>
                    <button class="btn-primary" onclick="browsePage.clearAllFilters()" style="padding: 14px 32px; font-size: 16px;">
                        Clear Filters
                    </button>
                </div>
            `;
        }
    }

    createCard(celeb) {
        const card = document.createElement('a');
        card.href = `celebrity-profile.html?slug=${celeb.slug}`;
        card.className = 'celebrity-card';
        card.dataset.category = celeb.category;

        const imageUrl = celeb.picture_url || celeb.avatar_url || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=600&fit=crop&q=80';
        const tier = celeb.tier || 'A';
        const minPrice = celeb.min_price || 5000;
        const rating = celeb.review_rate > 0 ? parseFloat(celeb.review_rate).toFixed(1) : '4.8';
        const slotsLeft = celeb.availability_count || 3;

        card.innerHTML = `
            <div class="card-image-wrapper">
                <img
                    src="${imageUrl}"
                    alt="${celeb.name}"
                    class="card-image"
                    loading="lazy"
                />
                <div class="card-overlay">
                    <span class="card-cta">View Profile →</span>
                </div>
                ${celeb.verified ? '<div class="verified-badge">✓</div>' : ''}
            </div>
            <div class="card-content">
                <h3 class="card-name">${celeb.name}</h3>
                <p class="card-category">${celeb.category || 'Celebrity'}</p>
                <div class="card-meta">
                    <span class="card-tier">Tier ${tier}</span>
                    <span class="card-price">From $${parseFloat(minPrice).toLocaleString()}</span>
                </div>
                <div class="card-stats">
                    <span class="stat-item">⭐ ${rating}</span>
                    <span class="stat-divider">•</span>
                    <span class="stat-item">${slotsLeft} slots left</span>
                </div>
            </div>
        `;

        return card;
    }

    cycleSortOrder() {
        const sortOptions = ['recommended', 'price-low', 'price-high', 'rating'];
        const currentIndex = sortOptions.indexOf(this.sortBy);
        const nextIndex = (currentIndex + 1) % sortOptions.length;
        this.sortBy = sortOptions[nextIndex];

        // Apply sort
        this.sortCelebrities();
        this.renderGrid();

        // Update button text
        const sortBtn = document.getElementById('sortBtn');
        if (sortBtn) {
            const labels = {
                'recommended': 'Sort: Recommended',
                'price-low': 'Sort: Price Low-High',
                'price-high': 'Sort: Price High-Low',
                'rating': 'Sort: Highest Rated'
            };
            sortBtn.querySelector('span').textContent = labels[this.sortBy];
        }
    }

    sortCelebrities() {
        switch (this.sortBy) {
            case 'price-low':
                this.filteredCelebrities.sort((a, b) => (a.min_price || 0) - (b.min_price || 0));
                break;
            case 'price-high':
                this.filteredCelebrities.sort((a, b) => (b.min_price || 0) - (a.min_price || 0));
                break;
            case 'rating':
                this.filteredCelebrities.sort((a, b) => (b.review_rate || 0) - (a.review_rate || 0));
                break;
            default:
                // Recommended - keep original order
                break;
        }
    }
}

// Initialize when DOM is ready
let browsePage = null;

document.addEventListener('DOMContentLoaded', () => {
    browsePage = new BrowsePage();
});

// Export for global access
window.BrowsePage = BrowsePage;
