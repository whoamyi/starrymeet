# Quick Reference Guide - StarryMeet

**Purpose**: Rapid lookup for common tasks and information
**Last Updated**: 2025-10-09

---

## 🚀 Quick Start

### Most Important Files
```
booking.html          - Core booking flow (2300+ lines)
celebrity-profile.html - Triggers booking with URL params
browse.html           - Celebrity discovery page
index.html            - Homepage entry point
js/shared.js          - All celebrity data & shared functions
```

### Most Important Docs
```
docs/SITE-ARCHITECTURE.md                   - Page interactions & data flow
docs/COMPLETE-PROJECT-SUMMARY.md            - Full project overview
docs/debug/README.md                        - Debug documentation structure
docs/debug/DEBUG-LOG.md                     - All 45 issues chronologically
docs/debug/pages/booking/BOOKING-INTEGRATION.md - Critical integration details
```

---

## 📄 All 13 Pages at a Glance

| # | Page | Purpose | Priority | Issues Fixed | Key Features |
|---|------|---------|----------|--------------|--------------|
| 1 | index.html | Homepage | HIGH | 8 | Hero, featured celebrities, CTAs |
| 2 | browse.html | Celebrity browsing | HIGH | 5 | Filters, search, 12 celebrity cards |
| 3 | celebrity-profile.html | Celebrity details | HIGH | 5 | Bio, pricing, booking dropdown |
| 4 | booking.html | 5-step booking | HIGH | 11 | **CRITICAL** Pre-selection integration |
| 5 | dashboard.html | User account | MEDIUM | 11 | Sidebar, bookings, favorites, messages, settings |
| 6 | how-it-works.html | Platform guide | MEDIUM | 4 | 4-step process, benefits |
| 7 | about.html | Company info | MEDIUM | 4 | Story, mission, values, stats |
| 8 | for-celebrities.html | Celebrity recruitment | MEDIUM | 4 | Benefits, calculator, testimonials |
| 9 | faq.html | Q&A | LOW | 4 | 5 categories, 25 questions |
| 10 | contact.html | Contact form | LOW | 4 | Form, email, phone, address |
| 11 | terms.html | Legal terms | LOW | 4 | 13 sections, refund policy |
| 12 | privacy.html | Privacy policy | LOW | 4 | 12 sections, GDPR/CCPA |
| 13 | 404.html | Error page | LOW | 2 | Friendly message, CTAs |

---

## 🔗 Critical Integration Points

### Booking Flow (MOST IMPORTANT)
```
celebrity-profile.html
    ↓ User selects meeting type
    ↓ Clicks "Book Now"
    ↓
booking.html?celebrity=Taylor%20Swift&meetingType=standard
    ↓ initializePage() reads URL params
    ↓ requestAnimationFrame (x2) ensures DOM ready
    ↓ selectMeetingType() selects card
    ↓ Green "✓ Pre-selected" badge appears
    ↓ User completes 5 steps
    ↓
dashboard.html (confirmation)
```

**Files Involved**:
- `celebrity-profile.html` - Lines ~450-470 (bookMeeting function)
- `booking.html` - Lines 1534-1565 (pre-selection logic)
- `booking.html` - Lines 2212-2217 (DOM ready check)

**Test URL**:
```
booking.html?celebrity=Taylor%20Swift&meetingType=standard
```

---

## 🎯 URL Parameters Quick Reference

### browse.html
```
?category=Hollywood   - Filter to Hollywood stars
?category=Musicians   - Filter to musicians
?category=Athletes    - Filter to athletes
?category=Business    - Filter to business leaders
```

### celebrity-profile.html (REQUIRED)
```
?name=Taylor%20Swift  - Load specific celebrity
                       (URL encoding required for spaces)
```

### booking.html (OPTIONAL but CRITICAL)
```
?celebrity=Taylor%20Swift      - Pre-fill celebrity name
&meetingType=quick             - Pre-select Quick Meet (15 min, $2.5k)
&meetingType=standard          - Pre-select Standard (30 min, $5k)
&meetingType=premium           - Pre-select Premium (60 min, $10k)
```

---

## 📊 Celebrity Data Structure

**Location**: `js/shared.js` - `celebrityData` array

**Structure**:
```javascript
{
    name: "Taylor Swift",
    category: "Musicians",
    location: "Los Angeles, CA",
    rating: 4.9,
    reviews: 234,
    bio: "Grammy-winning singer-songwriter...",
    price: {
        quick: 2500,      // 15 min
        standard: 5000,   // 30 min
        premium: 10000    // 60 min
    },
    availability: ["2025-10-15", "2025-10-22", ...],
    verified: true
}
```

**Total Celebrities**: 12
- Hollywood: 3 (Tom Hanks, Jennifer Lawrence, Chris Hemsworth)
- Musicians: 3 (Taylor Swift, Ed Sheeran, Beyoncé)
- Athletes: 3 (LeBron James, Serena Williams, Cristiano Ronaldo)
- Business: 3 (Elon Musk, Oprah Winfrey, Warren Buffett)

---

## 💾 LocalStorage Keys

### booking.html → dashboard.html
```javascript
// Key: 'bookingData'
{
    celebrity: "Taylor Swift",
    meetingType: "standard",  // quick | standard | premium
    price: 5000,
    date: "2025-10-15",
    timeSlot: "afternoon",    // morning | afternoon | evening
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    specialRequests: "..."
}

// Key: 'bookingHistory' (array)
[{
    id: "booking-001",
    celebrity: "Taylor Swift",
    date: "2025-10-15",
    meetingType: "standard",
    status: "confirmed",       // confirmed | completed | cancelled
    price: 5000
}]

// Key: 'userData'
{
    name: "John Doe",
    email: "john@example.com",
    memberSince: "2025-01-01",
    avatar: "avatar-url.jpg"
}

// Key: 'favorites' (array)
["Taylor Swift", "Elon Musk", "LeBron James"]
```

---

## 🧩 Shared Components

### Navigation (12 pages)
**File**: Every page except 404.html
**Template**: `docs/templates/HEADER-NAV.md`
**Location**: Top of page (~lines 70-90)

**Links**:
- Logo → index.html
- Browse → browse.html
- How It Works → how-it-works.html
- About → about.html
- For Celebrities → for-celebrities.html
- FAQ → faq.html
- Contact → contact.html
- Dashboard → dashboard.html (button)

### Mobile Menu (12 pages)
**File**: Every page except 404.html
**Template**: `docs/templates/MOBILE-NAV.md`
**Location**: Hidden overlay (~lines 90-110)

**Functions** (from `js/shared.js`):
- `toggleMobileMenu()` - Opens/closes menu
- `closeMobileMenu()` - Closes menu

### Footer (12 pages)
**File**: Every page except 404.html
**Template**: `docs/templates/FOOTER.md`
**Location**: Bottom of page (last ~50 lines)

**4 Columns**:
1. StarryMeet - About, How It Works, For Celebrities, Contact
2. Support - FAQ, Help Center, Terms, Privacy
3. Discover - Browse (all + 4 filtered categories)
4. Connect - Instagram, Twitter, Facebook, LinkedIn

---

## 🔧 Key JavaScript Functions

### From js/shared.js
```javascript
// Navigation
toggleMobileMenu()           - Opens/closes mobile menu
closeMobileMenu()           - Closes mobile menu

// Celebrity Data
getCelebrityByName(name)    - Returns celebrity object
getAllCelebrities()         - Returns full celebrityData array
getCelebritiesByCategory(cat) - Filters by category

// LocalStorage
saveTolocalStorage(key, data)  - Saves data
getFromLocalStorage(key)       - Retrieves data
clearLocalStorage(key)         - Removes data
```

### From booking.html (specific to that page)
```javascript
initializePage()            - Main initialization (lines ~2200)
selectMeetingType(type)     - Selects meeting card (lines ~1600)
nextStep()                  - Advances wizard (lines ~1700)
previousStep()              - Goes back (lines ~1750)
calculateTotal()            - Computes price (lines ~1800)
processPayment()            - Handles payment (lines ~1900)
```

### From dashboard.html (specific to that page)
```javascript
toggleSidebar()             - Toggles mobile sidebar with overlay
switchTab(tabName)          - Switches between dashboard sections
loadUpcomingMeetings()      - Loads upcoming meetings
loadPastMeetings()          - Loads meeting history
loadSavedCelebrities()      - Loads watchlist
loadMessages()              - Loads chat conversations
```

### From browse.html (specific to that page)
```javascript
loadCelebrities()           - Loads all 12 celebrities
filterCelebrities(category) - Filters by category
searchCelebrities()         - Real-time search by name
navigateToProfile(name)     - Redirects to profile with param
```

---

## 🐛 Common Issues & Solutions

### Issue: Pre-selection not working
**Symptoms**: Meeting type not selected when arriving from celebrity profile
**Check**:
1. URL has `?meetingType=` parameter
2. Value is `quick`, `standard`, or `premium` (lowercase)
3. Browser console shows pre-selection logs
4. Meeting cards have rendered before selection

**Solution**: Fixed with double-buffered requestAnimationFrame (Issue #27)

---

### Issue: Celebrity profile not loading
**Symptoms**: Blank profile page or "Celebrity not found"
**Check**:
1. URL has `?name=` parameter
2. Name matches exactly (case-sensitive)
3. Spaces are URL-encoded: `Taylor%20Swift`
4. Name exists in `celebrityData` array

**Fix**: Ensure URL encoding:
```javascript
const encodedName = encodeURIComponent(celebrityName);
window.location.href = `celebrity-profile.html?name=${encodedName}`;
```

---

### Issue: Mobile menu not closing
**Symptoms**: Menu stays open after clicking link
**Check**:
1. All mobile links have `onclick="closeMobileMenu()"`
2. Overlay has `onclick="closeMobileMenu()"`
3. Close button has `onclick="closeMobileMenu()"`

**Fix**: Ensure all links call the function:
```html
<a href="browse.html" onclick="closeMobileMenu()">Browse</a>
```

---

### Issue: Booking data lost after refresh
**Symptoms**: User data disappears on page reload
**Check**:
1. LocalStorage is enabled in browser
2. Data is being saved: `localStorage.setItem('bookingData', JSON.stringify(data))`
3. Data is being retrieved: `JSON.parse(localStorage.getItem('bookingData'))`

**Fix**: Always use try-catch when accessing localStorage:
```javascript
try {
    const data = JSON.parse(localStorage.getItem('bookingData') || '{}');
} catch (error) {
    console.error('Error reading localStorage:', error);
    const data = {};
}
```

---

## 📝 Standard Fixes Applied

### All 12 Pages (except 404) Received:
1. **Meta Description** (HIGH) - SEO optimization
2. **Open Graph Tags** (MEDIUM) - Facebook/LinkedIn previews
3. **Twitter Card Tags** (MEDIUM) - Twitter previews
4. **Navigation ARIA** (MEDIUM) - Accessibility (role, aria-label)
5. **Hamburger Button ARIA** (MEDIUM) - Accessibility (aria-label, aria-expanded, aria-controls)

### 404.html Received:
1. **Meta Description** (HIGH)
2. **OG/Twitter Tags** (MEDIUM)
(No navigation, so no ARIA fixes needed)

---

## 🎨 CSS Variables (from css/shared.css)

```css
--purple: #6B46C1          /* Primary brand color */
--purple-dark: #553C9A     /* Hover states */
--purple-light: #8B5CF6    /* Gradients */
--gold: #D4AF37            /* Premium accents */
--green: #10B981           /* Success states */
--white: #FFFFFF
--gray-50: #F9FAFB         /* Light backgrounds */
--gray-100: #F3F4F6
--gray-200: #E5E7EB        /* Borders */
--gray-600: #4B5563        /* Body text */
--gray-700: #374151
--gray-800: #1F2937
--gray-900: #111827        /* Headers */
```

---

## 🔍 Finding Things Fast

### "Where is the booking pre-selection code?"
- **File**: `booking.html`
- **Lines**: 1534-1565 (pre-selection logic)
- **Function**: Inside `initializePage()`

### "Where are celebrity prices set?"
- **File**: `js/shared.js`
- **Object**: `celebrityData` array
- **Field**: `price.quick`, `price.standard`, `price.premium`

### "Where is the mobile menu styled?"
- **File**: `css/shared.css`
- **Classes**: `.mobile-menu`, `.mobile-menu-overlay`, `.mobile-menu-links`

### "Where are meta tags documented?"
- **File**: `docs/templates/META-TAGS.md`
- **Examples**: All meta tag patterns with explanations

### "Where is the refund policy?"
- **File**: `terms.html`
- **Section**: Section 4.4 (lines ~132-138)
- **Summary**:
  - 7+ days: Full refund
  - 3-6 days: 50% refund
  - <3 days: No refund
  - Celebrity cancels: Full refund

---

## 📦 Git Repository

**URL**: `https://github.com/whoamyi/starrymeet.git`
**Branch**: `main`
**Last Commit**: `30b77bf` - Debug documentation reorganization

### Recent Commits (2025-10-09)
```
30b77bf - refactor: Reorganize debug documentation into page-specific structure
8dbf403 - docs: Add comprehensive debug documentation for dashboard sidebar fix
78810fb - fix: Complete dashboard sidebar layout improvements with mobile overlay
9df0ee0 - fix: Improve dashboard sidebar layout and fix toggle button
68f8c21 - fix: Fix sidebar overlapping main content and footer in dashboard
e3f048b - feat: Show total available slots on profile instead of first date only
0c36665 - debug: Add detailed logging for calendar slot count generation
```

---

## 🎯 Priority Tasks (if continuing)

### Immediate (Ready to Deploy)
- ✅ All pages debugged and optimized
- ✅ Booking integration working 100%
- ✅ SEO optimized (meta tags, OG tags)
- ✅ Accessibility compliant (ARIA attributes)
- ✅ Documentation complete

### Phase 1 (Asset Creation)
- [ ] Design and implement favicon.ico
- [ ] Create og:image assets (1200x630px) for all pages
- [ ] Design custom 404 illustration

### Phase 2 (Code Refactoring)
- [ ] Extract inline styles from index.html
- [ ] Consolidate duplicate CSS across pages
- [ ] Minify and bundle JavaScript files

### Phase 3 (Feature Enhancements)
- [ ] Add back-end API integration
- [ ] Implement real payment processing (Stripe)
- [ ] Add celebrity availability calendar
- [ ] Implement user authentication

---

## 📞 Contact Info (from contact.html)

**Email**: support@starrymeet.com
**Phone**: +1 (555) 123-4567
**Support Hours**: 24/7
**Address**: 123 Celebrity Boulevard, Los Angeles, CA 90028

---

## 🏷️ Quick Command Cheat Sheet

### Development
```bash
# Open project
cd /home/whoami/starrymeet

# Start local server (if using)
python -m http.server 8000
# Then visit: http://localhost:8000

# Check git status
git status

# View recent commits
git log --oneline -10

# Push changes
git add .
git commit -m "Your message"
git push
```

### Testing URLs (with server running)
```bash
http://localhost:8000/index.html
http://localhost:8000/browse.html?category=Hollywood
http://localhost:8000/celebrity-profile.html?name=Taylor%20Swift
http://localhost:8000/booking.html?celebrity=Taylor%20Swift&meetingType=standard
http://localhost:8000/dashboard.html
```

---

## 📚 Documentation Quick Links

### Essential Reading
1. **SITE-ARCHITECTURE.md** - How pages interact
2. **COMPLETE-PROJECT-SUMMARY.md** - Full project overview
3. **docs/debug/BOOKING-INTEGRATION.md** - Critical integration details
4. **docs/debug/PAGE-STATUS.md** - Status tracker (100% complete)

### Templates & References
5. **docs/templates/HEADER-NAV.md** - Navigation template
6. **docs/templates/META-TAGS.md** - Meta tag examples
7. **docs/templates/CSS-REFERENCE.md** - All CSS variables
8. **docs/templates/JS-REFERENCE.md** - All JavaScript functions

### Debug Documentation
9. **docs/debug/README.md** - Debug documentation structure guide
10. **docs/debug/DEBUG-LOG.md** - All 45 issues chronologically
11. **docs/debug/pages/dashboard/** - Dashboard-specific issues
12. **docs/debug/pages/booking/** - Booking-specific issues
13. **docs/debug/pages/celebrity-profile/** - Profile-specific issues

---

## ⚡ Most Common Tasks

### Task: Add a new celebrity
1. Open `js/shared.js`
2. Add new object to `celebrityData` array
3. Follow existing structure (name, category, price, etc.)
4. Test on browse.html and celebrity-profile.html

### Task: Change refund policy
1. Open `terms.html`
2. Navigate to Section 4.4 (lines ~132-138)
3. Update text and percentages
4. Update FAQ answer (faq.html, lines ~159-160)

### Task: Update contact information
1. Open `contact.html`
2. Update lines ~140-160 (contact info card)
3. Update footer on all pages if address changes

### Task: Add new FAQ question
1. Open `faq.html`
2. Find appropriate category section (lines ~112-185)
3. Copy existing `<div class="faq-item">` structure
4. Add new question and answer
5. Test accordion functionality

---

---

## 🆕 Recent Updates (2025-10-09)

### Dashboard Improvements
- **Sidebar Layout Overhaul**: Converted from fixed positioning to flexbox
- **Mobile Overlay**: Added semi-transparent overlay for better UX
- **Toggle Icon**: Button changes from ☰ to ✕ when sidebar is open
- **Auto-close**: Sidebar and overlay auto-close when switching tabs
- **Issues Fixed**: #39-#45 (7 issues) - See `docs/debug/pages/dashboard/`

### Debug Documentation Reorganization
- **New Structure**: Page-specific folders under `docs/debug/pages/`
- **Easy Navigation**: Find all dashboard issues in `/dashboard/`, booking in `/booking/`, etc.
- **Master Log**: `DEBUG-LOG.md` maintains chronological history of all 45 issues
- **READMEs**: Each page folder has its own summary and navigation guide

### Celebrity Profile Enhancements
- **Total Slots**: Now shows total available slots across all locations/dates
- **Calendar Fix**: Only shows indicators for dates with actual availability
- **Location Integration**: Book Now buttons pass location context correctly

---

**Quick Reference Last Updated**: 2025-10-09
**Project Status**: Production Ready ✅
**Total Issues Fixed**: 45
