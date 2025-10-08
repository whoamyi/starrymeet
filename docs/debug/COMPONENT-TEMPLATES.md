# Reusable Component Templates

**Project**: StarryMeet
**Purpose**: Standardized components for consistency across all pages
**Last Updated**: 2025-10-08

---

## 🎯 Usage Instructions

1. These templates should be extracted from the actual pages
2. Once extracted, ALL pages must conform to these templates
3. Any deviations should be documented and justified
4. Update this file when making approved changes to shared components

---

## 📋 Component Inventory

### Components to Standardize:
1. ✅ Header (with navigation)
2. ✅ Footer
3. ✅ Mobile Navigation Menu
4. ✅ Meta Tags (SEO)
5. ✅ CSS/JS Imports
6. ✅ Social Media Links
7. ✅ Call-to-Action Buttons

---

## 🎨 1. Standard Header Template

**Location**: Top of `<body>` on all pages
**File Reference**: Extracted from index.html:852-866

```html
<!-- Navigation -->
<nav>
    <div class="nav-container">
        <a href="index.html" class="logo">✨ StarryMeet</a>
        <button class="hamburger-btn" onclick="toggleMobileMenu()">☰</button>
        <ul class="nav-links">
            <li><a href="browse.html">Browse</a></li>
            <li><a href="how-it-works.html">How It Works</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="for-celebrities.html">For Celebrities</a></li>
            <li><a href="faq.html">FAQ</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="dashboard.html" class="btn-signin">Dashboard</a></li>
        </ul>
    </div>
</nav>
```

**Required Features**:
- [x] Responsive design (mobile, tablet, desktop)
- [x] Mobile hamburger menu button
- [ ] Active page indicator (needs to be added per page)
- [ ] Accessible navigation (ARIA labels needed)
- [x] Consistent styling across all pages
- [x] Logo links to homepage

---

## 🎨 2. Standard Footer Template

**Location**: Bottom of `<body>` on all pages before closing scripts
**File Reference**: Extracted from index.html:1064-1106

```html
<!-- Footer -->
<footer>
    <div class="footer-container">
        <div class="footer-section">
            <h3>StarryMeet</h3>
            <ul>
                <li><a href="about.html">About Us</a></li>
                <li><a href="how-it-works.html">How It Works</a></li>
                <li><a href="for-celebrities.html">For Celebrities</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>
        </div>
        <div class="footer-section">
            <h3>Support</h3>
            <ul>
                <li><a href="faq.html">FAQ</a></li>
                <li><a href="contact.html">Help Center</a></li>
                <li><a href="terms.html">Terms of Service</a></li>
                <li><a href="privacy.html">Privacy Policy</a></li>
            </ul>
        </div>
        <div class="footer-section">
            <h3>Discover</h3>
            <ul>
                <li><a href="browse.html">Browse Celebrities</a></li>
                <li><a href="browse.html?category=Hollywood">Hollywood Stars</a></li>
                <li><a href="browse.html?category=Musicians">Musicians</a></li>
                <li><a href="browse.html?category=Athletes">Athletes</a></li>
            </ul>
        </div>
        <div class="footer-section">
            <h3>Connect</h3>
            <ul>
                <li><a href="https://instagram.com/starrymeet" target="_blank" rel="noopener">Instagram</a></li>
                <li><a href="https://twitter.com/starrymeet" target="_blank" rel="noopener">Twitter</a></li>
                <li><a href="https://facebook.com/starrymeet" target="_blank" rel="noopener">Facebook</a></li>
                <li><a href="https://linkedin.com/company/starrymeet" target="_blank" rel="noopener">LinkedIn</a></li>
            </ul>
        </div>
    </div>
    <div class="footer-bottom">
        <p>&copy; 2025 StarryMeet. All rights reserved.</p>
    </div>
</footer>
```

**Required Features**:
- [x] Consistent layout across all pages
- [x] All links functional
- [x] Social media links with `target="_blank"` and `rel="noopener"`
- [x] Current year in copyright (2025)
- [x] Responsive design

---

## 🎨 3. Mobile Navigation Template

**Location**: After main `<nav>` element
**File Reference**: Extracted from index.html:868-887

```html
<!-- Mobile Menu Overlay -->
<div class="mobile-menu-overlay" id="mobileMenuOverlay" onclick="closeMobileMenu()"></div>

<!-- Mobile Menu -->
<div class="mobile-menu" id="mobileMenu">
    <div class="mobile-menu-header">
        <span class="logo">✨ StarryMeet</span>
        <button class="mobile-menu-close" onclick="closeMobileMenu()">×</button>
    </div>
    <ul class="mobile-menu-links">
        <li><a href="index.html" onclick="closeMobileMenu()">Home</a></li>
        <li><a href="browse.html" onclick="closeMobileMenu()">Browse</a></li>
        <li><a href="how-it-works.html" onclick="closeMobileMenu()">How It Works</a></li>
        <li><a href="about.html" onclick="closeMobileMenu()">About</a></li>
        <li><a href="for-celebrities.html" onclick="closeMobileMenu()">For Celebrities</a></li>
        <li><a href="faq.html" onclick="closeMobileMenu()">FAQ</a></li>
        <li><a href="contact.html" onclick="closeMobileMenu()">Contact</a></li>
        <li><a href="dashboard.html" onclick="closeMobileMenu()">Dashboard</a></li>
    </ul>
</div>
```

**JavaScript Functions Required** (from shared.js):
```javascript
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    if (menu) {
        menu.classList.toggle('show');
        if (overlay) overlay.classList.toggle('show');
    }
}

function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    if (menu) {
        menu.classList.remove('show');
        if (overlay) overlay.classList.remove('show');
    }
}
```

**Required Features**:
- [x] Smooth animation
- [x] Touch-friendly targets
- [ ] Accessible (keyboard navigation needs ARIA)
- [x] Proper z-index layering
- [x] Overlay backdrop for closing

---

## 🎨 4. Standard Meta Tags Template

**Location**: `<head>` section of all pages
**File Reference**: Extracted from index.html:3-8

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>[PAGE SPECIFIC TITLE] - StarryMeet</title>
<link rel="stylesheet" href="css/shared.css">
<script src="js/shared.js"></script>
```

**Page-Specific Titles**:
- `index.html`: "StarryMeet - Meet Your Icons In Person"
- `browse.html`: "Browse Celebrities - StarryMeet"
- `celebrity-profile.html`: "[Celebrity Name] - StarryMeet"
- `booking.html`: "Book Meeting - StarryMeet"
- `dashboard.html`: "Dashboard - StarryMeet"
- `how-it-works.html`: "How It Works - StarryMeet"
- `about.html`: "About Us - StarryMeet"
- `for-celebrities.html`: "For Celebrities - StarryMeet"
- `faq.html`: "FAQ - StarryMeet"
- `contact.html`: "Contact Us - StarryMeet"
- `terms.html`: "Terms of Service - StarryMeet"
- `privacy.html`: "Privacy Policy - StarryMeet"
- `404.html`: "Page Not Found - StarryMeet"

**Required Features**:
- [x] Unique title per page
- [ ] Meta description needed (not present)
- [x] Proper viewport settings
- [ ] Social media preview tags needed (OG tags, Twitter cards)
- [ ] Favicon needed

---

## 🎨 5. Standard CSS/JS Imports

**Location**: `<head>` for CSS, before `</body>` for JS
**File Reference**: To be standardized

### CSS Imports (in `<head>`):
```html
<!-- To be extracted and standardized -->
<!-- Expected:
  - shared.css
  - page-specific CSS (if needed)
  - Font imports
  - Icon libraries
-->
```

### JS Imports (before `</body>`):
```html
<!-- To be extracted and standardized -->
<!-- Expected:
  - shared.js
  - page-specific JS (if needed)
  - Third-party libraries (jQuery, etc.)
  - Analytics scripts
-->
```

---

## 🎨 6. Social Media Links Template

**Location**: Usually in footer
**File Reference**: To be standardized

```html
<!-- SOCIAL MEDIA LINKS - TO BE EXTRACTED -->
<!-- Expected platforms:
  - Facebook
  - Twitter/X
  - Instagram
  - LinkedIn
  - YouTube
  - TikTok
-->
```

**Required Features**:
- [ ] Consistent icons across all pages
- [ ] Working links (or # placeholders)
- [ ] `target="_blank"` and `rel="noopener noreferrer"`
- [ ] ARIA labels for accessibility

---

## 🎨 7. Call-to-Action Button Template

**Location**: Various throughout pages
**File Reference**: To be standardized

```html
<!-- CTA BUTTON STANDARD - TO BE EXTRACTED -->
<!-- Expected variants:
  - Primary CTA (e.g., "Get Started", "Book Now")
  - Secondary CTA (e.g., "Learn More")
  - Ghost/Outline CTA
-->
```

**Required Features**:
- [ ] Consistent styling
- [ ] Hover/active states
- [ ] Accessible (proper contrast, keyboard focus)
- [ ] Responsive sizing

---

## 📝 Shared CSS Classes

### Documented from css/shared.css:

**CSS Variables** (available on `:root`):
- Colors: `--purple`, `--purple-dark`, `--purple-light`, `--gold`, `--green`, `--yellow`, `--red`, `--white`, `--gray-50` through `--gray-900`
- Spacing: `--spacing-xs` through `--spacing-3xl`
- Border Radius: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-full`
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- Transitions: `--transition`

**Button Classes**:
- `.btn` - Base button style
- `.btn-primary` - Purple gradient button
- `.btn-secondary` - Gray button
- `.btn-outline` - Outline button
- `.btn-success` - Green button
- `.btn-signin` - Navigation signin button
- `.btn-lg`, `.btn-sm` - Size modifiers

**Card Classes**:
- `.card` - Base card container
- `.card-body` - Card content area
- `.card-header` - Card header section

**Form Classes**:
- `.form-group` - Form field wrapper
- `.form-label` - Field label
- `.form-input` - Text input
- `.form-select` - Select dropdown
- `.form-textarea` - Textarea
- `.form-error` - Error message
- `.form-hint` - Help text

**Badge Classes**:
- `.badge` - Base badge
- `.badge-primary`, `.badge-success`, `.badge-warning`, `.badge-danger`, `.badge-secondary`

**Utility Classes**:
- Text alignment: `.text-center`, `.text-left`, `.text-right`
- Margins: `.mt-0` through `.mt-4`, `.mb-0` through `.mb-4`
- Padding: `.p-0` through `.p-4`
- Flexbox: `.flex`, `.flex-col`, `.items-center`, `.justify-center`, `.justify-between`
- Gaps: `.gap-1`, `.gap-2`, `.gap-3`
- Visibility: `.hidden`, `.visible`
- Font weights: `.fw-bold`, `.fw-semibold`, `.fw-normal`
- Text colors: `.text-purple`, `.text-gold`, `.text-gray`, `.text-white`
- Backgrounds: `.bg-purple`, `.bg-gray-50`, `.bg-white`

**Loading Classes**:
- `.spinner` - Loading spinner
- `.loading-container` - Centered loading wrapper

**Meeting Types** (booking.html specific):
- `.meeting-types-container` - Layout for meeting type cards
- `.meeting-type-card` - Individual meeting type
- `.meeting-type-card.popular` - Highlighted popular option
- `.meeting-type-card.selected` - Selected state

---

## 📝 Shared JavaScript Functions

### Documented from js/shared.js:

**Data Constants**:
- `CELEBRITIES` - Array of 42 celebrity objects with properties: name, category, location, city, country, price, verified, trending
- `COLOR_PALETTES` - Array of 10 gradient color schemes for avatars

**Celebrity Data Functions**:
- `getCelebrityByName(name)` - Find celebrity by exact name match
- `getAllCelebrities()` - Get copy of all celebrities array
- `getCelebritiesByCategory(category)` - Filter celebrities by category

**Utility Functions**:
- `getInitials(name)` - Extract initials from name (max 2 chars)
- `getColorForCelebrity(name)` - Get consistent gradient color for celebrity
- `formatPrice(price)` - Format number as currency ($X,XXX)
- `formatDate(date)` - Format date to readable string
- `getURLParameter(param)` - Extract URL parameter value
- `navigateToPage(page, params)` - Navigate with query parameters

**LocalStorage Functions**:
- `saveToWatchlist(celebrityName)` - Add celebrity to watchlist
- `removeFromWatchlist(celebrityName)` - Remove from watchlist
- `getWatchlist()` - Get all watchlist celebrity names
- `isInWatchlist(celebrityName)` - Check if celebrity in watchlist
- `clearWatchlist()` - Remove all from watchlist
- `getUserProfile()` - Get user profile object
- `saveUserProfile(profile)` - Save user profile
- `getBookings()` - Get all booking objects
- `saveBooking(booking)` - Save new booking with timestamp

**UI Helper Functions**:
- `showLoading(elementId)` - Display loading spinner in element
- `showError(message, elementId)` - Display error message
- `showSuccessMessage(message)` - Show toast notification (3s auto-hide)
- `toggleMobileMenu()` - Toggle mobile menu visibility
- `closeMobileMenu()` - Close mobile menu
- `handleMessageClick()` - Navigate to messages (requires auth + booking)
- `generateTestimonialsForCelebrity(celebrityName)` - Generate 3 unique testimonials

**Usage Notes**:
- All functions are globally available (attached to window)
- Celebrity data is seeded and consistent across sessions
- LocalStorage keys: `starryMeetWatchlist`, `starryMeetUser`, `starryMeetBookings`
- Mobile menu functions require elements: `#mobileMenu`, `#mobileMenuOverlay`

---

## 🔄 Extraction Process

### Completed Steps:
1. ✅ Read index.html to extract header template
2. ✅ Read index.html to extract footer template
3. ✅ Read index.html to extract mobile navigation template
4. ✅ Read index.html to extract meta tags structure
5. ✅ Read shared.css to document common classes
6. ✅ Read shared.js to document common functions
7. ✅ Updated this file with actual templates
8. 🔜 Next: Verify templates against other pages during debugging

### Variations Log:
Document any necessary deviations from templates:
- **Page**: [page name]
- **Component**: [header/footer/etc]
- **Variation**: [what's different]
- **Reason**: [why it's different]
- **Approved**: [yes/no]

---

## ✅ Consistency Checklist

Before marking a page as complete, verify:
- [ ] Header matches template exactly
- [ ] Footer matches template exactly
- [ ] Mobile navigation matches template
- [ ] Meta tags follow standard (with unique content)
- [ ] CSS/JS imports match standard
- [ ] Social media links match template
- [ ] CTAs use standard button classes
- [ ] No inline styles (unless absolutely necessary)
- [ ] Consistent spacing and layout
- [ ] Same color scheme throughout

---

## 📌 Notes

- This is a living document - update as needed
- All changes to templates must be documented
- Consistency is key to maintainability
- When in doubt, refer to the most recently debugged page
