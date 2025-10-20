/**
 * Booking Flow - Sequential 4-Step Implementation
 * Step 1: Review Selection (date, time, package, location)
 * Step 2: Your Details & Application Form
 * Step 3: Payment
 * Step 4: Confirmation
 */

// Global booking state
let currentStep = 1;
let selectedPackage = null;
let selectedDate = null;
let selectedTime = null;
let selectedLocation = null;
let isEditMode = false;
let currentCelebrity = null;

// Initialize booking flow on page load
document.addEventListener('DOMContentLoaded', async function() {
    // Require authentication
    if (!requireAuth()) {
        return;
    }

    // Load celebrity from URL or sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username') || sessionStorage.getItem('celebrityUsername');
    const packageType = urlParams.get('package') || sessionStorage.getItem('selectedPackage');

    if (!username) {
        alert('Please select a celebrity from the browse page first');
        window.location.href = 'browse.html';
        return;
    }

    // Load celebrity data from API
    await loadCelebrityData(username, packageType);

    // Initialize UI with celebrity-specific data
    initializeBookingUI();

    console.log('Booking initialized for:', username, 'Package:', packageType);
});

/**
 * Load celebrity data from API
 */
async function loadCelebrityData(username, packageType = 'standard-meet') {
    try {
        // Fetch celebrity from API
        const response = await window.api.getCelebrity(username);

        if (!response.success || !response.data || !response.data.celebrity) {
            throw new Error('Celebrity not found');
        }

        const celebrity = response.data.celebrity;

        // Transform API response to frontend format
        currentCelebrity = {
            name: celebrity.display_name,
            username: celebrity.username,
            category: celebrity.category,
            mainCategory: celebrity.category,
            subCategory: celebrity.subcategory,
            niche_category: celebrity.niche_category,
            bio: celebrity.bio,
            location: celebrity.location,
            city: celebrity.location ? celebrity.location.split(',')[0].trim() : 'Los Angeles',
            country: celebrity.location ? celebrity.location.split(',')[1]?.trim() : 'USA',
            verified: celebrity.is_verified,
            trending: celebrity.is_featured,
            rating: parseFloat(celebrity.average_rating || 4.9),
            reviews: celebrity.total_reviews || 0,
            meetings: celebrity.total_bookings || 0,
            response_time: celebrity.response_time_hours || 24,
            prices: {
                quick: Math.round(celebrity.quick_meet_price_cents / 100),
                standard: Math.round(celebrity.standard_meet_price_cents / 100),
                premium: Math.round(celebrity.premium_meet_price_cents / 100)
            },
            price: Math.round(celebrity.standard_meet_price_cents / 100) // Default to standard price
        };

        // Set selected package based on URL parameter or sessionStorage
        const packageMap = {
            'quick-meet': {
                name: 'Quick Meet',
                price: currentCelebrity.prices.quick,
                duration: 20
            },
            'standard-meet': {
                name: 'Standard Meet',
                price: currentCelebrity.prices.standard,
                duration: 45
            },
            'premium-experience': {
                name: 'Premium Experience',
                price: currentCelebrity.prices.premium,
                duration: 90
            }
        };

        selectedPackage = packageMap[packageType] || packageMap['standard-meet'];
        selectedLocation = currentCelebrity.location;

        console.log('✅ Celebrity data loaded from API:', currentCelebrity.name);

    } catch (error) {
        console.error('Error loading celebrity from API:', error);
        alert('Failed to load celebrity data. Please try again.');
        window.location.href = 'browse.html';
    }
}

/**
 * Initialize booking UI with celebrity-specific data
 */
function initializeBookingUI() {
    if (!currentCelebrity) return;

    // Update celebrity name throughout
    const nameElements = document.querySelectorAll('[data-celebrity-name], #celebrityNameInForm');
    nameElements.forEach(el => {
        if (el) el.textContent = currentCelebrity.name;
    });

    // Update location displays
    updateLocationDisplay();

    // Generate celebrity-specific meeting packages
    generateMeetingPackages();

    // Set default date/time if coming from profile
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('date')) {
        selectedDate = urlParams.get('date');
        document.getElementById('displayDate').textContent = selectedDate;
    }
    if (urlParams.get('timeSlot')) {
        selectedTime = urlParams.get('timeSlot');
        document.getElementById('displayTime').textContent = selectedTime;
    }

    // Update progress bar for 3 steps
    updateProgress();

    // Initialize summary
    updateSummary();
}

/**
 * Generate meeting packages based on celebrity pricing
 */
function generateMeetingPackages() {
    if (!currentCelebrity) return;

    const basePrice = currentCelebrity.price || 1500;

    const packages = [
        {
            name: 'Quick Meet',
            price: Math.round(basePrice * 0.5),
            duration: 15,
            description: 'Brief in-person meeting'
        },
        {
            name: 'Standard Meet',
            price: basePrice,
            duration: 30,
            description: 'Standard meet & greet'
        },
        {
            name: 'Extended Meet',
            price: Math.round(basePrice * 1.5),
            duration: 60,
            description: 'Extended one-on-one time'
        }
    ];

    // Update package options in the HTML if they exist
    const packageContainer = document.querySelector('.package-options');
    if (packageContainer) {
        packageContainer.innerHTML = packages.map(pkg => `
            <div class="package-option ${pkg.name === 'Standard Meet' ? 'selected' : ''}"
                 onclick="selectPackage(this, '${pkg.name}', ${pkg.price}, ${pkg.duration})">
                <div class="package-header">
                    <div class="package-name">${pkg.name}</div>
                    <div class="package-price">$${pkg.price.toLocaleString()}</div>
                </div>
                <div class="package-duration">${pkg.duration} minutes</div>
                <div class="package-description" style="opacity: 0.6; font-size: 0.875rem;">${pkg.description}</div>
            </div>
        `).join('');
    }

    // Set default to Standard Meet
    if (!selectedPackage) {
        selectedPackage = packages[1];
    }
}

/**
 * Update location display with celebrity locations
 */
function updateLocationDisplay() {
    if (!selectedLocation) {
        selectedLocation = `${currentCelebrity.city || 'Los Angeles'}, ${currentCelebrity.country || 'USA'}`;
    }

    // Update all location displays
    const locationElements = ['displayLocation', 'editLocation', 'confirmedLocation'];
    locationElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
                el.value = selectedLocation;
            } else {
                el.textContent = selectedLocation;
            }
        }
    });

    // Add available locations dropdown if exists
    const locationSelect = document.getElementById('editLocation');
    if (locationSelect && locationSelect.tagName === 'SELECT') {
        const locations = generateLocationOptions();
        locationSelect.innerHTML = locations.map(loc =>
            `<option value="${loc}" ${loc === selectedLocation ? 'selected' : ''}>${loc}</option>`
        ).join('');
    }
}

/**
 * Generate location options based on celebrity
 */
function generateLocationOptions() {
    const baseCity = currentCelebrity.city || 'Los Angeles';
    const country = currentCelebrity.country || 'USA';

    return [
        `${baseCity}, ${country}`,
        `New York, USA`,
        `London, UK`,
        `Virtual Meeting`
    ];
}

/**
 * Select a meeting package
 */
function selectPackage(element, name, price, duration) {
    document.querySelectorAll('.package-option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');

    selectedPackage = { name, price, duration };
    updateSummary();
}

/**
 * Select time slot in mini view
 */
function selectTimeMini(element, time) {
    document.querySelectorAll('.time-slot-mini').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');

    selectedTime = time;
    document.getElementById('displayTime').textContent = time;
    updateSummary();
}

/**
 * Toggle edit mode for meeting details
 */
function toggleEditMode() {
    isEditMode = !isEditMode;

    const confirmView = document.getElementById('confirmView');
    const editView = document.getElementById('editView');
    const editBtnText = document.getElementById('editBtnText');

    if (confirmView && editView) {
        if (isEditMode) {
            confirmView.style.display = 'none';
            editView.style.display = 'block';
            if (editBtnText) editBtnText.textContent = '✓ Done';
        } else {
            confirmView.style.display = 'block';
            editView.style.display = 'none';
            if (editBtnText) editBtnText.textContent = '✏️ Edit';
            updateDisplayValues();
        }
    }
}

/**
 * Update display values when editing
 */
function updateDisplayValues() {
    const editLocationEl = document.getElementById('editLocation');
    const editDateEl = document.getElementById('editDate');

    if (editLocationEl) {
        selectedLocation = editLocationEl.value;
        const displayLocationEl = document.getElementById('displayLocation');
        if (displayLocationEl) displayLocationEl.textContent = selectedLocation;
    }

    if (editDateEl) {
        selectedDate = editDateEl.value;
        const displayDateEl = document.getElementById('displayDate');
        if (displayDateEl) displayDateEl.textContent = selectedDate;
    }

    updateSummary();
}

/**
 * Update summary sidebar
 */
function updateSummary() {
    if (!selectedPackage) return;

    const summaryEls = {
        package: document.getElementById('summaryPackage'),
        duration: document.getElementById('summaryDuration'),
        date: document.getElementById('summaryDate'),
        time: document.getElementById('summaryTime'),
        location: document.getElementById('summaryLocation'),
        total: document.getElementById('summaryTotal')
    };

    if (summaryEls.package) summaryEls.package.textContent = selectedPackage.name;
    if (summaryEls.duration) summaryEls.duration.textContent = selectedPackage.duration + ' minutes';
    if (summaryEls.date && selectedDate) summaryEls.date.textContent = selectedDate;
    if (summaryEls.time && selectedTime) summaryEls.time.textContent = selectedTime;
    if (summaryEls.location && selectedLocation) summaryEls.location.textContent = selectedLocation;
    if (summaryEls.total) summaryEls.total.textContent = '$' + selectedPackage.price.toLocaleString();
}

/**
 * Navigate to next step
 */
function nextStep() {
    // Sequential flow: 1 (Review) -> 2 (Form) -> 3 (Payment) -> 4 (Confirmation)
    if (currentStep < 4) {
        const currentStepEl = document.getElementById('step' + currentStep);
        if (currentStepEl) currentStepEl.classList.remove('active');

        currentStep++;

        const nextStepEl = document.getElementById('step' + currentStep);
        if (nextStepEl) nextStepEl.classList.add('active');

        updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Navigate to previous step
 */
function prevStep() {
    // Sequential flow: 4 (Confirmation) -> 3 (Payment) -> 2 (Form) -> 1 (Review)
    if (currentStep > 1) {
        const currentStepEl = document.getElementById('step' + currentStep);
        if (currentStepEl) currentStepEl.classList.remove('active');

        currentStep--;

        const prevStepEl = document.getElementById('step' + currentStep);
        if (prevStepEl) prevStepEl.classList.add('active');

        updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Update progress bar (3 main steps + confirmation)
 */
function updateProgress() {
    // Step 1 = Review Selection (Progress 1)
    // Step 2 = Application Form (Progress 2)
    // Step 3 = Payment (Progress 3)
    // Step 4 = Confirmation (Complete)

    document.querySelectorAll('.progress-step').forEach((step, index) => {
        if (index < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (index === currentStep - 1) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });

    const progressPercentage = ((currentStep - 1) / 4) * 100;
    const progressLine = document.getElementById('progressLine');
    if (progressLine) {
        progressLine.style.width = progressPercentage + '%';
    }
}

/**
 * Validate application form and proceed
 */
function validateAndProceed() {
    const firstName = document.getElementById('firstName')?.value.trim();
    const lastName = document.getElementById('lastName')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const occupation = document.getElementById('occupation')?.value.trim();
    const hometown = document.getElementById('hometown')?.value.trim();
    const meetingReason = document.getElementById('meetingReason')?.value.trim();
    const discussionTopics = document.getElementById('discussionTopics')?.value.trim();
    const agreementCheck = document.getElementById('agreementCheck')?.checked;

    // Validation
    if (!firstName || !lastName) {
        alert('Please provide your full name.');
        return;
    }

    if (!email || !email.includes('@')) {
        alert('Please provide a valid email address.');
        return;
    }

    if (!phone) {
        alert('Please provide your phone number.');
        return;
    }

    if (!occupation) {
        alert('Please tell us what you do.');
        return;
    }

    if (!hometown) {
        alert('Please tell us where you\'re from.');
        return;
    }

    if (!meetingReason || meetingReason.length < 50) {
        alert('Please share why you want to meet (minimum 50 characters). Be thoughtful and genuine.');
        return;
    }

    if (!discussionTopics || discussionTopics.length < 20) {
        alert('Please tell us what you\'d like to discuss during the meeting (minimum 20 characters).');
        return;
    }

    if (!agreementCheck) {
        alert('Please acknowledge that approval is not guaranteed and your request will be reviewed.');
        return;
    }

    // Store form data for submission
    window.bookingFormData = {
        firstName,
        lastName,
        email,
        phone,
        occupation,
        hometown,
        meetingReason,
        discussionTopics
    };

    // Proceed to payment step
    nextStep();
}

/**
 * Complete booking and submit to backend
 */
async function completeBooking() {
    try {
        // Validate we have all required data
        if (!currentCelebrity || !selectedDate || !selectedTime || !selectedPackage) {
            alert('Missing booking information. Please go back and complete all fields.');
            return;
        }

        if (!window.bookingFormData) {
            alert('Missing application information. Please go back and complete the form.');
            return;
        }

        // Get current user
        const currentUser = getCurrentUser();
        if (!currentUser) {
            alert('Please log in to complete booking');
            window.location.href = 'index.html';
            return;
        }

        // Prepare booking data for backend API
        const bookingData = {
            celebrity_name: currentCelebrity.name,
            booking_date: convertDateToISO(selectedDate),
            time_slot: selectedTime,
            meeting_type: selectedPackage.name,
            contact_name: `${window.bookingFormData.firstName} ${window.bookingFormData.lastName}`,
            contact_email: window.bookingFormData.email,
            contact_phone: window.bookingFormData.phone,
            special_requests: `Occupation: ${window.bookingFormData.occupation}\nHometown: ${window.bookingFormData.hometown}\n\nWhy: ${window.bookingFormData.meetingReason}\n\nTopics: ${window.bookingFormData.discussionTopics}`,
            location: selectedLocation,
            price: selectedPackage.price
        };

        console.log('Submitting booking:', bookingData);

        // Submit to backend API
        const response = await window.api.createBooking(bookingData);

        if (response.success) {
            // Show success step
            nextStep();

            // Update confirmation details
            const confirmedPackageEl = document.getElementById('confirmedPackage');
            const confirmedDurationEl = document.getElementById('confirmedDuration');
            const confirmedPriceEl = document.getElementById('confirmedPrice');
            const confirmedDateTimeEl = document.getElementById('confirmedDateTime');
            const bookingRefEl = document.getElementById('bookingRef');

            if (confirmedPackageEl) confirmedPackageEl.textContent = selectedPackage.name;
            if (confirmedDurationEl) confirmedDurationEl.textContent = selectedPackage.duration + ' minutes';
            if (confirmedPriceEl) confirmedPriceEl.textContent = '$' + selectedPackage.price.toLocaleString();
            if (confirmedDateTimeEl) confirmedDateTimeEl.textContent = selectedDate + ' at ' + selectedTime;
            if (bookingRefEl) bookingRefEl.textContent = response.data?.booking?.booking_number || 'Pending';

            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 3000);

        } else {
            alert('Booking failed: ' + (response.error?.message || 'Unknown error'));
        }

    } catch (error) {
        console.error('Booking submission error:', error);
        alert('Failed to submit booking. Please try again or contact support.');
    }
}

/**
 * Helper: Convert date string to ISO format
 */
function convertDateToISO(dateStr) {
    if (!dateStr) return null;

    try {
        if (dateStr.includes('-')) return dateStr;

        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
        }

        return dateStr;
    } catch (e) {
        return dateStr;
    }
}

// Make functions globally available
window.selectPackage = selectPackage;
window.selectTimeMini = selectTimeMini;
window.toggleEditMode = toggleEditMode;
window.updateDisplayValues = updateDisplayValues;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.validateAndProceed = validateAndProceed;
window.completeBooking = completeBooking;
