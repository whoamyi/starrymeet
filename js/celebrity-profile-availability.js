/**
 * Celebrity Profile - Modern Availability System
 * Two-Level Structure:
 * Level 1: Physical/Virtual Meetings (collapsible sections)
 * Level 2: Location/Date packages with ticket count
 * Level 3: Individual ticket units with date/time/duration
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
function formatDateDisplay(dateStr) {
    const date = new Date(dateStr);
    const screenWidth = window.innerWidth;

    if (screenWidth < 360) {
        // Very small screens: 11/11/25
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear().toString().slice(-2);
        return `${month}/${day}/${year}`;
    } else {
        // Normal: Nov 11, 2025
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
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
 * SVG Icons
 */
const SVG_ICONS = {
    location: `<svg class="icon-location" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
    </svg>`,
    calendar: `<svg class="icon-calendar" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>`,
    clock: `<svg class="icon-clock" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
    </svg>`,
    chevronDown: `<svg class="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
    </svg>`,
    chevronSm: `<svg class="chevron-sm" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
    </svg>`
};

/**
 * Render availability section - Main entry point
 */
function renderAvailabilitySection(availabilityData) {
    const container = document.getElementById('availability-container');
    if (!container) {
        console.warn('Availability container not found');
        return;
    }

    if (!availabilityData || availabilityData.length === 0) {
        container.innerHTML = '<p class="no-availability">No availability at this time</p>';
        return;
    }

    const grouped = groupAvailability(availabilityData);
    let html = '';

    // Physical Meetings Section
    if (Object.keys(grouped.physical).length > 0) {
        html += renderMeetingTypeSection('physical', grouped.physical);
    }

    // Virtual Meetings Section
    if (Object.keys(grouped.virtual).length > 0) {
        html += renderMeetingTypeSection('virtual', grouped.virtual);
    }

    container.innerHTML = html;
}

/**
 * Render Physical or Virtual meeting type section
 */
function renderMeetingTypeSection(type, groupedSlots) {
    const title = type === 'physical' ? 'Physical Meetings' : 'Virtual Meetings';
    const locations = Object.keys(groupedSlots);

    let html = `
        <div class="meeting-type-group">
            <button class="meeting-type-header" onclick="toggleMeetingType('${type}')" aria-expanded="false">
                <span class="meeting-type-title">${title}</span>
                ${SVG_ICONS.chevronDown}
            </button>
            <div class="meeting-type-content" id="${type}-content" style="display: none;">
    `;

    // Render each location/date package
    locations.forEach((locationKey, index) => {
        const slots = groupedSlots[locationKey];
        const locationId = `${type}-${locationKey.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${index}`;

        html += renderLocationPackage(type, locationKey, locationId, slots);
    });

    html += `
            </div>
        </div>
    `;

    return html;
}

/**
 * Render a location/date package with its tickets
 */
function renderLocationPackage(type, locationKey, locationId, slots) {
    const totalTickets = slots.reduce((sum, slot) => sum + (slot.slots_remaining || 0), 0);
    const icon = type === 'physical' ? SVG_ICONS.location : SVG_ICONS.calendar;
    const ticketText = totalTickets === 1 ? 'ticket' : 'tickets';

    let html = `
        <button class="location-package" onclick="toggleLocation('${locationId}')" aria-expanded="false">
            <div class="package-header">
                <div class="package-info">
                    ${icon}
                    <span class="location-name">${locationKey}</span>
                </div>
                <div class="package-meta">
                    <span class="ticket-count">🎟️ ${totalTickets} ${ticketText}</span>
                    ${SVG_ICONS.chevronSm}
                </div>
            </div>
        </button>
        <div class="ticket-units" id="${locationId}-tickets" style="display: none;">
    `;

    // Render each ticket unit
    slots.forEach((slot, index) => {
        html += renderTicketUnit(type, slot, index);
    });

    html += `</div>`;

    return html;
}

/**
 * Render an individual ticket unit
 */
function renderTicketUnit(type, slot, index) {
    const price = slot.price_cents ? `$${(slot.price_cents / 100).toLocaleString()}` : 'Price TBD';
    const slotId = slot.id || `${type}-${index}`;

    let datetimeHtml = '';

    if (type === 'physical') {
        // Physical: Show date + time + duration
        datetimeHtml = `
            ${SVG_ICONS.calendar}
            <span class="date-text">${formatDateDisplay(slot.date)}</span>
            ${SVG_ICONS.clock}
            <span class="time-text">${formatTime(slot.time)}</span>
            <span class="duration-pill">${slot.duration} min</span>
        `;
    } else {
        // Virtual: Show time + duration only (date is in package header)
        datetimeHtml = `
            ${SVG_ICONS.clock}
            <span class="time-text">${formatTime(slot.time)}</span>
            <span class="duration-pill">${slot.duration} min</span>
        `;
    }

    return `
        <div class="ticket-unit">
            <div class="ticket-details">
                <div class="ticket-datetime">
                    ${datetimeHtml}
                </div>
                <div class="ticket-actions">
                    <span class="ticket-price">${price}</span>
                    <button class="btn-ticket-request" onclick="requestMeeting('${slotId}', '${type}', ${slot.duration}, ${slot.price_cents || 0})">
                        Request
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Toggle Meeting Type (Physical/Virtual)
 */
function toggleMeetingType(type) {
    const content = document.getElementById(`${type}-content`);
    const button = event.currentTarget;
    const chevron = button.querySelector('.chevron-icon');

    if (content.style.display === 'none') {
        content.style.display = 'block';
        button.setAttribute('aria-expanded', 'true');
        chevron.classList.add('expanded');
    } else {
        content.style.display = 'none';
        button.setAttribute('aria-expanded', 'false');
        chevron.classList.remove('expanded');
    }
}

/**
 * Toggle Location/Date Package
 */
function toggleLocation(locationId) {
    const tickets = document.getElementById(`${locationId}-tickets`);
    const packageBtn = event.currentTarget;
    const chevron = packageBtn.querySelector('.chevron-sm');

    if (tickets.style.display === 'none') {
        tickets.style.display = 'block';
        packageBtn.setAttribute('aria-expanded', 'true');
        packageBtn.classList.add('expanded');
        if (chevron) chevron.classList.add('expanded');
    } else {
        tickets.style.display = 'none';
        packageBtn.setAttribute('aria-expanded', 'false');
        packageBtn.classList.remove('expanded');
        if (chevron) chevron.classList.remove('expanded');
    }
}

/**
 * Request Meeting - Requires Authentication
 */
function requestMeeting(slotId, meetingType, duration, priceCents) {
    // Require authentication before proceeding
    const celebSlug = window.currentCelebritySlug || getCurrentCelebritySlug();

    if (!celebSlug) {
        console.error('Celebrity slug not found');
        showToast('Error: Unable to process request');
        return;
    }

    // Build the target URL
    const targetUrl = `request-flow.html?celebrity=${encodeURIComponent(celebSlug)}&slot=${encodeURIComponent(slotId)}`;

    // Check authentication - if not authenticated, redirect to auth with return URL
    if (!requireAuth(targetUrl)) {
        return;
    }

    // If authenticated, proceed to request flow
    window.location.href = targetUrl;
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
    toast.className = 'toast-notification';
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
window.toggleMeetingType = toggleMeetingType;
window.toggleLocation = toggleLocation;
window.requestMeeting = requestMeeting;
window.renderAvailabilitySection = renderAvailabilitySection;
