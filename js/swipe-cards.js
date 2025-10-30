/**
 * swipe-cards.js - Tinder-style swipe interaction
 * Premium browse experience for mobile users
 */

class SwipeCards {
    constructor() {
        this.currentIndex = 0;
        this.celebrities = [];
        this.swipeHistory = [];
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;

        this.init();
    }

    async init() {
        // Load celebrity data
        await this.loadCelebrities();

        // Render initial cards
        this.renderCards();

        // Set up event listeners
        this.setupEventListeners();

        // Hide instructions after 3 seconds
        setTimeout(() => {
            const instructions = document.getElementById('swipeInstructions');
            if (instructions) {
                instructions.style.opacity = '0';
                setTimeout(() => instructions.style.display = 'none', 300);
            }
        }, 3000);
    }

    async loadCelebrities() {
        try {
            const api = new APIClient();
            const response = await api.getFeaturedCelebrities(100);

            if (response.success && response.data) {
                // Handle both response formats
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

    renderCards() {
        const stack = document.getElementById('swipeStack');
        if (!stack) return;

        stack.innerHTML = '';

        // Render next 3 cards for stack effect
        for (let i = 0; i < 3 && (this.currentIndex + i) < this.celebrities.length; i++) {
            const celebrity = this.celebrities[this.currentIndex + i];
            const card = this.createCard(celebrity, i);
            stack.appendChild(card);
        }
    }

    createCard(celebrity, position) {
        const card = document.createElement('div');
        card.className = 'swipe-card';
        card.dataset.slug = celebrity.slug;
        card.dataset.position = position;

        const imageUrl = celebrity.picture_url || celebrity.avatar_url || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=600&fit=crop&q=80';
        const tier = celebrity.tier || 'A';
        const minPrice = celebrity.min_price || 5000;
        const rating = celebrity.review_rate > 0 ? parseFloat(celebrity.review_rate).toFixed(1) : '4.8';
        const slotsLeft = celebrity.availability_count || 3;

        card.innerHTML = `
            <div class="swipe-card-inner">
                <img src="${imageUrl}" alt="${celebrity.name}" class="swipe-card-image" />
                <div class="swipe-card-info">
                    ${celebrity.verified ? '<div class="verified-badge-swipe">✓</div>' : ''}
                    <h3 class="swipe-card-name">${celebrity.name}</h3>
                    <p class="swipe-card-category">${celebrity.category || 'Celebrity'}</p>
                    <div class="swipe-card-meta">
                        <span class="swipe-tier">Tier ${tier}</span>
                        <span class="swipe-price">$${parseFloat(minPrice).toLocaleString()}</span>
                    </div>
                    <div class="swipe-card-stats">
                        <span>⭐ ${rating}</span>
                        <span>•</span>
                        <span>${slotsLeft} slots left</span>
                    </div>
                </div>
                <div class="swipe-overlay swipe-overlay-left">
                    <span class="swipe-label">PASS</span>
                </div>
                <div class="swipe-overlay swipe-overlay-right">
                    <span class="swipe-label">VIEW</span>
                </div>
            </div>
        `;

        // Only add drag listeners to the top card
        if (position === 0) {
            this.addDragListeners(card);
        }

        return card;
    }

    addDragListeners(card) {
        // Mouse events
        card.addEventListener('mousedown', this.onDragStart.bind(this));
        document.addEventListener('mousemove', this.onDragMove.bind(this));
        document.addEventListener('mouseup', this.onDragEnd.bind(this));

        // Touch events
        card.addEventListener('touchstart', this.onDragStart.bind(this));
        document.addEventListener('touchmove', this.onDragMove.bind(this));
        document.addEventListener('touchend', this.onDragEnd.bind(this));
    }

    onDragStart(e) {
        const card = e.currentTarget;
        if (card.dataset.position !== '0') return;

        this.isDragging = true;
        card.style.transition = 'none';

        if (e.type === 'mousedown') {
            this.startX = e.clientX;
            this.startY = e.clientY;
        } else {
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
        }
    }

    onDragMove(e) {
        if (!this.isDragging) return;

        if (e.type === 'mousemove') {
            this.currentX = e.clientX;
            this.currentY = e.clientY;
        } else {
            this.currentX = e.touches[0].clientX;
            this.currentY = e.touches[0].clientY;
        }

        const deltaX = this.currentX - this.startX;
        const deltaY = this.currentY - this.startY;

        const card = document.querySelector('.swipe-card[data-position="0"]');
        if (!card) return;

        // Apply transform
        const rotation = deltaX * 0.05; // Subtle rotation
        card.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;

        // Show appropriate overlay
        if (Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                card.classList.add('swiping-right');
                card.classList.remove('swiping-left');
            } else {
                card.classList.add('swiping-left');
                card.classList.remove('swiping-right');
            }
        } else {
            card.classList.remove('swiping-left', 'swiping-right');
        }
    }

    onDragEnd(e) {
        if (!this.isDragging) return;

        this.isDragging = false;

        const card = document.querySelector('.swipe-card[data-position="0"]');
        if (!card) return;

        const deltaX = this.currentX - this.startX;
        const threshold = 100; // Swipe threshold

        card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

        if (Math.abs(deltaX) > threshold) {
            // Swipe complete
            if (deltaX > 0) {
                this.swipeRight(card);
            } else {
                this.swipeLeft(card);
            }
        } else {
            // Return to center
            card.style.transform = '';
            card.classList.remove('swiping-left', 'swiping-right');
        }
    }

    swipeLeft(card) {
        // PASS - Move to next
        const celebrity = this.celebrities[this.currentIndex];

        // Animate out
        card.style.transform = 'translateX(-150%) rotate(-30deg)';
        card.style.opacity = '0';

        // Add to history
        this.swipeHistory.push({
            index: this.currentIndex,
            action: 'pass',
            celebrity: celebrity
        });

        setTimeout(() => {
            this.currentIndex++;
            this.renderCards();
            this.checkIfEmpty();
        }, 300);
    }

    swipeRight(card) {
        // VIEW - Navigate to profile
        const celebrity = this.celebrities[this.currentIndex];

        // Animate out
        card.style.transform = 'translateX(150%) rotate(30deg)';
        card.style.opacity = '0';

        // Add to history
        this.swipeHistory.push({
            index: this.currentIndex,
            action: 'view',
            celebrity: celebrity
        });

        // Navigate to profile after animation
        setTimeout(() => {
            window.location.href = `celebrity-profile.html?slug=${celebrity.slug}`;
        }, 300);
    }

    swipeBack() {
        // Go back to previous card
        if (this.swipeHistory.length === 0) {
            console.log('No cards to go back to');
            return;
        }

        const lastSwipe = this.swipeHistory.pop();
        this.currentIndex = lastSwipe.index;
        this.renderCards();
    }

    setupEventListeners() {
        // Button controls
        const passBtn = document.getElementById('swipePassBtn');
        const backBtn = document.getElementById('swipeBackBtn');
        const viewBtn = document.getElementById('swipeViewBtn');

        if (passBtn) {
            passBtn.addEventListener('click', () => {
                const card = document.querySelector('.swipe-card[data-position="0"]');
                if (card) this.swipeLeft(card);
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.swipeBack();
            });
        }

        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                const card = document.querySelector('.swipe-card[data-position="0"]');
                if (card) this.swipeRight(card);
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('swipeView').style.display === 'none') return;

            const card = document.querySelector('.swipe-card[data-position="0"]');
            if (!card) return;

            switch(e.key) {
                case 'ArrowLeft':
                    this.swipeLeft(card);
                    break;
                case 'ArrowRight':
                    this.swipeRight(card);
                    break;
                case 'ArrowDown':
                    this.swipeBack();
                    break;
            }
        });
    }

    checkIfEmpty() {
        if (this.currentIndex >= this.celebrities.length) {
            // All cards swiped
            const stack = document.getElementById('swipeStack');
            if (stack) {
                stack.innerHTML = `
                    <div style="text-align: center; padding: 80px 20px;">
                        <h3 style="color: #FFFFFF; font-size: 24px; margin-bottom: 16px;">
                            You've seen all icons!
                        </h3>
                        <p style="color: rgba(255,255,255,0.6); margin-bottom: 30px;">
                            Adjust your filters to see more celebrities
                        </p>
                        <a href="browse-swipe.html" class="btn-primary-large" style="text-decoration: none; display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #D4A574, #E5B685); color: #000; border-radius: 10px; font-weight: 600;">
                            Reset & Browse
                        </a>
                    </div>
                `;
            }
        }
    }
}

// Initialize swipe cards when view is active
let swipeInstance = null;

function initSwipeView() {
    if (swipeInstance === null) {
        swipeInstance = new SwipeCards();
    }
}

// Export for use in browse.js
window.SwipeCards = SwipeCards;
window.initSwipeView = initSwipeView;
