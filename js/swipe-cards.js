/**
 * swipe-cards.js - Single-card swipe interaction (FIXED)
 * Prevents horizontal scroll and smooth swipe experience
 */

class SwipeView {
    constructor() {
        this.currentIndex = 0;
        this.celebrities = [];
        this.swipeHistory = [];
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.offsetX = 0;

        this.init();
    }

    async init() {
        await this.loadCelebrities();
        this.renderCard();
        this.setupListeners();

        // Hide guide after 3 seconds
        setTimeout(() => {
            const guide = document.getElementById('swipeGuide');
            if (guide) {
                guide.style.opacity = '0';
                setTimeout(() => guide.style.display = 'none', 300);
            }
        }, 3000);
    }

    async loadCelebrities() {
        try {
            const api = new APIClient();
            const response = await api.getFeaturedCelebrities(100);

            if (response.success && response.data) {
                const celebrityData = response.data.celebrities || response.data.profiles || [];
                this.celebrities = celebrityData;
                console.log('✅ Loaded', this.celebrities.length, 'celebrities for swipe');
            } else {
                throw new Error('Invalid API response');
            }
        } catch (error) {
            console.error('❌ Error loading celebrities:', error);
            this.celebrities = [];
        }
    }

    renderCard() {
        const stack = document.getElementById('swipeStack');
        if (!stack) return;

        if (this.currentIndex >= this.celebrities.length) {
            this.showEndMessage();
            return;
        }

        const celeb = this.celebrities[this.currentIndex];
        const card = this.createCard(celeb);

        // Clear and add only ONE card
        stack.innerHTML = '';
        stack.appendChild(card);

        this.attachCardListeners(card);
    }

    createCard(celeb) {
        const card = document.createElement('div');
        card.className = 'swipe-card';
        card.dataset.slug = celeb.slug;

        // Truncate name if needed
        const displayName = celeb.name.length > 20 ?
            celeb.name.substring(0, 20) + '...' : celeb.name;

        const imageUrl = celeb.picture_url || celeb.avatar_url || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=600&fit=crop&q=80';
        const tier = celeb.tier || 'A';
        const minPrice = celeb.min_price || 5000;
        const rating = celeb.review_rate > 0 ? parseFloat(celeb.review_rate).toFixed(1) : '4.8';
        const availability = celeb.availability_count || 3;

        card.innerHTML = `
            <div class="card-image">
                <img src="${imageUrl}" alt="${celeb.name}" />
                <div class="verified-badge-ig">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0095F6">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </div>
            </div>
            <div class="card-info">
                <div class="card-header">
                    <h3 class="card-name">${displayName}</h3>
                    <svg class="verified-inline" width="16" height="16" viewBox="0 0 24 24" fill="#0095F6">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </div>
                <p class="card-category">${celeb.category || 'Celebrity'}</p>
                <div class="card-meta">
                    <span class="card-tier">TIER ${tier}</span>
                    <span class="card-price">$${parseFloat(minPrice).toLocaleString()}+</span>
                </div>
                <div class="card-stats">
                    <span class="stat-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#D4A574">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        ${rating}
                    </span>
                    <span class="stat-divider">•</span>
                    <span class="stat-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        ${availability}
                    </span>
                </div>
            </div>
        `;

        return card;
    }

    attachCardListeners(card) {
        // Touch events
        card.addEventListener('touchstart', this.onStart.bind(this), { passive: true });
        document.addEventListener('touchmove', this.onMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.onEnd.bind(this));

        // Mouse events
        card.addEventListener('mousedown', this.onStart.bind(this));
        document.addEventListener('mousemove', this.onMove.bind(this));
        document.addEventListener('mouseup', this.onEnd.bind(this));
    }

    onStart(e) {
        this.isDragging = true;
        this.startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        this.startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        this.offsetX = 0;

        const card = document.querySelector('.swipe-card');
        if (card) {
            card.style.transition = 'none';
        }
    }

    onMove(e) {
        if (!this.isDragging) return;

        // Prevent page scroll during horizontal swipe
        if (e.type === 'touchmove') {
            const touch = e.touches[0];
            const deltaX = Math.abs(touch.clientX - this.startX);
            if (deltaX > 10) {
                e.preventDefault();
            }
        }

        this.currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        this.offsetX = this.currentX - this.startX;

        const card = document.querySelector('.swipe-card');
        if (!card) return;

        // Clamp to prevent overflow
        const maxOffset = 150;
        const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, this.offsetX));
        const rotation = clampedOffset * 0.1;

        // ONLY transform card, nothing else
        card.style.transform = `translateX(${clampedOffset}px) rotate(${rotation}deg)`;
        card.style.transition = 'none';
    }

    onEnd() {
        if (!this.isDragging) return;

        this.isDragging = false;
        const card = document.querySelector('.swipe-card');
        if (!card) return;

        const threshold = 80;

        card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

        if (Math.abs(this.offsetX) > threshold) {
            // Complete swipe
            const direction = this.offsetX > 0 ? 1 : -1;
            card.style.transform = `translateX(${direction * 400}px) rotate(${direction * 20}deg)`;
            card.style.opacity = '0';

            setTimeout(() => {
                if (direction > 0) {
                    this.swipeRight(card);
                } else {
                    this.swipeLeft(card);
                }
            }, 300);
        } else {
            // Return to center
            card.style.transform = '';
        }

        this.offsetX = 0;
    }

    swipeLeft(card) {
        // PASS - Move to next
        const celebrity = this.celebrities[this.currentIndex];

        // Add to history
        this.swipeHistory.push({
            index: this.currentIndex,
            action: 'pass',
            celebrity: celebrity
        });

        this.currentIndex++;
        this.renderCard();
    }

    swipeRight(card) {
        // VIEW - Navigate to profile
        const celebrity = this.celebrities[this.currentIndex];

        // Add to history
        this.swipeHistory.push({
            index: this.currentIndex,
            action: 'view',
            celebrity: celebrity
        });

        window.location.href = `celebrity-profile.html?slug=${celebrity.slug}`;
    }

    swipeBack() {
        if (this.swipeHistory.length === 0) {
            console.log('No cards to go back to');
            return;
        }

        const lastSwipe = this.swipeHistory.pop();
        this.currentIndex = lastSwipe.index;
        this.renderCard();
    }

    setupListeners() {
        // Button controls
        const passBtn = document.getElementById('swipePassBtn');
        const backBtn = document.getElementById('swipeBackBtn');
        const viewBtn = document.getElementById('swipeViewBtn');

        if (passBtn) {
            passBtn.addEventListener('click', () => {
                const card = document.querySelector('.swipe-card');
                if (card) {
                    card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                    card.style.transform = 'translateX(-400px) rotate(-20deg)';
                    card.style.opacity = '0';
                    setTimeout(() => this.swipeLeft(card), 300);
                }
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.swipeBack();
            });
        }

        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                const card = document.querySelector('.swipe-card');
                if (card) {
                    card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                    card.style.transform = 'translateX(400px) rotate(20deg)';
                    card.style.opacity = '0';
                    setTimeout(() => this.swipeRight(card), 300);
                }
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('swipeView').style.display === 'none') return;

            const card = document.querySelector('.swipe-card');
            if (!card) return;

            switch (e.key) {
                case 'ArrowLeft':
                    card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                    card.style.transform = 'translateX(-400px) rotate(-20deg)';
                    card.style.opacity = '0';
                    setTimeout(() => this.swipeLeft(card), 300);
                    break;
                case 'ArrowRight':
                    card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                    card.style.transform = 'translateX(400px) rotate(20deg)';
                    card.style.opacity = '0';
                    setTimeout(() => this.swipeRight(card), 300);
                    break;
                case 'ArrowDown':
                    this.swipeBack();
                    break;
            }
        });
    }

    showEndMessage() {
        const stack = document.getElementById('swipeStack');
        if (stack) {
            stack.innerHTML = `
                <div style="text-align: center; padding: 60px 20px;">
                    <h3 style="color: #FFFFFF; font-size: 24px; margin-bottom: 16px;">
                        You've seen all icons!
                    </h3>
                    <p style="color: rgba(255,255,255,0.6); margin-bottom: 24px;">
                        Adjust your filters to see more
                    </p>
                    <button onclick="location.reload()" style="padding: 12px 32px; background: #D4A574; border: none; border-radius: 10px; color: #000; font-weight: 600; cursor: pointer;">
                        Reload
                    </button>
                </div>
            `;
        }
    }
}

// Export for use in browse.js
window.SwipeView = SwipeView;
