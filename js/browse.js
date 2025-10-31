/**
 * browse.js - Production Browse Page
 * Complete class-based implementation with filtering, pagination, and API integration
 */

class BrowsePage {
    constructor() {
        this.celebrities = [];
        this.filteredData = [];
        this.categories = [];
        this.currentIndex = 0;
        this.currentView = 'swipe';
        this.currentPage = 1;
        this.perPage = 12;
        this.filters = {
            category: 'all',
            search: '',
            price: 'all',
            availability: 'all'
        };

        this.init();
    }

    async init() {
        await this.loadCategories();
        await this.loadCelebrities();
        this.setupEventListeners();
        this.render();
    }

    async loadCategories() {
        try {
            const api = new APIClient();
            const response = await api.getCategories();

            if (response.success && response.data) {
                this.categories = response.data;
                this.renderCategories();
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    renderCategories() {
        const container = document.getElementById('categoriesContainer');
        container.innerHTML = `
            <button class="cat-pill active" data-cat="all">All</button>
            ${this.categories.map(cat => `
                <button class="cat-pill" data-cat="${cat.slug || cat}">${cat.name || cat}</button>
            `).join('')}
        `;

        container.querySelectorAll('.cat-pill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                container.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filters.category = e.target.dataset.cat;
                this.applyFilters();
            });
        });
    }

    async loadCelebrities() {
        try {
            const api = new APIClient();
            const response = await api.getFeaturedCelebrities(500);

            if (response.success && response.data) {
                this.celebrities = response.data.celebrities || response.data.profiles || [];
                this.applyFilters();
            }
        } catch (error) {
            console.error('Error loading celebrities:', error);
            this.celebrities = [];
            this.applyFilters();
        }
    }

    applyFilters() {
        this.filteredData = this.celebrities.filter(c => {
            if (this.filters.category !== 'all' && c.category !== this.filters.category) return false;
            if (this.filters.search && !c.name.toLowerCase().includes(this.filters.search.toLowerCase())) return false;
            if (this.filters.price !== 'all') {
                const minPrice = c.min_price || 5000;
                const [min, max] = this.filters.price.split('-').map(p => p.replace('+', ''));
                if (max && (minPrice < parseInt(min) || minPrice > parseInt(max))) return false;
                if (!max && minPrice < parseInt(min)) return false;
            }
            if (this.filters.availability === 'available') {
                const available = c.availability_count || c.total_available || 0;
                if (available === 0) return false;
            }
            return true;
        });

        this.currentIndex = 0;
        this.currentPage = 1;
        this.render();
    }

    render() {
        document.getElementById('resultsCount').textContent = `Showing ${this.filteredData.length}`;

        if (this.currentView === 'swipe') {
            this.renderSwipe();
        } else {
            this.renderGrid();
        }
    }

    renderSwipe() {
        const card = document.getElementById('currentCard');

        if (this.filteredData.length === 0) {
            card.innerHTML = `
                <div class="loading-state">
                    <h3 style="color:#fff;font-size:20px;margin-bottom:12px;">No icons found</h3>
                    <p style="color:rgba(255,255,255,0.6);">Try adjusting your filters</p>
                </div>
            `;
            return;
        }

        if (this.currentIndex >= this.filteredData.length) {
            card.innerHTML = `
                <div class="loading-state">
                    <h3 style="color:#fff;font-size:20px;margin-bottom:12px;">You've seen all icons!</h3>
                    <p style="color:rgba(255,255,255,0.6);">Try adjusting your filters</p>
                </div>
            `;
            return;
        }

        const c = this.filteredData[this.currentIndex];
        const truncName = c.name.length > 25 ? c.name.substring(0, 25) + '...' : c.name;
        const imageUrl = c.picture_url || c.avatar_url || c.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=600&fit=crop&q=80';
        const minPrice = c.min_price || 5000;
        const rating = c.review_rate > 0 ? parseFloat(c.review_rate).toFixed(1) : c.rating || '4.8';
        const available = c.availability_count || c.total_available || 3;
        const location = c.location || 'Los Angeles';
        const category = c.category_name || c.category || 'Celebrity';

        card.innerHTML = `
            <div class="card-img">
                <img src="${imageUrl}" alt="${c.name}">
            </div>
            <div class="card-content">
                <div class="card-name-row">
                    <h3>${truncName}</h3>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#0095F6">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </div>
                <p class="card-cat">${category}</p>
                <div class="card-bottom">
                    <span class="card-tickets">🎫 ${available} left</span>
                    <span class="card-price">$${parseFloat(minPrice).toLocaleString()}+</span>
                </div>
                <div class="card-stats">
                    <span>⭐ ${rating}</span>
                    <span>•</span>
                    <span>📍 ${location}</span>
                </div>
            </div>
        `;
    }

    renderGrid() {
        const start = (this.currentPage - 1) * this.perPage;
        const end = start + this.perPage;
        const pageData = this.filteredData.slice(start, end);

        const container = document.getElementById('gridContainer');

        if (pageData.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: rgba(255,255,255,0.6);">
                    <h3 style="color:#fff;margin-bottom:12px;">No icons found</h3>
                    <p>Try adjusting your filters</p>
                </div>
            `;
            document.getElementById('pagination').style.display = 'none';
            return;
        }

        container.innerHTML = pageData.map(c => {
            const truncName = c.name.length > 20 ? c.name.substring(0, 20) + '...' : c.name;
            const imageUrl = c.picture_url || c.avatar_url || c.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=600&fit=crop&q=80';
            const minPrice = c.min_price || 5000;
            const available = c.availability_count || c.total_available || 3;
            const category = c.category_name || c.category || 'Celebrity';

            return `
                <a href="celebrity-profile.html?slug=${c.slug}" class="grid-card">
                    <div class="grid-card-img">
                        <img src="${imageUrl}" alt="${c.name}" loading="lazy">
                    </div>
                    <div class="grid-card-content">
                        <div class="grid-card-name-row">
                            <h4>${truncName}</h4>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#0095F6">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                        </div>
                        <p class="grid-card-cat">${category}</p>
                        <div class="grid-card-bottom">
                            <span class="grid-card-tickets">🎫 ${available}</span>
                            <span class="grid-card-price">$${parseFloat(minPrice).toLocaleString()}+</span>
                        </div>
                    </div>
                </a>
            `;
        }).join('');

        this.renderPagination();
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredData.length / this.perPage);
        const pagesEl = document.getElementById('pageNumbers');

        if (totalPages <= 1) {
            document.getElementById('pagination').style.display = 'none';
            return;
        }

        document.getElementById('pagination').style.display = 'flex';
        document.getElementById('prevBtn').disabled = this.currentPage === 1;
        document.getElementById('nextBtn').disabled = this.currentPage === totalPages;

        const pages = this.getPageNumbers(totalPages);
        pagesEl.innerHTML = pages.map(p => {
            if (p === '...') return '<span style="padding:0 8px;color:rgba(255,255,255,0.3);">...</span>';
            return `<button class="page-num ${p === this.currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
        }).join('');

        pagesEl.querySelectorAll('.page-num').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentPage = parseInt(e.target.dataset.page);
                this.renderGrid();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    getPageNumbers(total) {
        const pages = [];
        if (total <= 5) {
            for (let i = 1; i <= total; i++) pages.push(i);
        } else {
            if (this.currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(total);
            } else if (this.currentPage >= total - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = total - 3; i <= total; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(this.currentPage - 1);
                pages.push(this.currentPage);
                pages.push(this.currentPage + 1);
                pages.push('...');
                pages.push(total);
            }
        }
        return pages;
    }

    setupEventListeners() {
        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filters.search = e.target.value;
            setTimeout(() => this.applyFilters(), 300);
        });

        // View toggle
        document.querySelectorAll('.view-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-toggle').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.currentView = e.currentTarget.dataset.view;
                document.getElementById('swipeView').style.display = this.currentView === 'swipe' ? 'block' : 'none';
                document.getElementById('gridView').style.display = this.currentView === 'grid' ? 'block' : 'none';
                this.render();
            });
        });

        // Swipe controls
        document.getElementById('passBtn').addEventListener('click', () => {
            this.currentIndex++;
            this.renderSwipe();
        });

        document.getElementById('viewBtn').addEventListener('click', () => {
            const c = this.filteredData[this.currentIndex];
            if (c) window.location.href = `celebrity-profile.html?slug=${c.slug}`;
        });

        document.getElementById('backBtn').addEventListener('click', () => {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.renderSwipe();
            }
        });

        // Pagination
        document.getElementById('prevBtn').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderGrid();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredData.length / this.perPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderGrid();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        document.getElementById('perPageSelect').addEventListener('change', (e) => {
            this.perPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.renderGrid();
        });

        // Filter modal
        document.getElementById('filterBtn').addEventListener('click', () => {
            document.getElementById('filterModal').classList.add('active');
        });

        document.getElementById('closeModal').addEventListener('click', () => {
            document.getElementById('filterModal').classList.remove('active');
        });

        document.getElementById('modalOverlay').addEventListener('click', () => {
            document.getElementById('filterModal').classList.remove('active');
        });

        document.getElementById('applyFilters').addEventListener('click', () => {
            this.filters.price = document.getElementById('priceFilter').value;
            this.filters.availability = document.getElementById('availabilityFilter').value;
            this.applyFilters();
            document.getElementById('filterModal').classList.remove('active');
        });

        document.getElementById('clearFilters').addEventListener('click', () => {
            this.filters = { category: 'all', search: '', price: 'all', availability: 'all' };
            document.getElementById('priceFilter').value = 'all';
            document.getElementById('availabilityFilter').value = 'all';
            document.getElementById('searchInput').value = '';

            // Reset category pills
            const container = document.getElementById('categoriesContainer');
            container.querySelectorAll('.cat-pill').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.cat === 'all') btn.classList.add('active');
            });

            this.applyFilters();
            document.getElementById('filterModal').classList.remove('active');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BrowsePage();
});
