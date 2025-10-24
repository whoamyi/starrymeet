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

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadSharedComponents();
    await loadCelebrityProfile();
    setupPanelToggles();
});

/**
 * Load celebrity profile data
 */
async function loadCelebrityProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');

    if (!username) {
        console.error('No username provided');
        window.location.href = 'browse.html';
        return;
    }

    try {
        // Load celebrity data by username (slug)
        const response = await fetchAPI(`/api/celebrities/username/${username}`);

        if (!response.success || !response.data || !response.data.celebrity) {
            throw new Error('Celebrity not found');
        }

        state.celebrity = response.data.celebrity;

        // Populate static section
        populateStaticSection(state.celebrity);

        // Load availability for both meeting types
        await Promise.all([
            loadAvailability('physical'),
            loadAvailability('virtual')
        ]);

    } catch (error) {
        console.error('Error loading profile:', error);
        showError('Failed to load celebrity profile');
    }
}

/**
 * Populate static profile section
 */
function populateStaticSection(celebrity) {
    // Profile image
    const profileImage = document.getElementById('profile-image');
    profileImage.src = celebrity.avatar_url || 'images/default-avatar.jpg';
    profileImage.alt = celebrity.display_name;

    // Name
    document.getElementById('celebrity-name').textContent = celebrity.display_name;

    // Verified badge
    if (celebrity.is_verified) {
        document.getElementById('verified-badge').style.display = 'inline-block';
    }

    // Location
    document.getElementById('location').textContent = celebrity.location || 'Location not specified';

    // Category
    document.getElementById('category').textContent = celebrity.category || 'Celebrity';

    // Bio
    document.getElementById('bio').textContent = celebrity.bio || `Book an exclusive meeting with ${celebrity.display_name}. Choose between in-person and virtual options at select locations worldwide.`;

    // Stats
    document.getElementById('rating-value').textContent = celebrity.average_rating > 0
        ? `${celebrity.average_rating.toFixed(1)} ⭐`
        : 'New';
    document.getElementById('bookings-value').textContent = celebrity.total_bookings || 0;
    document.getElementById('reviews-value').textContent = celebrity.total_reviews || 0;

    // Tier badge
    const tier = determineTier(celebrity);
    const tierBadge = document.getElementById('tier-badge');
    tierBadge.textContent = `Tier ${tier}`;
    tierBadge.className = `tier-badge tier-${tier.toLowerCase()}`;
}

/**
 * Determine celebrity tier based on pricing
 */
function determineTier(celebrity) {
    const price = celebrity.standard_meet_price_cents || 0;
    if (price >= 50000000) return 'S';
    if (price >= 10000000) return 'A';
    if (price >= 2000000) return 'B';
    if (price >= 500000) return 'C';
    return 'D';
}

/**
 * Load availability for meeting type
 */
async function loadAvailability(meetingType) {
    const content = document.getElementById(`${meetingType}-content`);

    try {
        // Fetch availability from backend
        const startDate = new Date().toISOString().split('T')[0];
        const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const response = await fetchAPI(
            `/api/celebrities/${state.celebrity.id}/availability?meeting_type=${meetingType}&start_date=${startDate}&end_date=${endDate}`
        );

        if (!response.success || !response.data) {
            throw new Error('Failed to load availability');
        }

        state.availability[meetingType] = response.data.slots || [];

        // Group by city
        const citiesData = groupByCities(state.availability[meetingType]);

        // Render cities grid
        renderCitiesGrid(meetingType, citiesData);

    } catch (error) {
        console.error(`Error loading ${meetingType} availability:`, error);
        renderEmptyState(content, meetingType);
    }
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
        celebrity_name: state.celebrity.display_name,
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

// Make functions global for onclick handlers
window.backToCities = backToCities;
window.selectSlot = selectSlot;
window.proceedToBooking = proceedToBooking;
