# Full-Stack Integration Instructions - StarryMeet MVP

**Status**: Ready to implement
**Estimated Time**: 2-3 hours
**Files to Modify**: 8 core files

---

## ✅ COMPLETED

1. **Data Management System** (`js/shared.js`)
   - Added 400+ lines of localStorage-based data management
   - User management: createUser, loginUser, getCurrentUser, updateUserProfile
   - Booking management: createBooking, getBookings, updateBookingStatus
   - Favorites management: addToFavorites, removeFromFavorites, getFavorites
   - Session management: setSession, getSession, clearSession, isAuthenticated, requireAuth
   - Booking flow: saveCurrentBooking, getCurrentBooking, clearCurrentBooking

---

## 🔧 TODO - Integration Steps

### Step 1: Update Authentication System
**File**: `js/auth.js`

**Changes Needed**:

1. Update `handleEmailSignup()` at line ~78:
```javascript
// REPLACE lines 108-119 with:
showLoading('signupBtn');

try {
    const user = createUser({
        name: name,
        email: email,
        password: password
    });

    closeAuthModal();
    showSuccessMessage('Account created successfully!');

    // Redirect based on context
    const returnUrl = sessionStorage.getItem('authReturnUrl') || 'index.html';
    sessionStorage.removeItem('authReturnUrl');
    setTimeout(() => {
        window.location.href = returnUrl;
    }, 1000);
} catch (error) {
    document.getElementById('signupBtn').disabled = false;
    document.getElementById('signupBtn').style.opacity = '1';
    document.getElementById('signupBtn').innerHTML = 'Create account';
    showError(errorDiv, error.message);
}
```

2. Update `handleEmailLogin()` at line ~43:
```javascript
// REPLACE lines 62-74 with:
showLoading('loginBtn');

setTimeout(() => {
    const user = loginUser(email, password);

    if (!user) {
        document.getElementById('loginBtn').disabled = false;
        document.getElementById('loginBtn').style.opacity = '1';
        document.getElementById('loginBtn').innerHTML = 'Log in';
        showError(errorDiv, 'Invalid email or password');
        return;
    }

    closeAuthModal();
    showSuccessMessage(`Welcome back, ${user.name}!`);

    const returnUrl = sessionStorage.getItem('authReturnUrl') || 'dashboard.html';
    sessionStorage.removeItem('authReturnUrl');
    setTimeout(() => {
        window.location.href = returnUrl;
    }, 1000);
}, 500);
```

3. Update OAuth handlers (Google, Apple, Facebook) - lines ~123-175:
```javascript
// For each OAuth handler, wrap the userData in try-catch:
function handleGoogleLogin() {
    showLoading('googleLoginBtn');

    setTimeout(() => {
        try {
            // For demo: create/login with Google account
            const email = 'demo+google_' + Date.now() + '@gmail.com';
            const user = createUser({
                name: 'Google User',
                email: email,
                password: 'google_oauth_token',
                avatar: 'https://ui-avatars.com/api/?name=Google+User&background=EA1279&color=fff'
            });

            closeAuthModal();
            showSuccessMessage(`Welcome, ${user.name}!`);

            const returnUrl = sessionStorage.getItem('authReturnUrl') || 'dashboard.html';
            sessionStorage.removeItem('authReturnUrl');
            setTimeout(() => {
                window.location.href = returnUrl;
            }, 1000);
        } catch (error) {
            console.error('Google login failed:', error);
        }
    }, 1500);
}

// Repeat similar pattern for Apple and Facebook
```

4. Update `handleLogout()` at line ~190:
```javascript
// REPLACE line 191-194 with:
function handleLogout() {
    logoutUser(); // Uses new shared.js function
    showSuccessMessage('Logged out successfully');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}
```

5. Update `checkAuthState()` at line ~197:
```javascript
// REPLACE function with:
function checkAuthState() {
    const user = getCurrentUser();
    const currentPage = window.location.pathname.split('/').pop();

    // Redirect to dashboard if already logged in and on homepage
    if (user && currentPage === 'index.html') {
        const loginButtons = document.querySelectorAll('[onclick*="openAuthModal"]');
        loginButtons.forEach(btn => {
            btn.setAttribute('onclick', "window.location.href='dashboard.html'");
            btn.textContent = 'Dashboard';
        });
    }

    // Protect dashboard page
    if (currentPage === 'dashboard.html' && !user) {
        sessionStorage.setItem('authReturnUrl', 'dashboard.html');
        window.location.href = 'index.html';
        // Show auth modal after redirect
        setTimeout(() => {
            if (typeof openAuthModal === 'function') {
                openAuthModal('login');
            }
        }, 500);
    }

    // Update user display if logged in
    if (user) {
        updateUserDisplay(user);
    }
}
```

---

### Step 2: Update Celebrity Profile Page
**File**: `celebrity-profile.html`

**Find the inline script** (around line 1100-1300) and add at the top:

```javascript
// Get celebrity name from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const celebrityName = urlParams.get('name');

if (!celebrityName) {
    // Redirect to browse if no celebrity specified
    window.location.href = 'browse.html';
}

// Load celebrity data from shared.js CELEBRITIES array
const celebrity = getCelebrityByName(celebrityName);

if (!celebrity) {
    // Celebrity not found - show error or redirect
    document.body.innerHTML = `
        <div style="text-align: center; padding: 100px 20px;">
            <h1>Celebrity Not Found</h1>
            <p>Sorry, we couldn't find that celebrity.</p>
            <a href="browse.html" class="btn btn-primary">Browse All Celebrities</a>
        </div>
    `;
} else {
    // Populate page with real celebrity data
    document.getElementById('celebrityNameHero').textContent = celebrity.name;
    document.getElementById('celebrityCategory').textContent = celebrity.category;
    document.getElementById('celebrityLocation').textContent = celebrity.location;
    document.getElementById('celebrityPrice').textContent = formatPrice(celebrity.price);

    // Generate and display testimonials
    const testimonials = generateTestimonialsForCelebrity(celebrity.name);
    // Populate testimonials section...

    // Update all "Request to book" buttons to pass celebrity data
    document.querySelectorAll('.request-booking-btn').forEach(btn => {
        btn.onclick = function() {
            // Save celebrity to booking context
            saveCurrentBooking({
                celebrityName: celebrity.name,
                category: celebrity.category,
                price: celebrity.price,
                location: celebrity.city
            });

            // Check if user is logged in
            if (!isAuthenticated()) {
                sessionStorage.setItem('authReturnUrl', `booking.html?celebrity=${encodeURIComponent(celebrity.name)}`);
                openAuthModal('login');
                return;
            }

            // Redirect to booking
            window.location.href = `booking.html?celebrity=${encodeURIComponent(celebrity.name)}`;
        };
    });
}
```

---

### Step 3: Update Booking Flow
**File**: `booking.html`

**At the top of inline script** (around line 150-200):

```javascript
// On page load, check for celebrity context
document.addEventListener('DOMContentLoaded', function() {
    // Require authentication
    if (!requireAuth()) {
        return;
    }

    // Get celebrity from URL or current booking
    const urlParams = new URLSearchParams(window.location.search);
    const celebrityNameFromUrl = urlParams.get('celebrity');

    let currentBookingData = getCurrentBooking();

    if (celebrityNameFromUrl) {
        const celebrity = getCelebrityByName(celebrityNameFromUrl);
        if (celebrity) {
            currentBookingData = {
                celebrityName: celebrity.name,
                category: celebrity.category,
                price: celebrity.price,
                location: celebrity.city
            };
            saveCurrentBooking(currentBookingData);
        }
    }

    if (!currentBookingData || !currentBookingData.celebrityName) {
        // No celebrity context - redirect to browse
        alert('Please select a celebrity first');
        window.location.href = 'browse.html';
        return;
    }

    // Display celebrity info throughout booking
    document.getElementById('bookingCelebrityName').textContent = currentBookingData.celebrityName;
    document.getElementById('bookingPrice').textContent = formatPrice(currentBookingData.price);
});
```

**Update Step Navigation**:

Find `nextStep()` function and update to save data:

```javascript
function nextStep() {
    const currentStepData = {};

    // Step 1: Date/Time/Location
    if (currentStep === 1) {
        currentStepData.date = document.getElementById('selectedDate').value;
        currentStepData.time = document.getElementById('selectedTime').value;
        currentStepData.location = document.getElementById('selectedLocation').value;

        if (!currentStepData.date || !currentStepData.time || !currentStepData.location) {
            alert('Please select date, time, and location');
            return;
        }
    }

    // Step 3: Application
    if (currentStep === 3) {
        currentStepData.occupation = document.getElementById('occupation').value;
        currentStepData.hometown = document.getElementById('hometown').value;
        currentStepData.whyMeet = document.getElementById('whyMeet').value;
        currentStepData.topics = document.getElementById('topics').value;

        // Validation
        if (!currentStepData.occupation || !currentStepData.hometown) {
            alert('Please fill in all required fields');
            return;
        }

        if (currentStepData.whyMeet.length < 50) {
            alert('Please provide at least 50 characters for why you want to meet');
            return;
        }
    }

    // Save to current booking
    const bookingData = getCurrentBooking();
    saveCurrentBooking({ ...bookingData, ...currentStepData });

    // Continue to next step
    if (currentStep < 5) {
        currentStep++;
        updateStepDisplay();
    }
}
```

**Update final submission** (Step 5):

```javascript
function submitBooking() {
    const bookingData = getCurrentBooking();

    try {
        // Create the booking
        const booking = createBooking(bookingData);

        // Clear temporary booking data
        clearCurrentBooking();

        // Show success and redirect to dashboard
        alert('Booking request submitted successfully!');
        window.location.href = 'dashboard.html?tab=bookings&status=pending';
    } catch (error) {
        alert('Error creating booking: ' + error.message);
    }
}
```

---

### Step 4: Update Dashboard
**File**: `dashboard.html`

**Add at top of inline script**:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Require authentication
    if (!requireAuth()) {
        return;
    }

    // Load user data
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // Display user info
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;

    // Load bookings
    loadBookings();

    // Load favorites
    loadFavorites();

    // Check URL for tab parameter
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab) {
        switchTab(tab);
    }
});

function loadBookings() {
    const bookings = getBookings();
    const bookingsContainer = document.getElementById('bookingsContainer');

    if (bookings.length === 0) {
        bookingsContainer.innerHTML = '<p>No bookings yet. <a href="browse.html">Browse celebrities</a></p>';
        return;
    }

    bookingsContainer.innerHTML = bookings.map(booking => `
        <div class="booking-card">
            <h3>${booking.celebrityName}</h3>
            <p>Date: ${formatDate(booking.date)}</p>
            <p>Time: ${booking.time}</p>
            <p>Location: ${booking.location}</p>
            <p>Status: <span class="status-${booking.status}">${booking.status.toUpperCase()}</span></p>
            <p>Price: ${formatPrice(booking.price)}</p>
        </div>
    `).join('');
}

function loadFavorites() {
    const favoriteCelebrities = getFavorites();
    const favoritesContainer = document.getElementById('favoritesContainer');

    if (favoriteCelebrities.length === 0) {
        favoritesContainer.innerHTML = '<p>No favorites yet.</p>';
        return;
    }

    // Get full celebrity data for favorites
    const celebrities = favoriteCelebrities.map(name => getCelebrityByName(name)).filter(Boolean);

    favoritesContainer.innerHTML = celebrities.map(celeb => `
        <div class="celebrity-card" onclick="window.location.href='celebrity-profile.html?name=${encodeURIComponent(celeb.name)}'">
            <div class="celebrity-avatar">${getInitials(celeb.name)}</div>
            <h4>${celeb.name}</h4>
            <p>${celeb.category}</p>
            <p>${formatPrice(celeb.price)}</p>
        </div>
    `).join('');
}
```

---

### Step 5: Update Browse Page
**File**: `browse.html`

**Add at top of inline script**:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    loadCelebrities();

    // Handle URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const search = urlParams.get('search');

    if (category) {
        filterByCategory(category);
    }

    if (search) {
        searchCelebrities(search);
        document.getElementById('searchInput').value = search;
    }
});

function loadCelebrities() {
    const celebrities = getAllCelebrities();
    displayCelebrities(celebrities);
}

function displayCelebrities(celebrities) {
    const container = document.getElementById('celebritiesGrid');

    if (celebrities.length === 0) {
        container.innerHTML = '<p>No celebrities found.</p>';
        return;
    }

    container.innerHTML = celebrities.map(celeb => `
        <div class="celebrity-card" onclick="window.location.href='celebrity-profile.html?name=${encodeURIComponent(celeb.name)}'">
            <div class="celebrity-avatar" style="background: ${getColorForCelebrity(celeb.name)}">
                ${getInitials(celeb.name)}
            </div>
            <div class="celebrity-info">
                <h3>${celeb.name}</h3>
                <p class="category">${celeb.category}</p>
                <p class="location">${celeb.location}</p>
                <p class="price">${formatPrice(celeb.price)}</p>
                ${celeb.verified ? '<span class="verified-badge">✓</span>' : ''}
            </div>
        </div>
    `).join('');
}

function filterByCategory(category) {
    const celebrities = getCelebritiesByCategory(category);
    displayCelebrities(celebrities);

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === category);
    });
}

function searchCelebrities(query) {
    const allCelebrities = getAllCelebrities();
    const filtered = allCelebrities.filter(celeb =>
        celeb.name.toLowerCase().includes(query.toLowerCase()) ||
        celeb.category.toLowerCase().includes(query.toLowerCase())
    );
    displayCelebrities(filtered);
}
```

---

### Step 6: Update Homepage
**File**: `index.html`

**Replace hardcoded celebrities array** with CELEBRITIES from shared.js:

Find the inline celebrities array (around line 285) and **DELETE IT ENTIRELY**.

Then add this at the top of the script section:

```javascript
// Use CELEBRITIES from shared.js
document.addEventListener('DOMContentLoaded', function() {
    loadTopTen();
    loadQuickMeets();
    loadReviews();
});

function loadTopTen() {
    // Get trending celebrities
    const trending = CELEBRITIES.filter(c => c.trending).slice(0, 10);
    const container = document.getElementById('topTenCarousel');

    container.innerHTML = trending.map(celeb => `
        <div class="celebrity-card" onclick="window.location.href='celebrity-profile.html?name=${encodeURIComponent(celeb.name)}'">
            <div class="celebrity-avatar" style="background: ${getColorForCelebrity(celeb.name)}">
                ${getInitials(celeb.name)}
            </div>
            <h4>${celeb.name}</h4>
            <p>${celeb.category}</p>
            <p>${formatPrice(celeb.price)}</p>
            ${celeb.verified ? '<span class="verified-badge">✓</span>' : ''}
        </div>
    `).join('');
}

function loadQuickMeets() {
    // Get celebrities by location or random selection
    const quickMeets = CELEBRITIES.slice(0, 8);
    const container = document.getElementById('quickMeetsCarousel');

    container.innerHTML = quickMeets.map(celeb => `
        <div class="celebrity-card" onclick="window.location.href='celebrity-profile.html?name=${encodeURIComponent(celeb.name)}'">
            <div class="celebrity-avatar" style="background: ${getColorForCelebrity(celeb.name)}">
                ${getInitials(celeb.name)}
            </div>
            <h4>${celeb.name}</h4>
            <p>${celeb.location}</p>
            <p>${formatPrice(celeb.price)}</p>
        </div>
    `).join('');
}

// Update search functionality
function handleSearch(event) {
    event.preventDefault();
    const query = document.getElementById('searchInput').value;
    if (query) {
        window.location.href = `browse.html?search=${encodeURIComponent(query)}`;
    }
}
```

---

## Testing Checklist

After implementation, test these flows:

1. **Signup Flow**:
   - [ ] Visit homepage → Click "Log in" → Switch to signup
   - [ ] Fill form with valid data → Submit
   - [ ] Verify user created in localStorage
   - [ ] Verify redirected to dashboard
   - [ ] Verify user name appears in dashboard

2. **Login Flow**:
   - [ ] Logout → Click "Log in"
   - [ ] Enter credentials → Submit
   - [ ] Verify redirected to dashboard

3. **Celebrity Browse**:
   - [ ] Visit browse page
   - [ ] Verify all CELEBRITIES array items displayed
   - [ ] Click category filter → Verify filtering works
   - [ ] Use search → Verify search works

4. **Celebrity Profile**:
   - [ ] Click celebrity card from browse
   - [ ] Verify correct celebrity data loaded
   - [ ] Verify testimonials generated
   - [ ] Verify price displayed correctly

5. **Booking Flow**:
   - [ ] From celebrity profile → Click "Request to book"
   - [ ] Complete all 5 steps
   - [ ] Submit booking
   - [ ] Verify booking created in localStorage
   - [ ] Verify redirected to dashboard
   - [ ] Verify booking appears in "My Bookings"

6. **Favorites**:
   - [ ] Add celebrity to favorites (implement heart button)
   - [ ] Go to dashboard → Favorites tab
   - [ ] Verify celebrity appears in favorites

7. **Session Persistence**:
   - [ ] Login → Refresh page
   - [ ] Verify still logged in
   - [ ] Close tab → Reopen → Visit dashboard
   - [ ] Verify still logged in

8. **Data Persistence**:
   - [ ] Create booking → Logout → Login
   - [ ] Verify booking still there
   - [ ] Add favorite → Logout → Login
   - [ ] Verify favorite still there

---

## Commit Plan

After implementation and testing:

```bash
git add -A
git commit -m "feat: Full-stack MVP integration with localStorage database

- Integrated data management system across all pages
- Auth system now creates real user accounts
- Celebrity profiles load dynamic data from CELEBRITIES array
- Booking flow saves real bookings to localStorage
- Dashboard displays real user bookings and favorites
- Browse page implements real filtering and search
- Homepage uses CELEBRITIES array instead of hardcoded data
- All data persists across sessions via localStorage

New Features:
- User signup/login with localStorage persistence
- Complete booking flow with data persistence
- Favorites system
- Search and category filtering
- Session management
- Protected routes

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main
```

---

## Success Criteria

✅ All features work end-to-end without data loss
✅ Data persists across page refreshes and sessions
✅ No hardcoded demo data remains
✅ All celebrity data comes from CELEBRITIES array
✅ Users can complete full booking journey
✅ Dashboard shows accurate real-time data

---

**Next Session**: Execute these changes systematically, test each component, and commit
