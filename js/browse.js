/**
 * browse.js - Simple browse page logic
 * Clean version with basic card rendering
 */

let celebrities = [];
let currentIndex = 0;
let currentView = 'swipe';

async function init() {
    await loadData();
    renderCard();
    setupListeners();
}

async function loadData() {
    try {
        const api = new APIClient();
        const response = await api.getFeaturedCelebrities(100);

        if (response.success && response.data) {
            celebrities = response.data.celebrities || response.data.profiles || [];
            console.log('✅ Loaded', celebrities.length, 'celebrities');

            // Update count
            document.getElementById('count').textContent = `Showing ${celebrities.length}`;
        } else {
            throw new Error('Invalid API response');
        }
    } catch (error) {
        console.error('❌ Error loading celebrities:', error);
        celebrities = [];
        document.getElementById('count').textContent = 'No results';
    }
}

function renderCard() {
    if (currentIndex >= celebrities.length) {
        document.getElementById('currentCard').innerHTML = `
            <div style="text-align:center;color:#fff;padding:60px 20px;">
                <h3 style="font-size:24px;margin-bottom:16px;">No more celebrities!</h3>
                <p style="color:rgba(255,255,255,0.6);margin-bottom:20px;">You've seen all available icons</p>
                <button onclick="location.reload()" style="padding:12px 32px;background:#D4A574;border:none;border-radius:10px;color:#000;font-weight:600;cursor:pointer;">Reload</button>
            </div>
        `;
        return;
    }

    const c = celebrities[currentIndex];
    const imageUrl = c.picture_url || c.avatar_url || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=600&fit=crop&q=80';
    const tier = c.tier || 'A';
    const minPrice = c.min_price || 5000;
    const rating = c.review_rate > 0 ? parseFloat(c.review_rate).toFixed(1) : '4.8';
    const availability = c.availability_count || 3;

    document.getElementById('currentCard').innerHTML = `
        <div class="card-img">
            <img src="${imageUrl}" alt="${c.name}">
        </div>
        <div class="card-content">
            <div class="card-name-row">
                <h3>${c.name}</h3>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#0095F6">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
            </div>
            <p class="card-cat">${c.category || 'Celebrity'}</p>
            <div class="card-meta">
                <span class="tier">TIER ${tier}</span>
                <span class="price">$${parseFloat(minPrice).toLocaleString()}+</span>
            </div>
            <div class="card-stats">
                <span>⭐ ${rating}</span>
                <span>•</span>
                <span>${availability} slots</span>
            </div>
        </div>
    `;
}

function renderGrid() {
    const container = document.getElementById('gridContainer');
    if (!container) return;

    container.innerHTML = celebrities.map(c => {
        const imageUrl = c.picture_url || c.avatar_url || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=600&fit=crop&q=80';
        const tier = c.tier || 'A';
        const minPrice = c.min_price || 5000;
        const rating = c.review_rate > 0 ? parseFloat(c.review_rate).toFixed(1) : '4.8';
        const availability = c.availability_count || 3;

        return `
            <a href="celebrity-profile.html?slug=${c.slug}" class="grid-card">
                <div class="grid-card-image">
                    <img src="${imageUrl}" alt="${c.name}" loading="lazy" />
                </div>
                <div class="grid-card-info">
                    <div class="grid-card-name-row">
                        <h3>${c.name}</h3>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#0095F6">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <p class="grid-card-cat">${c.category || 'Celebrity'}</p>
                    <div class="grid-card-meta">
                        <span class="tier">TIER ${tier}</span>
                        <span class="price">$${parseFloat(minPrice).toLocaleString()}+</span>
                    </div>
                    <div class="grid-card-stats">
                        <span>⭐ ${rating}</span>
                        <span>•</span>
                        <span>${availability} slots</span>
                    </div>
                </div>
            </a>
        `;
    }).join('');
}

function setupListeners() {
    // Pass button
    const passBtn = document.getElementById('passBtn');
    if (passBtn) {
        passBtn.onclick = () => {
            currentIndex++;
            renderCard();
        };
    }

    // View button
    const viewBtn = document.getElementById('viewBtn');
    if (viewBtn) {
        viewBtn.onclick = () => {
            if (currentIndex < celebrities.length) {
                const c = celebrities[currentIndex];
                window.location.href = `celebrity-profile.html?slug=${c.slug}`;
            }
        };
    }

    // Back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.onclick = () => {
            if (currentIndex > 0) {
                currentIndex--;
                renderCard();
            }
        };
    }

    // View switcher
    const viewBtns = document.querySelectorAll('[data-view]');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.currentTarget.dataset.view;
            switchView(view);

            // Update active state
            viewBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });

    // Category filters
    const catBtns = document.querySelectorAll('[data-cat]');
    catBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active state
            catBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Filter logic (simplified - just reload for now)
            const category = e.target.dataset.cat;
            console.log('Filter by category:', category);
            // TODO: Implement filtering
        });
    });

    // Search
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            console.log('Search:', query);
            // TODO: Implement search
        });
    }

    // Sort
    const sortBtn = document.getElementById('sortBtn');
    if (sortBtn) {
        sortBtn.addEventListener('click', () => {
            console.log('Sort clicked');
            // TODO: Implement sorting
        });
    }
}

function switchView(view) {
    currentView = view;

    const swipeView = document.getElementById('swipeView');
    const gridView = document.getElementById('gridView');

    if (view === 'grid') {
        swipeView.style.display = 'none';
        gridView.style.display = 'block';
        renderGrid();
    } else {
        swipeView.style.display = 'block';
        gridView.style.display = 'none';
        renderCard();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
