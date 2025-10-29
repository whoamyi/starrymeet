/**
 * Celebrity Profile - Interactive Availability System
 * Implements UX design spec with collapsible panels and city/date/time selection
 */

// State management
const state = {
    celebrity: null,
    availability: {
        physical: [],
        virtual: []
    },
    selection: {
        physical: { city: null, date: null, slot: null },
        virtual: { city: null, date: null, slot: null }
    }
};

// Color palettes for celebrity initials (same as browse page)
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

/**
 * Get initials from name
 */
function getInitials(name) {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

/**
 * Get color for celebrity based on name
 */
function getColorForCelebrity(name) {
    if (!name) return colorPalettes[0];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colorPalettes[index % colorPalettes.length];
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadCelebrityProfile();
    setupPanelToggles();
});

/**
 * Load celebrity profile data
 */
async function loadCelebrityProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    console.log('🔍 Loading celebrity profile for slug:', slug);

    if (!slug) {
        console.error('❌ No slug provided in URL');
        showError('No celebrity specified. Redirecting to browse page...');
        setTimeout(() => {
            window.location.href = 'browse.html';
        }, 2000);
        return;
    }

    try {
        console.log('📡 Fetching celebrity profile from API...');

        // Check if API is available
        if (!window.api || !window.api.getCelebrityProfile) {
            throw new Error('API not initialized');
        }

        // Load celebrity profile by slug using new API
        const response = await window.api.getCelebrityProfile(slug);

        console.log('📥 API Response:', response);

        if (!response.success || !response.data || !response.data.profile) {
            throw new Error(response.error || 'Celebrity not found');
        }

        state.celebrity = response.data.profile;

        console.log('✅ Celebrity loaded:', state.celebrity.name);

        // Store availability from API response
        if (state.celebrity.availability) {
            state.availability.physical = state.celebrity.availability.physical || [];
            state.availability.virtual = state.celebrity.availability.virtual || [];
            console.log('📅 Availability loaded:', {
                physical: state.availability.physical.length,
                virtual: state.availability.virtual.length
            });
        }

        // Populate static section
        console.log('🎨 Populating profile section...');
        populateStaticSection(state.celebrity);

        // Populate pricing packages
        console.log('💰 Populating pricing packages...');
        populatePricingPackages(state.celebrity);

        // Render availability section
        if (window.renderAvailabilitySection && state.celebrity.availability) {
            console.log('📅 Rendering availability section...');
            const allAvailability = [
                ...(state.celebrity.availability.physical || []),
                ...(state.celebrity.availability.virtual || [])
            ];
            window.renderAvailabilitySection(allAvailability);
        }

        console.log('✅ Profile fully loaded!');

    } catch (error) {
        console.error('❌ Error loading profile:', error);
        showError(`Failed to load celebrity profile: ${error.message}`);
    }
}

/**
 * Populate static profile section
 */
function populateStaticSection(celebrity) {
    // Profile image / initials
    const profileImage = document.getElementById('profile-image');
    const profileInitials = document.getElementById('profile-initials');
    const avatarContainer = document.getElementById('profile-avatar-container');

    if (profileImage && profileInitials && avatarContainer) {
        if (celebrity.picture_url || celebrity.avatar_url) {
            // Has image - show img tag
            profileImage.src = celebrity.picture_url || celebrity.avatar_url;
            profileImage.alt = celebrity.name;
            profileImage.style.display = 'block';
            profileInitials.style.display = 'none';
        } else {
            // No image - show initials with colored background
            profileImage.style.display = 'none';
            const initials = getInitials(celebrity.name);
            const color = getColorForCelebrity(celebrity.name);

            avatarContainer.style.background = color;
            profileInitials.textContent = initials;
            profileInitials.style.display = 'flex';
        }
    }

    // Name
    const nameEl = document.getElementById('celebrity-name');
    if (nameEl) {
        nameEl.textContent = celebrity.name;
    }

    // Verified badge
    const verifiedBadge = document.getElementById('verified-badge');
    if (verifiedBadge && celebrity.verified) {
        verifiedBadge.style.display = 'inline-block';
    }

    // Location
    const locationEl = document.getElementById('location');
    if (locationEl) {
        locationEl.textContent = celebrity.country || 'Location not specified';
    }

    // Category
    const categoryEl = document.getElementById('category');
    if (categoryEl) {
        categoryEl.textContent = celebrity.category || 'Celebrity';
    }

    // Bio with expandable toggle
    const bioEl = document.getElementById('bio');
    const bioToggle = document.querySelector('.profile-bio-toggle-ig');
    if (bioEl) {
        const bioText = celebrity.bio || `Book an exclusive meeting with ${celebrity.name}. Choose between in-person and virtual options at select locations worldwide.`;
        bioEl.textContent = bioText;

        // Show "more" button only if bio is longer than 2 lines (approx 100 chars)
        if (bioText.length > 100 && bioToggle) {
            bioToggle.style.display = 'inline-block';
        }
    }

    // Stats - Instagram style
    const ratingEl = document.getElementById('rating-value');
    if (ratingEl) {
        const rating = celebrity.review_rate > 0
            ? parseFloat(celebrity.review_rate).toFixed(1)
            : 'New';
        ratingEl.textContent = rating;
    }

    const reviewsEl = document.getElementById('reviews-value');
    if (reviewsEl) {
        reviewsEl.textContent = celebrity.review_count || 0;
    }

    const bookingsEl = document.getElementById('bookings-value');
    if (bookingsEl) {
        bookingsEl.textContent = celebrity.bookings_count || 0;
    }

    // Tier badge
    const tierBadge = document.getElementById('tier-badge');
    if (tierBadge && celebrity.tier) {
        tierBadge.textContent = `Tier ${celebrity.tier}`;
        tierBadge.className = 'profile-tier-badge';
        tierBadge.style.display = 'block';
    }

    // Initialize Instagram-style interactions
    initializeInstagramFeatures();
}

/**
 * Populate pricing packages
 */
function populatePricingPackages(celebrity) {
    const virtualPricingContainer = document.getElementById('virtual-pricing');
    const physicalPricingContainer = document.getElementById('physical-pricing');

    if (!celebrity.pricing) {
        console.warn('⚠️ No pricing data available');
        return;
    }

    // Populate Virtual Pricing
    if (virtualPricingContainer) {
        if (celebrity.pricing.virtual && celebrity.pricing.virtual.length > 0) {
            virtualPricingContainer.innerHTML = celebrity.pricing.virtual.map(pkg => `
                <div class="pricing-package" onclick="proceedToBooking('virtual', ${pkg.duration}, ${pkg.price})">
                    <div class="pricing-package-header">
                        <div class="pricing-duration">${pkg.duration} minutes</div>
                        <div class="pricing-price">$${pkg.price.toLocaleString()}</div>
                    </div>
                    <div class="pricing-description">
                        Video call session with ${celebrity.name.split(' ')[0]}
                    </div>
                </div>
            `).join('');
        } else {
            virtualPricingContainer.innerHTML = '<div class="pricing-empty">No virtual packages available</div>';
        }
    }

    // Populate Physical Pricing
    if (physicalPricingContainer) {
        if (celebrity.pricing.physical && celebrity.pricing.physical.length > 0) {
            physicalPricingContainer.innerHTML = celebrity.pricing.physical.map(pkg => `
                <div class="pricing-package" onclick="proceedToBooking('physical', ${pkg.duration}, ${pkg.price})">
                    <div class="pricing-package-header">
                        <div class="pricing-duration">${pkg.duration} minutes</div>
                        <div class="pricing-price">$${pkg.price.toLocaleString()}</div>
                    </div>
                    <div class="pricing-description">
                        In-person meet & greet with ${celebrity.name.split(' ')[0]}
                    </div>
                </div>
            `).join('');
        } else {
            physicalPricingContainer.innerHTML = '<div class="pricing-empty">No physical packages available</div>';
        }
    }
}

/**
 * Proceed directly to booking with selected package
 */
function proceedToBooking(meetingType, duration, price) {
    if (!state.celebrity) return;

    // Store booking data in sessionStorage
    sessionStorage.setItem('bookingData', JSON.stringify({
        celebrity_id: state.celebrity.id,
        celebrity_name: state.celebrity.name,
        celebrity_slug: state.celebrity.slug,
        meeting_type: meetingType,
        duration: duration,
        price_cents: price * 100, // Convert to cents
        price: price
    }));

    console.log('📦 Booking data stored:', {
        celebrity: state.celebrity.name,
        type: meetingType,
        duration: duration,
        price: price
    });

    // Redirect to booking page
    window.location.href = 'booking.html';
}

// Make function global for onclick handlers
window.proceedToBooking = proceedToBooking;

/**
 * Render availability panel for meeting type
 */
function renderAvailability(meetingType) {
    const content = document.getElementById(`${meetingType}-content`);

    if (!content) {
        console.warn(`Content element not found for ${meetingType}`);
        return;
    }

    const slots = state.availability[meetingType] || [];

    if (slots.length === 0) {
        renderEmptyState(content, meetingType);
        return;
    }

    // Group by cities
    const citiesData = groupByCities(slots);

    // Render cities grid
    renderCitiesGrid(meetingType, citiesData);
}

/**
 * Group availability slots by city
 */
function groupByCities(slots) {
    const cities = {};

    slots.forEach(slot => {
        const key = `${slot.city}, ${slot.country}`;
        if (!cities[key]) {
            cities[key] = {
                city: slot.city,
                country: slot.country,
                timezone: slot.timezone,
                slots: []
            };
        }
        cities[key].slots.push(slot);
    });

    return Object.values(cities);
}

/**
 * Render cities grid
 */
function renderCitiesGrid(meetingType, citiesData) {
    const content = document.getElementById(`${meetingType}-content`);

    if (citiesData.length === 0) {
        renderEmptyState(content, meetingType);
        return;
    }

    content.innerHTML = `
        <div class="cities-grid" id="${meetingType}-cities">
            ${citiesData.map(cityData => renderCityCard(meetingType, cityData)).join('')}
        </div>
        <div class="dates-section" id="${meetingType}-dates"></div>
        <div class="booking-action" id="${meetingType}-booking"></div>
    `;

    // Setup city click handlers
    citiesData.forEach(cityData => {
        const cityKey = `${cityData.city}, ${cityData.country}`;
        const card = content.querySelector(`[data-city="${cityKey}"]`);
        if (card) {
            card.addEventListener('click', () => selectCity(meetingType, cityData));
        }
    });
}

/**
 * Render city card
 */
function renderCityCard(meetingType, cityData) {
    const cityKey = `${cityData.city}, ${cityData.country}`;
    const slotsCount = cityData.slots.length;

    // Determine scarcity level
    let scarcityClass = 'slots-plenty';
    let scarcityText = `${slotsCount} slots`;

    if (slotsCount <= 2) {
        scarcityClass = 'slots-last';
        scarcityText = `Only ${slotsCount} left!`;
    } else if (slotsCount <= 5) {
        scarcityClass = 'slots-few';
        scarcityText = `${slotsCount} slots`;
    }

    return `
        <div class="city-card" data-city="${cityKey}">
            <div class="city-name">${cityData.city}</div>
            <div class="city-country">${cityData.country}</div>
            <div class="slots-indicator ${scarcityClass}">
                <span class="slots-dot"></span>
                <span>${scarcityText}</span>
            </div>
        </div>
    `;
}

/**
 * Select a city
 */
function selectCity(meetingType, cityData) {
    state.selection[meetingType].city = cityData;
    state.selection[meetingType].date = null;
    state.selection[meetingType].slot = null;

    // Update UI
    const citiesGrid = document.getElementById(`${meetingType}-cities`);
    const datesSection = document.getElementById(`${meetingType}-dates`);

    // Hide cities, show dates
    citiesGrid.style.display = 'none';
    datesSection.classList.add('visible');

    // Render dates
    renderDateSlots(meetingType, cityData);
}

/**
 * Render date slots
 */
function renderDateSlots(meetingType, cityData) {
    const datesSection = document.getElementById(`${meetingType}-dates`);
    const cityKey = `${cityData.city}, ${cityData.country}`;

    // Group slots by date
    const slotsByDate = {};
    cityData.slots.forEach(slot => {
        if (!slotsByDate[slot.date]) {
            slotsByDate[slot.date] = [];
        }
        slotsByDate[slot.date].push(slot);
    });

    const dates = Object.keys(slotsByDate).sort();

    datesSection.innerHTML = `
        <div class="dates-header">
            <div class="selected-city-label">📍 ${cityKey}</div>
            <button class="back-btn" onclick="backToCities('${meetingType}')">← Back to Cities</button>
        </div>
        <div class="date-slots">
            ${dates.map(date => renderDateSlotCard(meetingType, date, slotsByDate[date])).join('')}
        </div>
    `;
}

/**
 * Render date slot card
 */
function renderDateSlotCard(meetingType, date, slots) {
    const formattedDate = formatDate(date);

    return `
        <div class="date-slot-card">
            <div class="date-slot-header">
                <div class="date-label">${formattedDate}</div>
            </div>
            <div class="time-slots">
                ${slots.map(slot => renderTimeSlot(meetingType, slot)).join('')}
            </div>
        </div>
    `;
}

/**
 * Render individual time slot
 */
function renderTimeSlot(meetingType, slot) {
    const time = formatTime(slot.time);
    const price = formatPrice(slot.price_cents);
    const slotId = `${slot.id}`;

    return `
        <div class="time-slot" data-slot-id="${slotId}" onclick="selectSlot('${meetingType}', ${slot.id})">
            <div class="time-label">${time}</div>
            <div class="duration-label">${slot.duration} minutes</div>
            <div class="price-label">${price}</div>
        </div>
    `;
}

/**
 * Select a time slot
 */
function selectSlot(meetingType, slotId) {
    const slot = state.availability[meetingType].find(s => s.id === slotId);
    if (!slot) return;

    state.selection[meetingType].slot = slot;

    // Update UI - highlight selected slot
    const panel = document.getElementById(`${meetingType}-content`);
    panel.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
    panel.querySelector(`[data-slot-id="${slotId}"]`)?.classList.add('selected');

    // Show booking button
    renderBookingButton(meetingType, slot);
}

/**
 * Render booking button
 */
function renderBookingButton(meetingType, slot) {
    const bookingSection = document.getElementById(`${meetingType}-booking`);
    bookingSection.classList.add('visible');

    const time = formatTime(slot.time);
    const date = formatDate(slot.date);
    const price = formatPrice(slot.price_cents);

    bookingSection.innerHTML = `
        <button class="book-btn" onclick="proceedToBooking('${meetingType}')">
            Book ${slot.duration}min - ${date} at ${time} · ${price}
        </button>
    `;
}

/**
 * Back to cities view
 */
function backToCities(meetingType) {
    const citiesGrid = document.getElementById(`${meetingType}-cities`);
    const datesSection = document.getElementById(`${meetingType}-dates`);
    const bookingSection = document.getElementById(`${meetingType}-booking`);

    citiesGrid.style.display = 'grid';
    datesSection.classList.remove('visible');
    bookingSection.classList.remove('visible');

    state.selection[meetingType].city = null;
    state.selection[meetingType].date = null;
    state.selection[meetingType].slot = null;
}

/**
 * Proceed to booking
 */
function proceedToBooking(meetingType) {
    const selection = state.selection[meetingType];
    if (!selection.slot) return;

    // Store booking data in sessionStorage
    sessionStorage.setItem('bookingData', JSON.stringify({
        celebrity_id: state.celebrity.id,
        celebrity_name: state.celebrity.name,
        meeting_type: meetingType,
        slot_id: selection.slot.id,
        city: selection.slot.city,
        country: selection.slot.country,
        date: selection.slot.date,
        time: selection.slot.time,
        duration: selection.slot.duration,
        price: selection.slot.price_cents
    }));

    // Redirect to booking page
    window.location.href = 'booking.html';
}

/**
 * Render empty state
 */
function renderEmptyState(content, meetingType) {
    const icon = meetingType === 'physical' ? '📍' : '🌐';
    const message = meetingType === 'physical'
        ? 'No physical meetings available at this time. Check back soon!'
        : 'No virtual meetings available at this time. Check back soon!';

    content.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">${icon}</div>
            <div class="empty-state-text">${message}</div>
        </div>
    `;
}

/**
 * Setup panel toggle handlers
 */
function setupPanelToggles() {
    document.querySelectorAll('.panel-header').forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('expanded');
            const content = this.nextElementSibling;
            content.classList.toggle('expanded');
        });
    });
}

/**
 * Utility functions
 */
function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function formatPrice(cents) {
    return `$${(cents / 100).toLocaleString()}`;
}

function showError(message) {
    alert(message);
}

/**
 * Initialize Instagram-style interactive features
 */
function initializeInstagramFeatures() {
    // Bio expand/collapse
    const bioToggle = document.querySelector('.profile-bio-toggle-ig');
    if (bioToggle) {
        bioToggle.addEventListener('click', function() {
            const bio = document.querySelector('.profile-bio-ig');
            const isExpanded = bio.dataset.expanded === 'true';
            const toggleText = this.querySelector('.toggle-text');

            bio.dataset.expanded = !isExpanded;
            this.setAttribute('aria-expanded', !isExpanded);
            toggleText.textContent = isExpanded ? 'more' : 'less';
        });
    }

    // Follow button toggle
    const followBtn = document.querySelector('.btn-action-ig--follow');
    if (followBtn) {
        followBtn.addEventListener('click', function() {
            // Require authentication
            if (!requireAuth()) {
                return;
            }

            const isFollowing = this.dataset.following === 'true';
            const btnText = this.querySelector('.btn-action-ig__text');

            if (isFollowing) {
                this.dataset.following = 'false';
                btnText.textContent = 'Follow';
                showToastIG('Unfollowed');
            } else {
                this.dataset.following = 'true';
                btnText.textContent = 'Following';
                showToastIG('Following');
            }
        });
    }

    // Message button
    const messageBtn = document.querySelector('.btn-action-ig--message');
    if (messageBtn) {
        messageBtn.addEventListener('click', function() {
            // Require authentication
            if (!requireAuth()) {
                return;
            }

            // TODO: Open message composer
            showToastIG('Messaging feature coming soon');
        });
    }

    // Share button
    const shareBtn = document.querySelector('.btn-action-ig--share');
    if (shareBtn) {
        shareBtn.addEventListener('click', async function() {
            const profileUrl = window.location.href;
            const profileName = document.querySelector('.profile-name-ig')?.textContent || 'Celebrity';

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: `${profileName} on StarryMeet`,
                        url: profileUrl
                    });
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        console.log('Share error:', err);
                    }
                }
            } else {
                // Fallback: Copy to clipboard
                try {
                    await navigator.clipboard.writeText(profileUrl);
                    showToastIG('Link copied!');
                } catch (err) {
                    console.log('Copy error:', err);
                }
            }
        });
    }
}

/**
 * Show toast notification (Instagram-style)
 */
function showToastIG(message, duration = 3000) {
    let container = document.getElementById('toast-container');

    // Create container if it doesn't exist
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-atomic', 'true');
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-ig success';
    toast.textContent = message;

    // Add to container
    container.appendChild(toast);

    // Trigger show animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}
