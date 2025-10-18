/**
 * Booking Flow Initialization
 * Manages celebrity context and data persistence throughout booking process
 */

// Global booking state
let currentBookingData = null;
let currentStep = 1;

// Initialize booking flow on page load
document.addEventListener('DOMContentLoaded', function() {
    // Require authentication
    if (!requireAuth()) {
        return;
    }

    // Load celebrity context
    initializeBooking();

    // Set up event listeners
    setupEventListeners();
});

/**
 * Initialize booking with celebrity context
 */
function initializeBooking() {
    // Get celebrity from URL parameter or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const celebrityNameFromUrl = urlParams.get('celebrity');

    // Try to load existing booking in progress
    currentBookingData = getCurrentBooking();

    // If URL has celebrity, load that celebrity's data
    if (celebrityNameFromUrl) {
        const celebrity = getCelebrityByName(celebrityNameFromUrl);
        if (celebrity) {
            currentBookingData = {
                celebrityName: celebrity.name,
                category: celebrity.mainCategory,
                price: celebrity.price,
                location: celebrity.city,
                country: celebrity.country
            };
            saveCurrentBooking(currentBookingData);
        }
    }

    // If no celebrity context, redirect to browse
    if (!currentBookingData || !currentBookingData.celebrityName) {
        alert('Please select a celebrity first');
        window.location.href = 'browse.html';
        return;
    }

    // Display celebrity info in booking header
    displayCelebrityInfo();

    // Initialize step 1
    updateStepDisplay();
}

/**
 * Display celebrity information throughout booking
 */
function displayCelebrityInfo() {
    // Update header with celebrity name
    const headerElements = document.querySelectorAll('[data-celebrity-name]');
    headerElements.forEach(el => {
        el.textContent = currentBookingData.celebrityName;
    });

    // Update price displays
    const priceElements = document.querySelectorAll('[data-celebrity-price]');
    priceElements.forEach(el => {
        el.textContent = formatPrice(currentBookingData.price);
    });

    // Update celebrity category
    const categoryElement = document.getElementById('celebrityCategory');
    if (categoryElement) {
        categoryElement.textContent = currentBookingData.category;
    }

    // Update celebrity initials
    const initialsElement = document.getElementById('celebrityInitials');
    if (initialsElement && currentBookingData.celebrityName) {
        const initials = currentBookingData.celebrityName
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
        initialsElement.textContent = initials;
    }

    // Update location in confirmation
    const locationElement = document.getElementById('confirmedLocation');
    if (locationElement) {
        locationElement.textContent = `${currentBookingData.location}, ${currentBookingData.country}`;
    }

    // Update package options with celebrity price
    updatePackageOptions();

    // Set page title
    document.title = `Book ${currentBookingData.celebrityName} - StarryMeet`;
}

/**
 * Update package options with celebrity-specific pricing
 */
function updatePackageOptions() {
    if (!currentBookingData || !currentBookingData.price) return;

    const basePrice = currentBookingData.price;

    // Update package options
    const packages = [
        { selector: '.package-option:nth-child(1)', name: 'Quick Meet', price: Math.round(basePrice * 0.5), duration: 15 },
        { selector: '.package-option:nth-child(2)', name: 'Standard Meet', price: basePrice, duration: 30 },
        { selector: '.package-option:nth-child(3)', name: 'Extended Meet', price: Math.round(basePrice * 1.5), duration: 60 }
    ];

    packages.forEach(pkg => {
        const element = document.querySelector(pkg.selector);
        if (element) {
            const priceElement = element.querySelector('.package-price');
            if (priceElement) {
                priceElement.textContent = formatPrice(pkg.price);
            }
            // Update onclick handler
            element.setAttribute('onclick', `selectPackage(this, '${pkg.name}', ${pkg.price}, ${pkg.duration})`);
        }
    });

    // Update summary total with base price (standard package)
    const summaryTotal = document.getElementById('summaryTotal');
    if (summaryTotal) {
        summaryTotal.textContent = formatPrice(basePrice);
    }
}

/**
 * Set up form event listeners
 */
function setupEventListeners() {
    // Date input validation
    const dateInput = document.getElementById('meetingDate');
    if (dateInput) {
        // Set min date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }
}

/**
 * Navigate to next step (called by existing nextStep function)
 */
function saveStepData(step) {
    const updates = {};

    if (step === 1) {
        // Save date/time/location from Step 1
        const dateInput = document.getElementById('meetingDate');
        const timeInput = document.getElementById('meetingTime');
        const locationInput = document.getElementById('meetingLocation');

        if (dateInput) updates.date = dateInput.value;
        if (timeInput) updates.time = timeInput.value;
        if (locationInput) updates.location = locationInput.value || currentBookingData.location;

        // Validate
        if (!updates.date || !updates.time) {
            alert('Please select a date and time');
            return false;
        }
    }

    if (step === 3) {
        // Save application data from Step 3
        const occupationInput = document.getElementById('occupation');
        const hometownInput = document.getElementById('hometown');
        const whyMeetInput = document.getElementById('whyMeet');
        const topicsInput = document.getElementById('topics');
        const agreeCheckbox = document.getElementById('agreeTerms');

        if (occupationInput) updates.occupation = occupationInput.value;
        if (hometownInput) updates.hometown = hometownInput.value;
        if (whyMeetInput) updates.whyMeet = whyMeetInput.value;
        if (topicsInput) updates.topics = topicsInput.value;

        // Validate
        if (!updates.occupation || !updates.hometown || !updates.whyMeet || !updates.topics) {
            alert('Please fill in all required fields');
            return false;
        }

        if (updates.whyMeet.length < 50) {
            alert('Please provide at least 50 characters explaining why you want to meet this celebrity');
            return false;
        }

        if (updates.topics.length < 20) {
            alert('Please provide at least 20 characters describing what you\'d like to discuss');
            return false;
        }

        if (agreeCheckbox && !agreeCheckbox.checked) {
            alert('Please agree to the terms to continue');
            return false;
        }
    }

    // Save updates to booking data
    if (Object.keys(updates).length > 0) {
        currentBookingData = { ...currentBookingData, ...updates };
        saveCurrentBooking(currentBookingData);
    }

    return true;
}

/**
 * Update step display (called by existing updateStepDisplay)
 */
function populateStepData(step) {
    // Populate form fields with existing data
    if (!currentBookingData) return;

    if (step === 1 && currentBookingData.date) {
        const dateInput = document.getElementById('meetingDate');
        const timeInput = document.getElementById('meetingTime');
        const locationInput = document.getElementById('meetingLocation');

        if (dateInput && currentBookingData.date) dateInput.value = currentBookingData.date;
        if (timeInput && currentBookingData.time) timeInput.value = currentBookingData.time;
        if (locationInput && currentBookingData.location) locationInput.value = currentBookingData.location;
    }

    if (step === 3) {
        const occupationInput = document.getElementById('occupation');
        const hometownInput = document.getElementById('hometown');
        const whyMeetInput = document.getElementById('whyMeet');
        const topicsInput = document.getElementById('topics');

        if (occupationInput && currentBookingData.occupation) occupationInput.value = currentBookingData.occupation;
        if (hometownInput && currentBookingData.hometown) hometownInput.value = currentBookingData.hometown;
        if (whyMeetInput && currentBookingData.whyMeet) whyMeetInput.value = currentBookingData.whyMeet;
        if (topicsInput && currentBookingData.topics) topicsInput.value = currentBookingData.topics;
    }

    if (step === 4) {
        // Review step - display all booking data
        displayReviewData();
    }
}

/**
 * Display booking data in review step
 */
function displayReviewData() {
    const reviewContainer = document.getElementById('reviewContainer');
    if (!reviewContainer) return;

    const reviewHTML = `
        <div class="review-section">
            <h3>Celebrity</h3>
            <p><strong>${currentBookingData.celebrityName}</strong></p>
            <p>${currentBookingData.category}</p>
        </div>

        <div class="review-section">
            <h3>Meeting Details</h3>
            <p><strong>Date:</strong> ${formatDate(currentBookingData.date)}</p>
            <p><strong>Time:</strong> ${currentBookingData.time}</p>
            <p><strong>Location:</strong> ${currentBookingData.location}</p>
        </div>

        <div class="review-section">
            <h3>Your Information</h3>
            <p><strong>Occupation:</strong> ${currentBookingData.occupation}</p>
            <p><strong>Hometown:</strong> ${currentBookingData.hometown}</p>
        </div>

        <div class="review-section">
            <h3>About This Meeting</h3>
            <p><strong>Why you want to meet:</strong></p>
            <p>${currentBookingData.whyMeet}</p>
            <p><strong>Topics to discuss:</strong></p>
            <p>${currentBookingData.topics}</p>
        </div>

        <div class="review-section">
            <h3>Total Price</h3>
            <p class="review-price">${formatPrice(currentBookingData.price)}</p>
        </div>
    `;

    reviewContainer.innerHTML = reviewHTML;
}

/**
 * Submit final booking
 */
function submitBooking() {
    try {
        // Validate we have all required data
        if (!currentBookingData.celebrityName || !currentBookingData.date || !currentBookingData.time) {
            throw new Error('Missing required booking information');
        }

        if (!currentBookingData.occupation || !currentBookingData.hometown || !currentBookingData.whyMeet) {
            throw new Error('Missing required application information');
        }

        // Create the booking
        const booking = createBooking({
            celebrityName: currentBookingData.celebrityName,
            date: currentBookingData.date,
            time: currentBookingData.time,
            location: currentBookingData.location,
            price: currentBookingData.price,
            meetingType: 'Private Meet & Greet',
            duration: '30 minutes',
            occupation: currentBookingData.occupation,
            hometown: currentBookingData.hometown,
            whyMeet: currentBookingData.whyMeet,
            topics: currentBookingData.topics
        });

        // Clear temporary booking data
        clearCurrentBooking();

        // Show success message
        showSuccessMessage('Booking request submitted successfully!');

        // Redirect to dashboard after short delay
        setTimeout(() => {
            window.location.href = 'dashboard.html?tab=bookings&status=pending';
        }, 1500);

    } catch (error) {
        console.error('Booking submission error:', error);
        alert('Error submitting booking: ' + error.message);
    }
}

/**
 * Override existing nextStep function to save data
 */
const originalNextStep = window.nextStep;
window.nextStep = function() {
    // Save current step data
    if (!saveStepData(currentStep)) {
        return; // Validation failed
    }

    // Call original function
    if (typeof originalNextStep === 'function') {
        originalNextStep();
    } else {
        // Fallback if original doesn't exist
        if (currentStep < 5) {
            currentStep++;
            updateStepDisplay();
        }
    }

    // Populate next step with saved data
    populateStepData(currentStep);
};

/**
 * Override existing prevStep function
 */
const originalPrevStep = window.prevStep;
window.prevStep = function() {
    // Call original function
    if (typeof originalPrevStep === 'function') {
        originalPrevStep();
    } else {
        // Fallback if original doesn't exist
        if (currentStep > 1) {
            currentStep--;
            updateStepDisplay();
        }
    }

    // Populate previous step with saved data
    populateStepData(currentStep);
};

/**
 * Override existing submitBooking if it exists
 */
if (typeof window.submitBooking === 'undefined') {
    window.submitBooking = submitBooking;
}

/**
 * Make functions globally available
 */
window.saveStepData = saveStepData;
window.populateStepData = populateStepData;
window.displayReviewData = displayReviewData;

console.log('Booking flow initialized for:', currentBookingData?.celebrityName);
