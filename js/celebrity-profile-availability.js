/**
 * Celebrity Profile - 3-Layer Collapsible Availability System
 * Level 1: Location/Day (always visible with ticket count)
 * Level 2: Individual slots (date/time/duration)
 * Level 3: Price + Request button (revealed on tap)
 */

/**
 * Group availability data by location for physical, by date for virtual
 */
function groupAvailability(availabilityData) {
    const physical = {};
    const virtual = {};

    availabilityData.forEach(slot => {
        if (slot.meeting_type === 'physical') {
            const city = slot.city || 'Unknown';
            if (!physical[city]) {
                physical[city] = [];
            }
            physical[city].push(slot);
        } else if (slot.meeting_type === 'virtual') {
            const date = slot.date;
            if (!virtual[date]) {
                virtual[date] = [];
            }
            virtual[date].push(slot);
        }
    });

    return { physical, virtual };
}

/**
 * Format date for display
 */
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format time for display
 */
function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

/**
 * Render availability section
 */
function renderAvailabilitySection(availabilityData) {
    const container = document.getElementById('availability-container');
    if (!container) {
        console.warn('Availability container not found');
        return;
    }

    const grouped = groupAvailability(availabilityData);
    let html = '<section class="availability">';

    // Physical meetings grouped by city
    Object.keys(grouped.physical).forEach((city, index) => {
        const citySlots = grouped.physical[city];
        const totalTickets = citySlots.reduce((sum, slot) => sum + slot.slots_remaining, 0);

        html += `
            <div class="availability__location" data-location-id="physical-${index}">
                <button class="availability__location-toggle" onclick="toggleLocation('physical-${index}')" aria-expanded="false">
                    📍 ${city}
                    <span class="availability__count">🎟️ ${totalTickets}</span>
                </button>
                <div class="availability__units" id="units-physical-${index}">
                    ${citySlots.map((slot, slotIndex) => `
                        <div class="availability__unit" data-unit-id="physical-${index}-${slotIndex}">
                            <button class="unit__toggle" onclick="toggleUnit('physical-${index}-${slotIndex}')" aria-expanded="false">
                                ${formatDate(slot.date)} • ${formatTime(slot.time)} • ${slot.duration} min
                            </button>
                            <div class="unit__detail" id="detail-physical-${index}-${slotIndex}">
                                <div class="unit__price">$${(slot.price_cents / 100).toLocaleString()}</div>
                                <button class="unit__request btn--outline" onclick="requestMeeting('${slot.id || ''}', 'physical', ${slot.duration}, ${slot.price_cents})">
                                    Request
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });

    // Virtual meetings grouped by date
    Object.keys(grouped.virtual).forEach((date, index) => {
        const dateSlots = grouped.virtual[date];
        const totalTickets = dateSlots.reduce((sum, slot) => sum + slot.slots_remaining, 0);

        html += `
            <div class="availability__location" data-location-id="virtual-${index}">
                <button class="availability__location-toggle" onclick="toggleLocation('virtual-${index}')" aria-expanded="false">
                    💻 ${formatDate(date)}
                    <span class="availability__count">🎟️ ${totalTickets}</span>
                </button>
                <div class="availability__units" id="units-virtual-${index}">
                    ${dateSlots.map((slot, slotIndex) => `
                        <div class="availability__unit" data-unit-id="virtual-${index}-${slotIndex}">
                            <button class="unit__toggle" onclick="toggleUnit('virtual-${index}-${slotIndex}')" aria-expanded="false">
                                ${formatTime(slot.time)} • ${slot.duration} min
                            </button>
                            <div class="unit__detail" id="detail-virtual-${index}-${slotIndex}">
                                <div class="unit__price">$${(slot.price_cents / 100).toLocaleString()}</div>
                                <button class="unit__request btn--outline" onclick="requestMeeting('${slot.id || ''}', 'virtual', ${slot.duration}, ${slot.price_cents})">
                                    Request
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });

    html += '</section>';
    container.innerHTML = html;
}

/**
 * Toggle location/day (Level 1)
 */
function toggleLocation(locationId) {
    const unitsContainer = document.getElementById(`units-${locationId}`);
    const toggle = document.querySelector(`[onclick="toggleLocation('${locationId}')"]`);

    if (!unitsContainer) return;

    const isExpanded = unitsContainer.style.display === 'flex';

    // Close all other locations (single accordion)
    document.querySelectorAll('.availability__units').forEach(units => {
        units.style.display = 'none';
    });
    document.querySelectorAll('.availability__location-toggle').forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
    });

    // Toggle this location
    if (!isExpanded) {
        unitsContainer.style.display = 'flex';
        toggle.setAttribute('aria-expanded', 'true');
    }
}

/**
 * Toggle unit detail (Level 2 → Level 3)
 */
function toggleUnit(unitId) {
    const detailContainer = document.getElementById(`detail-${unitId}`);
    const toggle = document.querySelector(`[onclick="toggleUnit('${unitId}')"]`);

    if (!detailContainer) return;

    const isExpanded = detailContainer.style.display === 'flex';

    // Toggle this unit
    detailContainer.style.display = isExpanded ? 'none' : 'flex';
    toggle.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
}

/**
 * Request meeting (trigger request flow)
 */
function requestMeeting(slotId, meetingType, duration, priceCents) {
    // Get celebrity slug from URL or stored data
    const celebSlug = window.currentCelebritySlug || getCurrentCelebritySlug();

    if (!celebSlug) {
        console.error('Celebrity slug not found');
        showToast('Error: Unable to process request');
        return;
    }

    // Redirect to request flow with celebrity and slot parameters
    window.location.href = `request-flow.html?celebrity=${encodeURIComponent(celebSlug)}&slot=${encodeURIComponent(slotId)}`;
}

/**
 * Get celebrity slug from current URL
 */
function getCurrentCelebritySlug() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('slug') || urlParams.get('celebrity');
}

/**
 * Show toast notification
 */
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Make functions globally accessible
window.toggleLocation = toggleLocation;
window.toggleUnit = toggleUnit;
window.requestMeeting = requestMeeting;
window.renderAvailabilitySection = renderAvailabilitySection;
