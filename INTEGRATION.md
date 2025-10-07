# StarryMeet Website Integration Guide

## Overview
This document explains how all 10 pages of StarryMeet work together as a cohesive, functional website.

## Files Created

### Shared Resources
- **`js/shared.js`** - Common JavaScript functions, celebrity data, and utilities
- **`css/shared.css`** - Shared CSS styles, variables, and components
- **`404.html`** - Custom 404 error page

## Integration Components

### 1. Shared JavaScript (`js/shared.js`)

#### Celebrity Data
- **35 celebrities** with complete information (name, category, location, price, etc.)
- Accessible via `CELEBRITIES` array or `getAllCelebrities()` function

#### Core Utility Functions

**Celebrity Functions:**
```javascript
getCelebrityByName(name)           // Find celebrity by name
getAllCelebrities()                // Get all celebrities
getCelebritiesByCategory(category) // Filter by category
getInitials(name)                  // Get initials (e.g., "EW")
getColorForCelebrity(name)         // Get consistent gradient color
```

**Formatting Functions:**
```javascript
formatPrice(price)     // Format as currency: "$5,000"
formatDate(date)       // Format date: "March 15, 2025"
getURLParameter(param) // Extract URL parameter value
navigateToPage(page, params) // Navigate with parameters
```

**LocalStorage Functions:**
```javascript
saveToWatchlist(name)         // Add to watchlist
removeFromWatchlist(name)     // Remove from watchlist
getWatchlist()                // Get all saved celebrities
isInWatchlist(name)           // Check if celebrity is saved
clearWatchlist()              // Clear all saved

getUserProfile()              // Get user profile
saveUserProfile(profile)      // Save user profile
getBookings()                 // Get all bookings
saveBooking(booking)          // Save new booking
```

**UI Helper Functions:**
```javascript
showLoading(elementId)        // Show loading spinner
showError(message, elementId) // Show error message
showSuccessMessage(message)   // Show success toast
toggleMobileMenu()            // Toggle mobile menu
closeMobileMenu()             // Close mobile menu
```

### 2. Shared CSS (`css/shared.css`)

#### CSS Variables
All pages use consistent color scheme:
```css
--purple: #6B46C1
--purple-dark: #553C9A
--purple-light: #8B5CF6
--gold: #D4AF37
--green: #10B981
--red: #EF4444
/* Plus grays, spacing, shadows, etc. */
```

#### Common Components
- **Buttons**: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`
- **Cards**: `.card`, `.card-body`, `.card-header`
- **Forms**: `.form-group`, `.form-input`, `.form-label`, `.form-error`
- **Badges**: `.badge`, `.badge-primary`, `.badge-success`
- **Utilities**: `.text-center`, `.mt-4`, `.mb-3`, `.flex`, `.hidden`

#### Mobile Menu Styles
- `.mobile-menu` - Slide-in menu from right
- `.mobile-menu-overlay` - Dark overlay
- `.hamburger-btn` - Hamburger icon (shows on mobile)

### 3. LocalStorage Schema

#### Watchlist
```javascript
Key: 'starryMeetWatchlist'
Value: ["Emma Watson", "Chris Hemsworth", ...]
```

#### User Profile
```javascript
Key: 'starryMeetUser'
Value: {
  name: "John Smith",
  email: "john@example.com",
  phone: "+1 555 123 4567",
  photo: null
}
```

#### Bookings
```javascript
Key: 'starryMeetBookings'
Value: [{
  id: 1234567890,
  celebrity: "Emma Watson",
  date: "2025-03-15",
  time: "2:00 PM",
  type: "Standard Session",
  price: 7500,
  status: "confirmed",
  timestamp: "2025-03-01T10:30:00Z"
}, ...]
```

## Page-to-Page Data Flow

### 1. Homepage → Browse
```
index.html → browse.html
- Category cards pass: ?category=Hollywood
- Search passes: ?query=emma
```

### 2. Browse → Celebrity Profile
```
browse.html → celebrity-profile.html?name=Emma+Watson
- Passes celebrity name via URL parameter
- Profile loads data using getCelebrityByName()
```

### 3. Celebrity Profile → Booking
```
celebrity-profile.html → booking.html?celebrity=Emma+Watson&type=standard
- Passes celebrity name and meeting type
- Booking flow pre-fills data
```

### 4. Booking → Confirmation → Dashboard
```
booking.html (step 5) → saveBooking() → dashboard.html
- Booking saved to localStorage
- Dashboard reads from getBookings()
```

### 5. Save to Watchlist
```
Any page → saveToWatchlist(name) → localStorage
- Dashboard reads from getWatchlist()
- All pages check isInWatchlist() for heart icon state
```

## Implementation Guide

### To Integrate a Page:

1. **Add shared resources to `<head>`:**
```html
<link rel="stylesheet" href="css/shared.css">
<script src="js/shared.js"></script>
```

2. **Add mobile menu to navbar:**
```html
<nav>
  <div class="nav-container">
    <a href="index.html" class="logo">✨ StarryMeet</a>
    <button class="hamburger-btn" onclick="toggleMobileMenu()">☰</button>
    <ul class="nav-links">
      <li><a href="browse.html">Browse</a></li>
      <li><a href="how-it-works.html">How It Works</a></li>
      <!-- ... -->
    </ul>
  </div>
</nav>

<!-- Mobile Menu -->
<div class="mobile-menu-overlay" id="mobileMenuOverlay" onclick="closeMobileMenu()"></div>
<div class="mobile-menu" id="mobileMenu">
  <div class="mobile-menu-header">
    <span class="logo">✨ StarryMeet</span>
    <button class="mobile-menu-close" onclick="closeMobileMenu()">×</button>
  </div>
  <ul class="mobile-menu-links">
    <li><a href="index.html" onclick="closeMobileMenu()">Home</a></li>
    <li><a href="browse.html" onclick="closeMobileMenu()">Browse</a></li>
    <!-- ... -->
  </ul>
</div>
```

3. **Use shared functions:**
```javascript
// Load celebrity data
const celebrity = getCelebrityByName(getURLParameter('name'));

// Display with utilities
element.textContent = formatPrice(celebrity.price);

// Save to watchlist
saveToWatchlist(celebrity.name);
```

4. **Navigate with parameters:**
```javascript
// Go to booking page
navigateToPage('booking.html', {
  celebrity: 'Emma Watson',
  type: 'standard'
});
```

## Testing Checklist

### ✓ Navigation Flow
- [x] Homepage loads correctly
- [x] Browse page filters work
- [x] Celebrity cards link to profiles
- [x] Profile "Book Now" opens booking with parameters
- [x] Booking completion saves to localStorage
- [x] Dashboard displays saved bookings

### ✓ Data Persistence
- [x] Watchlist saves across page reloads
- [x] User profile persists
- [x] Bookings are stored correctly
- [x] LocalStorage schema is consistent

### ✓ Mobile Responsiveness
- [x] Hamburger menu appears on mobile
- [x] Mobile menu slides in/out smoothly
- [x] All pages are responsive
- [x] Touch targets are adequate

### ✓ Error Handling
- [x] Missing celebrity redirects properly
- [x] 404 page shows for invalid URLs
- [x] Empty states display correctly
- [x] Form validation works

### ✓ Cross-Browser
- [x] Works in Chrome
- [x] Works in Firefox
- [x] Works in Safari
- [x] Works on mobile browsers

## User Flows

### Flow 1: Browse and Book
```
1. Land on index.html
2. Click "Browse Celebrities"
3. Filter by category/location
4. Click celebrity card
5. View profile (celebrity-profile.html?name=Emma+Watson)
6. Click "Book Now"
7. Complete 5-step booking (booking.html)
8. Receive confirmation
9. View in dashboard
```

### Flow 2: Save and Manage Watchlist
```
1. Browse celebrities
2. Click heart icon on cards
3. Celebrity saved to localStorage
4. Go to dashboard
5. View "Saved Celebrities" tab
6. Remove or book from watchlist
```

### Flow 3: Celebrity Application
```
1. Click "For Celebrities" in nav
2. View benefits and calculator
3. Click "Apply to Join"
4. Email opens to apply@starrymeet.com
```

## File Structure
```
starrymeet/
├── index.html              # Homepage
├── browse.html             # Browse celebrities
├── celebrity-profile.html  # Individual profiles
├── booking.html            # 5-step booking flow
├── dashboard.html          # User dashboard
├── how-it-works.html       # Process explanation
├── about.html              # Company info
├── for-celebrities.html    # Celebrity onboarding
├── faq.html                # FAQ page
├── contact.html            # Contact form
├── 404.html                # Error page
├── js/
│   └── shared.js           # Shared JavaScript
├── css/
│   └── shared.css          # Shared CSS
└── INTEGRATION.md          # This file
```

## Deployment Checklist

- [x] All 10 HTML pages created
- [x] Shared JS and CSS files created
- [x] 404 error page created
- [x] LocalStorage schema defined
- [x] Data flow documented
- [x] Mobile menu implemented
- [x] URL parameters working
- [x] All internal links functional
- [x] Watchlist functionality working
- [x] Booking flow complete

## Next Steps (Optional Enhancements)

1. **Backend Integration:**
   - Connect to real API for celebrity data
   - Implement real payment processing (Stripe)
   - Set up user authentication system

2. **Advanced Features:**
   - Email notifications
   - Calendar integration (.ics downloads)
   - Video call option for remote meetings
   - Gift certificate system
   - Referral program

3. **Performance:**
   - Image optimization (use WebP)
   - Lazy loading for images
   - Code minification
   - CDN for static assets

4. **Analytics:**
   - Google Analytics integration
   - Conversion tracking
   - User behavior analysis
   - A/B testing setup

## Support

For questions about integration, refer to:
- `js/shared.js` - All available functions documented
- `css/shared.css` - All available styles documented
- This file - Overall integration guide

---

**StarryMeet** - Connecting fans with their icons
Version 1.0 - Ready for deployment
