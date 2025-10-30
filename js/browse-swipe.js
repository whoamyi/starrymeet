/**
 * browse-swipe.js - Complete browse page controller
 * Grid view with pagination + Swipe view
 */

// Grid View with Pagination
class GridView {
    constructor() {
        this.celebrities = [];
        this.filteredCelebrities = [];
        this.currentPage = 1;
        this.perPage = 12;
        this.totalPages = 1;
        this.filters = {
            category: 'all',
            search: '',
            tier: 'all',
            price: 'all',
            availability: 'all'
        };
        this.sortBy = 'recommended';

        this.init();
    }

    async init() {
        await this.loadCelebrities();
        this.setupListeners();
        this.render();
    }

    async loadCelebrities() {
        try {
            const api = new APIClient();
            const response = await api.getFeaturedCelebrities(100);

            if (response.success && response.data) {
                const celebrityData = response.data.celebrities || response.data.profiles || [];
                this.celebrities = celebrityData;
                this.filteredCelebrities = [...this.celebrities];
                this.calculatePages();

                console.log('✅ Loaded', this.celebrities.length, 'celebrities for grid');
            } else {
                throw new Error('Invalid API response');
            }
        } catch (error) {
            console.error('❌ Error loading celebrities:', error);
            this.celebrities = [];
            this.filteredCelebrities = [];
        }
    }

    calculatePages() {
        this.totalPages = Math.ceil(this.filteredCelebrities.length / this.perPage);
        if (this.currentPage > this.totalPages && this.totalPages > 0) {
            this.currentPage = 1;
        }
    }

    getCurrentPageData() {
        const start = (this.currentPage - 1) * this.perPage;
        const end = start + this.perPage;
        return this.filteredCelebrities.slice(start, end);
    }

    render() {
        this.renderCards();
        this.renderPagination();
        this.updateResultsCount();
    }

    renderCards() {
        const container = document.getElementById('gridContainer');
        if (!container) return;

        const pageData = this.getCurrentPageData();

        if (pageData.length === 0) {
            container.innerHTML = `
                <div class="grid-empty">
                    <h3>No icons found</h3>
                    <p>Try adjusting your filters</p>
                    <button class="btn-primary" onclick="location.reload()" style="padding: 12px 32px; background: #D4A574; border: none; border-radius: 10px; color: #000; font-weight: 600; cursor: pointer;">Reset</button>
                </div>
            `;
            return;
        }

        container.innerHTML = pageData.map(celeb => this.createCard(celeb)).join('');
    }

    createCard(celeb) {
        const displayName = celeb.name.length > 18 ?
            celeb.name.substring(0, 18) + '...' : celeb.name;

        const imageUrl = celeb.picture_url || celeb.avatar_url || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=600&fit=crop&q=80';
        const tier = celeb.tier || 'A';
        const minPrice = celeb.min_price || 5000;
        const rating = celeb.review_rate > 0 ? parseFloat(celeb.review_rate).toFixed(1) : '4.8';
        const availability = celeb.availability_count || 3;

        return `
            <a href="celebrity-profile.html?slug=${celeb.slug}" class="grid-card">
                <div class="grid-card-image">
                    <img src="${imageUrl}" alt="${celeb.name}" loading="lazy" />
                    <div class="grid-card-badge">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#0095F6">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                </div>
                <div class="grid-card-info">
                    <div class="grid-card-header">
                        <h3 class="grid-card-name">${displayName}</h3>
                        <svg class="verified-inline" width="14" height="14" viewBox="0 0 24 24" fill="#0095F6">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <p class="grid-card-category">${celeb.category || 'Celebrity'}</p>
                    <div class="grid-card-meta">
                        <span class="grid-card-tier">TIER ${tier}</span>
                        <span class="grid-card-price">$${parseFloat(minPrice).toLocaleString()}+</span>
                    </div>
                    <div class="grid-card-stats">
                        <span class="stat-item">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4A574">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            ${rating}
                        </span>
                        <span class="stat-divider">•</span>
                        <span class="stat-item">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            ${availability}
                        </span>
                    </div>
                </div>
            </a>
        `;
    }

    renderPagination() {
        const paginationEl = document.getElementById('pagination');
        const numbersEl = document.getElementById('pageNumbers');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        if (!numbersEl || !paginationEl) return;

        // Hide pagination if only 1 page
        if (this.totalPages <= 1) {
            paginationEl.style.display = 'none';
            return;
        }

        paginationEl.style.display = 'flex';

        // Update prev/next buttons
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === this.totalPages;

        // Generate page numbers
        const pages = this.generatePageNumbers();
        numbersEl.innerHTML = pages.map(page => {
            if (page === '...') {
                return '<span class="page-ellipsis">...</span>';
            }
            return `
                <button
                    class="page-number ${page === this.currentPage ? 'active' : ''}"
                    data-page="${page}"
                >
                    ${page}
                </button>
            `;
        }).join('');

        // Attach listeners to page numbers
        numbersEl.querySelectorAll('.page-number').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.target.dataset.page);
                this.goToPage(page);
            });
        });
    }

    generatePageNumbers() {
        const pages = [];
        const maxVisible = 5;

        if (this.totalPages <= maxVisible) {
            // Show all pages
            for (let i = 1; i <= this.totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show with ellipsis
            if (this.currentPage <= 3) {
                // Near start
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(this.totalPages);
            } else if (this.currentPage >= this.totalPages - 2) {
                // Near end
                pages.push(1);
                pages.push('...');
                for (let i = this.totalPages - 3; i <= this.totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // Middle
                pages.push(1);
                pages.push('...');
                for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(this.totalPages);
            }
        }

        return pages;
    }

    goToPage(page) {
        if (page < 1 || page > this.totalPages || page === this.currentPage) return;

        this.currentPage = page;
        this.render();

        // Scroll to top of grid
        const gridView = document.getElementById('gridView');
        if (gridView) {
            gridView.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    updateResultsCount() {
        const countEl = document.getElementById('resultsCount');
        if (countEl) {
            const start = (this.currentPage - 1) * this.perPage + 1;
            const end = Math.min(start + this.perPage - 1, this.filteredCelebrities.length);
            const total = this.filteredCelebrities.length;

            if (total === 0) {
                countEl.textContent = `No results`;
            } else {
                countEl.textContent = `Showing ${start}-${end} of ${total}`;
            }
        }
    }

    applyFilters() {
        this.filteredCelebrities = this.celebrities.filter(celeb => {
            // Category
            if (this.filters.category !== 'all' && celeb.category !== this.filters.category) {
                return false;
            }

            // Search
            if (this.filters.search) {
                const searchLower = this.filters.search.toLowerCase();
                const nameMatch = celeb.name.toLowerCase().includes(searchLower);
                const categoryMatch = (celeb.category || '').toLowerCase().includes(searchLower);
                if (!nameMatch && !categoryMatch) return false;
            }

            // Tier
            if (this.filters.tier !== 'all' && celeb.tier !== this.filters.tier) {
                return false;
            }

            // Price
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

            // Availability
            if (this.filters.availability === 'available') {
                if (!celeb.availability_count || celeb.availability_count === 0) {
                    return false;
                }
            }

            return true;
        });

        this.applySorting();
        this.currentPage = 1;
        this.calculatePages();
        this.render();
    }

    applySorting() {
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

    setupListeners() {
        // Prev/Next buttons
        document.getElementById('prevPage')?.addEventListener('click', () => {
            this.goToPage(this.currentPage - 1);
        });

        document.getElementById('nextPage')?.addEventListener('click', () => {
            this.goToPage(this.currentPage + 1);
        });

        // Per page selector
        document.getElementById('perPageSelect')?.addEventListener('change', (e) => {
            this.perPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.calculatePages();
            this.render();
        });

        // Sort button
        document.getElementById('sortBtn')?.addEventListener('click', () => {
            this.cycleSortOrder();
        });
    }

    cycleSortOrder() {
        const sortOptions = ['recommended', 'price-low', 'price-high', 'rating'];
        const currentIndex = sortOptions.indexOf(this.sortBy);
        const nextIndex = (currentIndex + 1) % sortOptions.length;
        this.sortBy = sortOptions[nextIndex];

        this.applyFilters();

        // Update button text
        const sortLabel = document.getElementById('sortLabel');
        if (sortLabel) {
            const labels = {
                'recommended': 'Popular',
                'price-low': 'Price: Low to High',
                'price-high': 'Price: High to Low',
                'rating': 'Highest Rated'
            };
            sortLabel.textContent = labels[this.sortBy];
        }
    }
}

// Browse Page Controller
class BrowseController {
    constructor() {
        this.currentView = 'swipe'; // Default on mobile
        this.swipeView = null;
        this.gridView = null;

        this.init();
    }

    init() {
        // Detect device
        if (window.innerWidth >= 768) {
            this.currentView = 'grid';
        }

        this.setupViewSwitcher();
        this.setupCategoryFilters();
        this.setupSearch();
        this.setupFilterModal();
        this.initializeViews();
    }

    setupViewSwitcher() {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });
    }

    switchView(view) {
        this.currentView = view;

        // Update buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Toggle views
        const swipeViewEl = document.getElementById('swipeView');
        const gridViewEl = document.getElementById('gridView');

        if (view === 'swipe') {
            swipeViewEl.style.display = 'block';
            gridViewEl.style.display = 'none';
            if (!this.swipeView) {
                this.swipeView = new SwipeView();
            }
        } else {
            swipeViewEl.style.display = 'none';
            gridViewEl.style.display = 'block';
            if (!this.gridView) {
                this.gridView = new GridView();
            }
        }
    }

    setupCategoryFilters() {
        document.querySelectorAll('.category-pill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active state
                document.querySelectorAll('.category-pill').forEach(b =>
                    b.classList.remove('active')
                );
                e.target.classList.add('active');

                // Apply filter
                const category = e.target.dataset.category;
                if (this.gridView) {
                    this.gridView.filters.category = category;
                    this.gridView.applyFilters();
                }
            });
        });
    }

    setupSearch() {
        let searchTimeout;
        document.getElementById('searchInput')?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (this.gridView) {
                    this.gridView.filters.search = e.target.value;
                    this.gridView.applyFilters();
                }
            }, 300);
        });
    }

    setupFilterModal() {
        const filterBtn = document.getElementById('filterBtn');
        const filterModal = document.getElementById('filterModal');
        const closeModal = document.getElementById('closeModal');
        const applyFilters = document.getElementById('applyFilters');
        const clearFilters = document.getElementById('clearFilters');
        const backdrop = filterModal?.querySelector('.modal-backdrop');

        if (filterBtn && filterModal) {
            filterBtn.addEventListener('click', () => {
                filterModal.classList.add('active');
            });
        }

        if (closeModal && filterModal) {
            closeModal.addEventListener('click', () => {
                filterModal.classList.remove('active');
            });
        }

        if (backdrop && filterModal) {
            backdrop.addEventListener('click', () => {
                filterModal.classList.remove('active');
            });
        }

        // Filter options
        document.querySelectorAll('.filter-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const parent = e.target.closest('.filter-group');
                const siblings = parent.querySelectorAll('.filter-option');
                siblings.forEach(s => s.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        if (applyFilters && filterModal) {
            applyFilters.addEventListener('click', () => {
                if (this.gridView) {
                    // Get selected filter values
                    const tierFilter = document.querySelector('.filter-option[data-tier].active');
                    const priceFilter = document.querySelector('.filter-option[data-price].active');
                    const availabilityFilter = document.querySelector('.filter-option[data-availability].active');

                    if (tierFilter) this.gridView.filters.tier = tierFilter.dataset.tier;
                    if (priceFilter) this.gridView.filters.price = priceFilter.dataset.price;
                    if (availabilityFilter) this.gridView.filters.availability = availabilityFilter.dataset.availability;

                    this.gridView.applyFilters();
                }

                filterModal.classList.remove('active');
            });
        }

        if (clearFilters) {
            clearFilters.addEventListener('click', () => {
                if (this.gridView) {
                    this.gridView.filters = {
                        category: 'all',
                        search: '',
                        tier: 'all',
                        price: 'all',
                        availability: 'all'
                    };
                    this.gridView.applyFilters();
                }

                // Reset UI
                document.querySelectorAll('.category-pill').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.category === 'all');
                });

                document.querySelectorAll('.filter-option').forEach(opt => {
                    opt.classList.toggle('active',
                        opt.dataset.price === 'all' ||
                        opt.dataset.tier === 'all' ||
                        opt.dataset.availability === 'all'
                    );
                });

                const searchInput = document.getElementById('searchInput');
                if (searchInput) searchInput.value = '';

                filterModal.classList.remove('active');
            });
        }
    }

    initializeViews() {
        if (this.currentView === 'swipe') {
            document.getElementById('swipeView').style.display = 'block';
            document.getElementById('gridView').style.display = 'none';
            this.swipeView = new SwipeView();

            // Update view switcher UI
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.view === 'swipe');
            });
        } else {
            document.getElementById('swipeView').style.display = 'none';
            document.getElementById('gridView').style.display = 'block';
            this.gridView = new GridView();

            // Update view switcher UI
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.view === 'grid');
            });
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BrowseController();
});

// Export for global access
window.BrowseController = BrowseController;
window.GridView = GridView;
