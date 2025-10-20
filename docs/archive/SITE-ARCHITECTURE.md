# StarryMeet Site Architecture & Page Interactions

**Last Updated**: 2025-10-17
**Version**: 2.1.0
**Design System**: v2.0 - Cameo-Inspired Luxury Minimal

> **Note**: This document describes the **current implementation** (as-built).
> For the **target architecture vision** (full-stack plan), see: [ARCHITECTURE-VISION.md](ARCHITECTURE-VISION.md)
> For the **gap analysis** (what's left to build), see: [IMPLEMENTATION-ROADMAP.md](IMPLEMENTATION-ROADMAP.md)
> For the **design system specs**, see: [design/DESIGN-SYSTEM-V2.md](design/DESIGN-SYSTEM-V2.md)

---

## Table of Contents
1. [Site Overview](#site-overview)
2. [Visual Design System](#visual-design-system)
3. [Page-by-Page Breakdown](#page-by-page-breakdown)
4. [Page Interaction Map](#page-interaction-map)
5. [Data Flow Diagrams](#data-flow-diagrams)
6. [Shared Components](#shared-components)
7. [Navigation Paths](#navigation-paths)

---

## Site Overview

StarryMeet is a celebrity meetup booking platform with 15 pages organized into 5 main sections:

### Core User Journey (High Priority)
1. **index.html** → Homepage entry point
2. **browse.html** → Celebrity discovery
3. **celebrity-profile.html** → Celebrity details
4. **booking.html** → 5-step booking flow
5. **dashboard.html** → User account management

### Informational Pages (Medium Priority)
6. **how-it-works.html** → Platform explanation
7. **about.html** → Company information
8. **team.html** → Team members ⭐ NEW
9. **jobs.html** → Careers & job openings ⭐ NEW
10. **for-celebrities.html** → Celebrity onboarding

### Support Pages (Low Priority)
11. **faq.html** → Common questions
12. **contact.html** → Contact form
13. **terms.html** → Legal terms
14. **privacy.html** → Privacy policy
15. **404.html** → Error page

---

## Visual Design System

### Design Philosophy (v2.0)
**Inspired by**: Cameo's luxury minimal aesthetics
**Theme**: Pure Black (#000000) with sophisticated purple and gold accents
**Core Principles**:
1. **Minimal Elegance** - Restrained sizing, clean lines, breathing room
2. **Luxury Accents** - Gold for verified badges, purple for interactive elements
3. **Vibrant Gradients** - Used sparingly for emphasis (8 gradient variants)
4. **Subtle Interactions** - Gentle hover effects, smooth transitions
5. **Pure Black Theme** - #000000 backgrounds with extremely subtle purple-tinted shadows

### Typography (Cameo-Inspired)
- **Font Family**: Inter (sans-serif) for all headings and UI elements
- **Heading Sizes**: Reduced and restrained (h1: 48px, h2: 36px, h3: 30px)
- **Line Height**: Tightened to 1.1 for modern look
- **Font Weights**: 700-800 for headings, 600 for subheadings
- **Body Text**: 16px with 1.6 line-height, color: #B0B0B0 (light gray)

### Button System
- **Primary**: Gradient background (purple to pink), fully rounded (border-radius: full)
- **Hover**: translateY(-3px) with subtle purple glow
- **No Default Shadow**: Clean appearance, shadow appears only on hover
- **Secondary**: Ghost style with purple border

### Card System
**Standard Cards** (Dark):
- Background: Pure black (#000000)
- Border: 1px solid rgba(139, 92, 246, 0.08) - subtle purple tint
- Border Radius: 32px (var(--radius-2xl))
- Hover: Gentle lift (-4px) + subtle purple glow

**Gradient Cards** (Cameo-Style):
- 8 vibrant gradient variants: purple, pink, red, blue, teal, lime, orange, gold
- Used strategically on index.html for category cards
- No borders, white text, enhanced hover effects
- Example usage: Browse by Category section on homepage

### Badge System
**Verified Badge** (Gold Luxury):
- Background: Gold gradient (linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%))
- Font: 800 weight, uppercase, tight letter-spacing
- Shadow: Subtle gold glow (rgba(245, 158, 11, 0.08))
- Applied universally to all verified elements

### Color Palette
**Primary**: #8B5CF6 (Electric Violet)
**Accent**: #F59E0B (Amber Gold) - for verified badges
**Background**: #000000 (Pure Black) - only background color used
**Text Colors**:
- Primary: #FFFFFF (white) - all headings
- Secondary: #B0B0B0 (light gray) - body text
- Tertiary: #808080 (medium gray) - labels, helper text

### Spacing & Shadows
- **Spacing Scale**: 4px base (--space-1 through --space-24)
- **Shadows**: Extremely subtle purple-tinted glows (like a mirage)
- **Transitions**: 150-350ms with cubic-bezier easing

### CSS Variables
All design tokens defined in `/home/whoami/starrymeet/css/shared.css`:
- Color system (--primary, --accent, --text-primary, etc.)
- Spacing scale (--space-1 through --space-24)
- Typography scale (--text-xs through --text-7xl)
- Border radius (--radius-xs through --radius-full)
- Shadows (--shadow-xs through --shadow-glow-xl)

### Recent Design Changes (v2.0)
1. **Typography Refinement**: Reduced h1 from 60px to 48px, h2 from 48px to 36px
2. **Button Enhancement**: Fully rounded corners, gradient backgrounds, subtle hover glows
3. **Gradient Cards**: Added 8 Cameo-style gradient card variants for emphasis
4. **Gold Verified Badges**: Luxury gold gradient with uppercase styling
5. **Pure Black Theme**: All pages use #000000 backgrounds consistently
6. **Legal Pages Fixed**: Removed inline CSS conflicts from privacy.html and terms.html

---

## Page-by-Page Breakdown

### 1. index.html (Homepage)
**File**: `/home/whoami/starrymeet/index.html`
**Lines**: 852 total
**Purpose**: Main landing page and entry point for all users

#### What It Does
- Displays hero section with main value proposition
- Shows featured celebrities (3 cards)
- Explains platform benefits (6 benefit cards)
- Displays user testimonials (3 testimonials)
- Shows trust indicators (stats: 100+ celebrities, 50+ cities, etc.)
- Call-to-action buttons to browse celebrities

#### Key Sections
- **Hero** (lines 852-866): Main headline, CTA button
- **Featured Celebrities** (lines ~200-400): 3 celebrity cards with "Book Now" buttons
- **How It Works** (lines ~400-500): 4-step process explanation
- **Testimonials** (lines ~500-600): User reviews
- **Stats Section** (lines ~600-700): Platform statistics

#### Links To (Outgoing)
- `browse.html` - "Browse Celebrities" buttons (multiple CTAs)
- `celebrity-profile.html` - "View Profile" from featured celebrities
- `how-it-works.html` - "Learn More" link
- `about.html` - "About Us" link
- `for-celebrities.html` - "Join as Celebrity" link
- `dashboard.html` - "Dashboard" button (nav)

#### Links From (Incoming)
- All pages link back via nav "Home" or logo click
- `404.html` - "Go Home" button
- External: Direct traffic, search engines, social media

#### Data Used
- Celebrity data from `js/shared.js` - `celebrityData` array
- LocalStorage: Checks for existing user session

#### JavaScript Functions
- `loadFeaturedCelebrities()` - Loads 3 featured celebrities
- `navigateToProfile(name)` - Redirects to celebrity profile
- Shared: `toggleMobileMenu()`, `closeMobileMenu()`

---

### 2. browse.html (Celebrity Browsing)
**File**: `/home/whoami/starrymeet/browse.html`
**Lines**: ~800 total
**Purpose**: Browse and filter all available celebrities

#### What It Does
- Displays all 12 celebrities in grid format
- Provides category filters (All, Hollywood, Musicians, Athletes, Business)
- Offers search functionality (by name)
- Shows real-time availability status
- Displays pricing for each celebrity
- Links to individual celebrity profiles

#### Key Sections
- **Search Bar** (lines ~100-120): Real-time name search
- **Category Filters** (lines ~130-150): 5 filter buttons
- **Celebrity Grid** (lines ~200-700): 12 celebrity cards
- **Empty State** (lines ~710-730): Shown when no matches

#### Links To (Outgoing)
- `celebrity-profile.html?name=[celebrityName]` - "View Profile" buttons (12 total)
- All standard nav links

#### Links From (Incoming)
- `index.html` - Multiple "Browse Celebrities" CTAs
- `celebrity-profile.html` - "Back to Browse" link
- `dashboard.html` - "Browse Celebrities" link
- `how-it-works.html` - "Browse Celebrities" CTA
- `about.html` - "Browse Celebrities" CTA
- URL with filters: `browse.html?category=Hollywood`

#### Data Used
- `js/shared.js` - Full `celebrityData` array (12 celebrities)
- URL parameters: `?category=X` for pre-filtered views

#### JavaScript Functions
- `loadCelebrities()` - Loads all celebrities into grid
- `filterCelebrities(category)` - Filters by category
- `searchCelebrities()` - Real-time search by name
- `navigateToProfile(name)` - Redirects with URL parameter

#### URL Parameters
- `?category=Hollywood` - Pre-filter to Hollywood category
- `?category=Musicians` - Pre-filter to Musicians category
- `?category=Athletes` - Pre-filter to Athletes category
- `?category=Business` - Pre-filter to Business Leaders

---

### 3. celebrity-profile.html (Individual Celebrity)
**File**: `/home/whoami/starrymeet/celebrity-profile.html`
**Lines**: ~700 total
**Purpose**: Display detailed celebrity information and enable booking

#### What It Does
- Shows celebrity details (bio, category, location, rating)
- Displays celebrity photo/avatar
- Shows pricing for 3 meeting types
- Displays upcoming availability (dates)
- Shows past reviews/testimonials (3 reviews)
- Provides booking dropdown to select meeting type
- **CRITICAL**: Passes selected meeting type to booking.html via URL

#### Key Sections
- **Hero Section** (lines ~100-200): Celebrity name, photo, basic info
- **About Section** (lines ~210-280): Biography and details
- **Booking Options** (lines ~290-360): 3 meeting types with prices
  - Quick Meet (15 min) - $2,500
  - Standard Session (30 min) - $5,000
  - Premium Experience (60 min) - $10,000
- **Availability** (lines ~370-420): Upcoming dates grid
- **Reviews** (lines ~430-550): Past customer testimonials

#### Links To (Outgoing)
- **PRIMARY**: `booking.html?celebrity=[name]&meetingType=[type]`
  - This is the MOST CRITICAL link in the entire site
  - Triggers the pre-selection integration in booking.html
  - Example: `booking.html?celebrity=Taylor%20Swift&meetingType=standard`
- `browse.html` - "Back to Browse" link
- All standard nav links

#### Links From (Incoming)
- `browse.html` - "View Profile" buttons (12 sources)
- `index.html` - Featured celebrity "View Profile" buttons (3 sources)
- `dashboard.html` - "View Profile" from bookings

#### Data Used
- URL parameter: `?name=[celebrityName]` (REQUIRED)
- `js/shared.js` - Finds celebrity in `celebrityData` by name
- LocalStorage: Saves selected meeting type before redirect

#### JavaScript Functions
- `loadCelebrityProfile()` - Loads celebrity data from URL param
- `selectMeetingType(type)` - Handles dropdown selection
- `bookMeeting()` - **CRITICAL** - Redirects to booking with parameters
- `displayReviews()` - Shows celebrity reviews

#### URL Parameters IN
- `?name=Taylor%20Swift` (REQUIRED) - Celebrity name to display

#### URL Parameters OUT (to booking.html)
- `?celebrity=Taylor%20Swift` - Celebrity name
- `&meetingType=quick` - Selected meeting type (quick/standard/premium)

#### Data Flow (Booking Trigger)
```javascript
// celebrity-profile.html → booking.html
1. User clicks "Book Now" on celebrity profile
2. User selects meeting type from dropdown
3. bookMeeting() function executes:
   - Reads selectedMeetingType from dropdown
   - Constructs URL: `booking.html?celebrity=${name}&meetingType=${type}`
   - Saves to localStorage as backup
   - Redirects to booking.html
4. booking.html receives parameters and pre-selects meeting type
```

---

### 4. booking.html (Booking Flow)
**File**: `/home/whoami/starrymeet/booking.html`
**Lines**: 2300+ total
**Purpose**: 5-step booking process with payment

#### What It Does
**MOST COMPLEX PAGE IN THE SITE**
- 5-step wizard: Meeting Type → Date → Details → Review → Payment
- Receives celebrity name and meeting type from celebrity-profile.html
- **PRE-SELECTS** meeting type if passed via URL (critical feature)
- Validates all form inputs
- Calculates total price with tax
- Processes payment (demo mode)
- Sends confirmation email (demo)
- Redirects to dashboard on completion

#### Key Sections (5 Steps)

**Step 1: Meeting Type Selection** (lines ~400-700)
- Displays 3 meeting type cards
- Pre-selects card if meetingType URL param exists
- Shows green "✓ Pre-selected" badge on pre-selected card
- Price range: $2,500 - $10,000

**Step 2: Date Selection** (lines ~710-900)
- Calendar interface for date selection
- Time slot selection (Morning 9-12, Afternoon 1-5, Evening 6-9)
- Checks celebrity availability
- Minimum 7 days in advance

**Step 3: Personal Details** (lines ~910-1100)
- Form fields: Name, Email, Phone, Special Requests
- Form validation
- Photo consent checkbox

**Step 4: Review & Confirm** (lines ~1110-1300)
- Summary of all selections
- Price breakdown (subtotal, tax, total)
- Edit buttons to go back to previous steps

**Step 5: Payment** (lines ~1310-1500)
- Payment form (card number, expiry, CVV, ZIP)
- Billing address
- Payment processing (demo)
- Confirmation message

#### Links To (Outgoing)
- `dashboard.html` - After successful booking
- `browse.html` - Cancel button
- `celebrity-profile.html` - "Back" from step 1

#### Links From (Incoming)
- **PRIMARY**: `celebrity-profile.html` with URL params
- `dashboard.html` - "New Booking" button
- `index.html` - Some CTAs

#### Data Used (CRITICAL)
- **URL Parameters** (lines ~1530-1565):
  - `?celebrity=Taylor%20Swift` - Celebrity name
  - `?meetingType=standard` - Meeting type to pre-select
- **LocalStorage** (lines ~1520-1528):
  - `bookingData` object stores all form data
  - Persists across page refreshes
  - Cleared on completion
- **Celebrity Data**: From `js/shared.js` - `celebrityData` array

#### JavaScript Functions (CRITICAL)

**Initialization** (lines 2212-2217):
```javascript
// DOM Ready Check - CRITICAL FOR PRE-SELECTION
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}
```

**Pre-Selection Logic** (lines 1534-1547):
```javascript
// CRITICAL: Double-buffered requestAnimationFrame
if (meetingType) {
    bookingData.meetingType = meetingType;
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const selected = selectMeetingType(meetingType);
            if (selected) {
                console.log(`Pre-selected meeting type: ${meetingType}`);
            } else {
                console.warn(`Failed to pre-select: ${meetingType}`);
            }
        });
    });
}
```

**Key Functions**:
- `initializePage()` - Main initialization, reads URL params
- `selectMeetingType(type)` - Selects meeting card (returns boolean)
- `nextStep()` - Advances to next step with validation
- `previousStep()` - Returns to previous step
- `calculateTotal()` - Computes price with tax
- `processPayment()` - Handles payment submission
- `sendConfirmationEmail()` - Sends email (demo)

#### URL Parameters IN (CRITICAL)
- `?celebrity=Taylor%20Swift` (optional but recommended)
- `?meetingType=quick|standard|premium` (optional but enables pre-selection)

#### Integration Points
**celebrity-profile.html → booking.html**:
1. Celebrity profile passes: `?celebrity=X&meetingType=Y`
2. booking.html reads parameters on load
3. Pre-selects meeting type card with green badge
4. User proceeds through remaining 4 steps

#### Error Handling
- Try-catch blocks around all DOM operations (lines ~1540-1550)
- Console logging for debugging (lines ~1545, 1548)
- Fallback to default state if pre-selection fails
- User-facing error messages for validation failures

---

### 5. dashboard.html (User Dashboard)
**File**: `/home/whoami/starrymeet/dashboard.html`
**Lines**: ~1900 total
**Purpose**: User account and booking management with tabbed interface
**Recent Updates**: 2025-10-09 - Sidebar layout overhaul (Issues #39-#45)

#### What It Does
- **Collapsible Sidebar Navigation**: User profile + 6 tabs (Overview, Upcoming, Past, Favorites, Messages, Settings)
- **Overview Tab**: Stats dashboard with next meeting card and recommendations
- **Upcoming Meetings**: List of scheduled bookings
- **Past Meetings**: History with review functionality
- **Saved Celebrities**: Watchlist management
- **Messages Tab**: Chat interface for booking coordination
- **Account Settings**: Profile management and preferences

#### Layout Architecture (Flexbox-Based)
```
body (flex column)
├── nav (fixed, 70px)
├── breadcrumb
├── hamburger-menu-btn (mobile only)
├── sidebar-overlay (mobile only, click-to-close)
├── dashboard-container (flex: 1)
│   ├── sidebar (flex item, 250px on desktop, collapsible on mobile)
│   └── main-content (flex: 1)
└── footer
```

#### Key Sections
- **Sidebar** (lines ~964-1002): User profile, navigation menu with 7 items
- **Overview Tab** (lines ~1007-1081): Stats grid, next meeting card, recommendations
- **Upcoming Meetings** (lines ~1084-1093): Future bookings list
- **Past Meetings** (lines ~1096-1133): History with reviews
- **Saved Celebrities** (lines ~1135-1143): Watchlist
- **Messages Tab** (lines ~1145-1220): Chat interface with conversation list
- **Account Settings** (lines ~1222-1310): Profile editing form

#### Mobile Features (≤768px)
- Sidebar hidden by default (`width: 0`)
- Hamburger button visible in top-left
- Click hamburger: sidebar slides in from left with overlay
- Click overlay or switch tabs: auto-close sidebar
- Toggle icon changes: ☰ ↔ ✕

#### Links To (Outgoing)
- `booking.html` - "New Booking" button
- `celebrity-profile.html?name=[celebrity]` - From booking/recommendation cards
- `browse.html` - "Browse More" button
- `index.html` - Logout redirects here

#### Links From (Incoming)
- `booking.html` - After successful booking
- All pages - "Dashboard" nav button
- `index.html` - "Sign In" redirects here

#### Data Used
- LocalStorage: `userData` object with user info
- LocalStorage: `bookingHistory` array of bookings
- LocalStorage: `favorites` array of celebrity names
- SessionStorage: `currentChat` for messages

#### JavaScript Functions
- `toggleSidebar()` - Toggles mobile sidebar + overlay + icon
- `switchTab(tabName)` - Switches dashboard sections, auto-closes sidebar on mobile
- `initializePage()` - Initializes user data and loads default tab
- `loadUpcomingMeetings()` - Displays next bookings
- `loadPastMeetings()` - Shows booking history
- `loadSavedCelebrities()` - Displays watchlist
- `loadMessages()` - Loads chat conversations
- `loadNextMeeting()` - Shows next upcoming meeting card
- `logout()` - Clears localStorage and redirects

#### Recent Fixes (2025-10-09)
- **Issue #39**: Removed duplicate `toggleSidebar()` functions
- **Issue #40**: Fixed inconsistent button class naming
- **Issue #41**: Converted from fixed to flexbox layout
- **Issue #42**: Added mobile overlay for better UX
- **Issue #43**: Added sidebar padding
- **Issue #44**: Toggle button icon now updates (☰ ↔ ✕)
- **Issue #45**: Overlay now closes with sidebar on tab switch
- **See**: `docs/debug/pages/dashboard/` for complete documentation

---

### 6. how-it-works.html (Platform Explanation)
**File**: `/home/whoami/starrymeet/how-it-works.html`
**Lines**: ~600 total
**Purpose**: Explain booking process and platform features

#### What It Does
- 4-step process visualization
- Platform benefits explanation
- FAQs about the process
- Trust indicators
- Video tutorial (placeholder)
- Call-to-action to browse celebrities

#### Key Sections
- **Hero** (lines ~100-140): Page title and subtitle
- **4-Step Process** (lines ~150-350): Browse → Book → Meet → Review
- **Benefits Grid** (lines ~360-500): Safety, verification, convenience
- **Video Section** (lines ~510-550): Tutorial placeholder
- **FAQ** (lines ~560-600): Quick answers

#### Links To (Outgoing)
- `browse.html` - "Browse Celebrities" CTA
- `faq.html` - "See All FAQs" link
- `about.html` - "Learn About Us" link

#### Links From (Incoming)
- `index.html` - "How It Works" nav link
- All pages - "How It Works" nav link

#### Data Used
- Static content only (no dynamic data)

---

### 7. about.html (Company Information)
**File**: `/home/whoami/starrymeet/about.html`
**Lines**: ~230 total
**Purpose**: Company story, mission, and values

#### What It Does
- Company origin story
- Mission statement
- Core values (4 cards)
- Company statistics
- Team introduction (future)
- Call-to-action to browse

#### Key Sections
- **Hero** (lines ~111-114): "Our Story" title
- **Mission** (lines ~117-120): Mission statement card
- **Story** (lines ~123-129): Company history
- **Values Grid** (lines ~133-156): 4 value cards
  - Authenticity
  - Safety
  - Accessibility
  - Unforgettable Experiences
- **Stats** (lines ~158-175): 100+ celebrities, 50+ cities, 10k+ meetings, 4.9★
- **CTA** (lines ~177-181): "Browse Celebrities" button

#### Links To (Outgoing)
- `browse.html` - "Browse Celebrities" CTA
- `how-it-works.html` - "How It Works" link
- `for-celebrities.html` - "For Celebrities" link
- `contact.html` - "Contact" link

#### Links From (Incoming)
- All pages - "About" nav link

#### Data Used
- Static content only

---

### 8. team.html (Team Members) ⭐ NEW
**File**: `/home/whoami/starrymeet/team.html`
**Lines**: ~533 total
**Purpose**: Showcase company team and culture

#### What It Does
- Displays all team members across 6 departments
- Shows realistic backgrounds and experience
- Links to careers page for job openings
- Demonstrates company culture and values

#### Key Sections
- **Hero** (lines 288-291): "Meet the team" title with mission statement
- **Leadership** (lines 296-321): 3 executives
  - Alexandra Stone (Co-Founder & CEO) - Ex-WME
  - Marcus Chen (Co-Founder & CTO) - Ex-Google
  - Natalie Patel (COO) - Ex-Airbnb
- **Product & Engineering** (lines 324-349): 3 team members
  - James Kim (VP Product) - Ex-Cameo/Patreon
  - Sofia Rodriguez (Head of Engineering) - Ex-Stripe/Square
  - David Wang (Senior Product Designer) - Ex-Spotify
- **Celebrity Relations** (lines 352-377): 3 team members
  - Emma Richardson (VP Celebrity Relations) - Ex-CAA
  - Lucas Johnson (Director Talent Partnerships) - Ex-Roc Nation
  - Priya Mehta (Head of Operations) - Event management expert
- **Marketing & Growth** (lines 380-405): 3 team members
  - Taylor Cooper (VP Marketing) - Ex-Nike/Apple
  - Kai Lee (Head of Growth) - Ex-TikTok/Uber
  - Aisha Harris (Content & Community Lead) - Ex-Rolling Stone
- **Trust & Safety** (lines 408-433): 3 team members
  - Rachel Brooks (Head of Trust & Safety) - Ex-FBI/Airbnb
  - Victor Martinez (Security Operations Manager) - 20 years protection
  - Jordan Taylor (Legal Counsel) - Ex-Sony Music
- **Customer Experience** (lines 436-453): 2 team members
  - Olivia Anderson (Head of Customer Success) - Ex-Zappos/Ritz-Carlton
  - Chris Nguyen (Customer Support Lead) - Hospitality management
- **Join the Team CTA** (lines 457-460): Links to jobs.html

#### Links To (Outgoing)
- `jobs.html` - "View Open Positions" button
- `for-celebrities.html` - "Join as talent" footer CTA
- `contact.html` - "Become a partner" footer CTA

#### Links From (Incoming)
- All pages - "Team" link in footer Company section
- `about.html` - "Team" link

#### Data Used
- Static team member data (17 members total)
- Avatar gradients with initials

#### Design Features
- Sticky header for better navigation
- Hover shadow effects: `box-shadow: 0 12px 32px rgba(234, 18, 121, 0.3)`
- Responsive grid layout (auto-fit, minmax(280px, 1fr))
- Avatar circles with gradient backgrounds
- Fully responsive mobile layout

---

### 9. jobs.html (Careers & Job Openings) ⭐ NEW
**File**: `/home/whoami/starrymeet/jobs.html`
**Lines**: ~483 total
**Purpose**: Job openings and company benefits

#### What It Does
- Lists all open positions with full descriptions
- Showcases company benefits and perks
- Provides application CTAs for each role
- Demonstrates company culture and work environment

#### Key Sections
- **Hero** (lines 214-217): "Join our mission" title
- **Why Work at StarryMeet** (lines 221-254): 6 perks
  - Competitive Pay (top-tier salary, equity, bonuses)
  - Health & Wellness (premium coverage)
  - Unlimited PTO
  - Remote Friendly
  - Learning Budget ($3,000 annual)
  - Celebrity Access (meet stars, exclusive events)
- **Open Positions** (lines 257-435): 6 job listings
  1. **Senior Product Manager** (Product & Engineering, SF/Remote)
     - 5+ years PM experience
     - Marketplace/creator economy focus
  2. **Trust & Safety Specialist** (Trust & Safety, LA)
     - 3+ years in trust & safety
     - Background checks, fraud prevention
  3. **Celebrity Relations Manager** (Celebrity Relations, NY/LA)
     - 5+ years talent relations
     - Network of celebrities/managers
  4. **Senior Full Stack Engineer** (Engineering, Remote)
     - 6+ years software engineering
     - React, Node.js, scalability focus
  5. **Growth Marketing Manager** (Marketing & Growth, SF/Remote)
     - 4+ years growth marketing
     - Paid social, SEM, SEO, CRO
  6. **Customer Success Lead** (Customer Experience, Remote)
     - 5+ years customer success leadership
     - Team management, operations building

#### Links To (Outgoing)
- `for-celebrities.html` - "Join as talent" footer CTA
- `contact.html` - "Become a partner" footer CTA
- Email: careers@starrymeet.com (via Apply button alerts)

#### Links From (Incoming)
- `team.html` - "View Open Positions" button
- All pages - "Jobs" link in footer Company section

#### Data Used
- Static job listings with full requirements
- Department metadata, location, job type

#### Design Features
- Sticky header for consistency
- Perks grid with emoji icons
- Job cards with hover effects (translateY(-2px), border glow)
- Requirements lists with bullet points
- Apply buttons with gradient styling
- Fully responsive mobile layout

---

### 10. for-celebrities.html (Celebrity Onboarding)
**File**: `/home/whoami/starrymeet/for-celebrities.html`
**Lines**: ~310 total
**Purpose**: Recruit celebrities to join platform

#### What It Does
- Explains celebrity benefits
- 5-step onboarding process
- Celebrity testimonials
- Earnings calculator (interactive)
- Application link
- Revenue model explanation

#### Key Sections
- **Hero** (lines ~114-118): "Join StarryMeet as Celebrity" with "Apply" CTA
- **Benefits Grid** (lines ~121-153): 6 benefit cards
  - Monetize Your Travel
  - Full Control
  - Connect with True Fans
  - Flexible Scheduling
  - Premium Positioning
  - Professional Support
- **How It Works** (lines ~155-192): 5-step process
  - Apply & Verify
  - Set Availability
  - Approve Bookings
  - Meet Fans
  - Get Paid
- **Testimonials** (lines ~194-226): 3 celebrity quotes
  - Jennifer Lawrence
  - Elon Musk
  - Taylor Swift
- **Earnings Calculator** (lines ~228-246): Interactive calculator
  - Input: Meetings per month
  - Input: Price per meeting
  - Output: Monthly and annual earnings
- **CTA** (lines ~248-252): "Apply to Join" button

#### Links To (Outgoing)
- `mailto:apply@starrymeet.com` - Application email (2 buttons)

#### Links From (Incoming)
- All pages - "For Celebrities" nav link
- `index.html` - "Join as Celebrity" link

#### Data Used
- Static content only
- JavaScript for calculator

#### JavaScript Functions
- `calculateEarnings()` - Computes potential revenue
  - Formula: meetings × price = monthly
  - Annual: monthly × 12

---

### 11. faq.html (Frequently Asked Questions)
**File**: `/home/whoami/starrymeet/faq.html`
**Lines**: ~260 total
**Purpose**: Answer common user questions

#### What It Does
- 5 category tabs: General, Booking & Payment, Meetings, Cancellations, For Celebrities
- Accordion-style Q&A (25 questions total)
- Search functionality (live filter)
- Link to contact for more help

#### Key Sections
- **Hero** (lines ~95-101): Title with search box
- **Category Tabs** (lines ~104-110): 5 filter tabs
- **General FAQs** (lines ~112-125): 3 questions
  - What is StarryMeet?
  - How do I know celebrities are real?
  - Is StarryMeet available worldwide?
- **Booking & Payment** (lines ~127-140): 3 questions
  - How do I book?
  - What payment methods?
  - When will card be charged?
- **Meetings** (lines ~142-155): 3 questions
  - What happens during meeting?
  - Can I bring someone?
  - Are photos allowed?
- **Cancellations** (lines ~157-170): 3 questions
  - Cancellation policy?
  - Can I reschedule?
  - What if celebrity cancels?
- **For Celebrities** (lines ~172-185): 3 questions
  - How to apply?
  - How much can I earn?
  - How do celebrities get paid?
- **CTA** (lines ~187-191): Contact support link

#### Links To (Outgoing)
- `contact.html` - "Contact Support" button

#### Links From (Incoming)
- All pages - "FAQ" nav link
- `how-it-works.html` - "See All FAQs" link

#### Data Used
- Static Q&A content

#### JavaScript Functions
- `toggleFAQ(element)` - Expands/collapses accordion
- `showCategory(category)` - Switches between tabs
- `searchFAQ()` - Filters questions by search term

---

### 12. contact.html (Contact Form)
**File**: `/home/whoami/starrymeet/contact.html`
**Lines**: ~250 total
**Purpose**: User support and inquiries

#### What It Does
- Contact form with 4 fields
- Subject dropdown (6 options)
- Contact information display
- Social media links
- Headquarters address
- Form submission (demo)

#### Key Sections
- **Hero** (lines ~98-101): "Get in Touch" title
- **Contact Form** (lines ~105-134):
  - Name (required)
  - Email (required)
  - Subject dropdown (required): General, Booking Help, Celebrity Application, Technical Issue, Partnership, Other
  - Message (required)
  - Submit button
- **Contact Info Card** (lines ~137-161):
  - Email: support@starrymeet.com
  - Phone: +1 (555) 123-4567
  - Support Hours: 24/7
- **Social Links** (lines ~163-171): Instagram, Twitter, Facebook, LinkedIn
- **Headquarters** (lines ~173-181):
  - StarryMeet Inc.
  - 123 Celebrity Boulevard
  - Los Angeles, CA 90028

#### Links To (Outgoing)
- Social media links (4 external links)

#### Links From (Incoming)
- All pages - "Contact" nav link
- `faq.html` - "Contact Support" button
- Footer - Multiple "Contact" links

#### Data Used
- Form data (not persisted, demo only)

#### JavaScript Functions
- `submitForm(event)` - Handles form submission
  - Prevents default
  - Shows success message
  - Resets form
  - Scrolls to top

---

### 13. terms.html (Terms of Service)
**File**: `/home/whoami/starrymeet/terms.html`
**Lines**: ~270 total
**Purpose**: Legal terms and conditions

#### What It Does
- 13 sections of legal terms
- User agreement
- Service description
- Account responsibilities
- Booking and payment terms
- Refund policy
- Limitation of liability
- Contact information

#### Key Sections
- **Last Updated** (line ~88): January 15, 2025
- **Section 1** (lines ~90-93): Acceptance of Terms
- **Section 2** (lines ~95-105): Description of Service
- **Section 3** (lines ~107-121): User Accounts
- **Section 4** (lines ~123-139): Booking and Payments
  - Full refund: 7+ days before
  - 50% refund: 3-6 days before
  - No refund: <3 days before
  - Full refund: Celebrity cancellation
- **Section 5** (lines ~141-151): Celebrity Verification
- **Section 6** (lines ~153-166): User Conduct
- **Section 7** (lines ~168-177): Intellectual Property
- **Section 8** (lines ~179-190): Limitation of Liability
- **Section 9** (lines ~192-201): Indemnification
- **Section 10** (lines ~203-206): Privacy (links to privacy.html)
- **Section 11** (lines ~208-211): Modifications to Terms
- **Section 12** (lines ~213-216): Governing Law (California)
- **Section 13** (lines ~218-226): Contact Information

#### Links To (Outgoing)
- `privacy.html` - Privacy policy link

#### Links From (Incoming)
- All pages footer - "Terms of Service" link
- `booking.html` - "Terms" checkbox link

#### Data Used
- Static legal content

---

### 14. privacy.html (Privacy Policy)
**File**: `/home/whoami/starrymeet/privacy.html`
**Lines**: ~290 total
**Purpose**: Privacy policy and data handling

#### What It Does
- Explains data collection practices
- Lists information types collected
- Describes data usage
- Details sharing practices
- Security measures
- User rights (GDPR, CCPA)
- Cookie policy

#### Key Sections (12 major sections)
- **Last Updated** (line ~88): January 15, 2025
- **Section 1** (lines ~90-94): Introduction
- **Section 2** (lines ~96-123): Information We Collect
  - Personal information (name, email, payment)
  - Automatically collected (IP, browser, location)
  - Third-party information (social media, analytics)
- **Section 3** (lines ~125-138): How We Use Your Information
  - Provide services
  - Payment processing
  - Marketing
  - Security
- **Section 4** (lines ~140-180): How We Share Your Information
  - With celebrities
  - Service providers (Stripe, AWS)
  - Legal compliance
- **Section 5** (lines ~182-195): Data Security
- **Section 6** (lines ~197-210): Your Rights (GDPR/CCPA)
- **Section 7** (lines ~212-225): Cookies
- **Section 8** (lines ~227-240): Children's Privacy (13+)
- **Section 9** (lines ~242-255): International Users
- **Section 10** (lines ~257-270): Data Retention
- **Section 11** (lines ~272-285): Changes to Policy
- **Section 12** (lines ~287-295): Contact

#### Links To (Outgoing)
- None (terminal page)

#### Links From (Incoming)
- All pages footer - "Privacy Policy" link
- `terms.html` - Privacy link
- `booking.html` - Privacy checkbox link

#### Data Used
- Static legal content

---

### 15. 404.html (Error Page)
**File**: `/home/whoami/starrymeet/404.html`
**Lines**: ~135 total
**Purpose**: Handle missing pages gracefully

#### What It Does
- Shows friendly error message
- Provides navigation back to safety
- Maintains brand experience
- No navigation or footer (minimal design)

#### Key Sections
- **Error Display** (lines ~120-127):
  - Animated star icon
  - "404" code
  - "Page Not Found" title
  - Friendly message
- **Action Buttons** (lines ~128-131):
  - "Go Home" button → index.html
  - "Browse Celebrities" button → browse.html

#### Links To (Outgoing)
- `index.html` - "Go Home" button
- `browse.html` - "Browse Celebrities" button

#### Links From (Incoming)
- Broken links (automatic server redirect)
- Typed incorrect URLs

#### Data Used
- Static content only

#### Special Features
- Full-screen gradient background
- Floating animation on star icon
- No header/footer for focus

---

## Page Interaction Map

### Primary User Flows

#### Flow 1: New User Booking (Most Common)
```
index.html
    ↓ [Browse Celebrities]
browse.html
    ↓ [View Profile]
celebrity-profile.html?name=Taylor%20Swift
    ↓ [Select Meeting Type] [Book Now]
booking.html?celebrity=Taylor%20Swift&meetingType=standard
    ↓ [5-step wizard]
dashboard.html
```

#### Flow 2: Direct Celebrity Booking
```
browse.html
    ↓ [View Profile]
celebrity-profile.html?name=Elon%20Musk
    ↓ [Book Now]
booking.html?celebrity=Elon%20Musk&meetingType=premium
    ↓ [Complete booking]
dashboard.html
```

#### Flow 3: Learning Flow
```
index.html
    ↓ [How It Works]
how-it-works.html
    ↓ [Learn More]
about.html
    ↓ [Browse Celebrities]
browse.html
```

#### Flow 4: Celebrity Application
```
index.html
    ↓ [For Celebrities]
for-celebrities.html
    ↓ [Apply to Join]
mailto:apply@starrymeet.com
```

#### Flow 5: Support Flow
```
Any Page
    ↓ [FAQ]
faq.html
    ↓ [Contact Support]
contact.html
    ↓ [Submit Form]
Success message
```

---

## Data Flow Diagrams

### Celebrity Data Flow
```
js/shared.js (celebrityData array)
    ↓
    ├─→ index.html (featured celebrities)
    ├─→ browse.html (all celebrities)
    └─→ celebrity-profile.html (single celebrity)
            ↓ URL parameter
            booking.html (booking form)
                ↓ LocalStorage
                dashboard.html (confirmation)
```

### Booking Integration Flow (CRITICAL)
```
celebrity-profile.html
    ↓
    1. User selects meeting type from dropdown
    ↓
    2. Clicks "Book Now" button
    ↓
    3. JavaScript constructs URL with parameters:
       booking.html?celebrity=Taylor%20Swift&meetingType=standard
    ↓
    4. Saves to localStorage as backup
    ↓
    5. Redirects to booking.html
    ↓
booking.html
    ↓
    6. initializePage() reads URL parameters
    ↓
    7. Extracts celebrityName and meetingType
    ↓
    8. Double-buffered requestAnimationFrame ensures DOM ready
    ↓
    9. selectMeetingType(meetingType) selects card
    ↓
    10. Green "✓ Pre-selected" badge appears
    ↓
    11. User continues through steps 2-5
```

### LocalStorage Data Structure
```javascript
// Booking Data (booking.html → dashboard.html)
{
    celebrity: "Taylor Swift",
    meetingType: "standard", // quick | standard | premium
    price: 5000,
    date: "2025-10-15",
    timeSlot: "afternoon",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    specialRequests: "..."
}

// User Data (dashboard.html)
{
    name: "John Doe",
    email: "john@example.com",
    memberSince: "2025-01-01",
    avatar: "avatar-url.jpg"
}

// Booking History (dashboard.html)
[
    {
        id: "booking-001",
        celebrity: "Taylor Swift",
        date: "2025-10-15",
        meetingType: "standard",
        status: "confirmed", // confirmed | completed | cancelled
        price: 5000
    }
]

// Favorites (dashboard.html)
["Taylor Swift", "Elon Musk", "LeBron James"]
```

---

## Shared Components

### 1. Navigation Header (All Pages Except 404)
**Location**: Top of every page
**Template**: `docs/templates/HEADER-NAV.md`
**Lines**: Typically ~70-90

**Structure**:
```html
<nav role="navigation" aria-label="Main navigation" id="navbar">
    <div class="nav-container">
        <a href="index.html" class="logo">✨ StarryMeet</a>
        <button class="hamburger-btn"
                onclick="toggleMobileMenu()"
                aria-label="Toggle navigation menu"
                aria-expanded="false"
                aria-controls="mobileMenu">☰</button>
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

**Links From Navigation**:
- Logo → index.html
- Browse → browse.html
- How It Works → how-it-works.html
- About → about.html
- For Celebrities → for-celebrities.html
- FAQ → faq.html
- Contact → contact.html
- Dashboard → dashboard.html

---

### 2. Mobile Menu (All Pages Except 404)
**Location**: Hidden overlay, triggered by hamburger button
**Template**: `docs/templates/MOBILE-NAV.md`
**Lines**: Typically ~90-110

**Structure**:
```html
<!-- Overlay -->
<div class="mobile-menu-overlay" id="mobileMenuOverlay" onclick="closeMobileMenu()"></div>

<!-- Slide-in Menu -->
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

**JavaScript Functions** (from `js/shared.js`):
- `toggleMobileMenu()` - Opens/closes menu
- `closeMobileMenu()` - Closes menu and overlay

---

### 3. Footer (All Pages Except 404)
**Location**: Bottom of every page
**Template**: `docs/templates/FOOTER.md`
**Lines**: Typically last ~50 lines

**Structure**: 4 columns + copyright
```html
<footer>
    <div class="footer-container">
        <!-- Column 1: StarryMeet Links -->
        <div class="footer-section">
            <h3>StarryMeet</h3>
            <ul>
                <li><a href="about.html">About Us</a></li>
                <li><a href="how-it-works.html">How It Works</a></li>
                <li><a href="for-celebrities.html">For Celebrities</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>
        </div>

        <!-- Column 2: Support Links -->
        <div class="footer-section">
            <h3>Support</h3>
            <ul>
                <li><a href="faq.html">FAQ</a></li>
                <li><a href="contact.html">Help Center</a></li>
                <li><a href="terms.html">Terms of Service</a></li>
                <li><a href="privacy.html">Privacy Policy</a></li>
            </ul>
        </div>

        <!-- Column 3: Discover Links -->
        <div class="footer-section">
            <h3>Discover</h3>
            <ul>
                <li><a href="browse.html">Browse Celebrities</a></li>
                <li><a href="browse.html?category=Hollywood">Hollywood Stars</a></li>
                <li><a href="browse.html?category=Musicians">Musicians</a></li>
                <li><a href="browse.html?category=Athletes">Athletes</a></li>
            </ul>
        </div>

        <!-- Column 4: Social Links -->
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

**Total Footer Links**: 20 links across 4 columns

---

### 4. Breadcrumb Navigation (Most Content Pages)
**Location**: Below header, above hero
**Pattern**: `<div class="breadcrumb"><a href="index.html">Home</a> > [Current Page]</div>`

**Pages With Breadcrumbs**:
- how-it-works.html: Home > How It Works
- about.html: Home > About Us
- for-celebrities.html: Home > For Celebrities
- faq.html: Home > FAQ
- contact.html: Home > Contact Us
- terms.html: Home > Terms of Service
- privacy.html: Home > Privacy Policy

---

## Navigation Paths

### All Pages Can Reach (via navigation):
- index.html (logo or Home link)
- browse.html (Browse link)
- how-it-works.html (How It Works link)
- about.html (About link)
- for-celebrities.html (For Celebrities link)
- faq.html (FAQ link)
- contact.html (Contact link)
- dashboard.html (Dashboard button)

### Footer-Only Links:
- terms.html (Terms of Service)
- privacy.html (Privacy Policy)

### Special Access:
- booking.html - Only via:
  - celebrity-profile.html "Book Now" button
  - dashboard.html "New Booking" button
  - Direct URL with parameters

- celebrity-profile.html - Only via:
  - browse.html "View Profile" buttons
  - index.html featured celebrity cards
  - dashboard.html booking cards
  - Direct URL with ?name parameter

- 404.html - Only via:
  - Server redirect on broken URLs
  - Direct access attempt to non-existent pages

---

## URL Parameter Patterns

### Pages That Accept URL Parameters

**browse.html**:
- `?category=Hollywood` - Pre-filter to Hollywood
- `?category=Musicians` - Pre-filter to Musicians
- `?category=Athletes` - Pre-filter to Athletes
- `?category=Business` - Pre-filter to Business Leaders

**celebrity-profile.html** (REQUIRED):
- `?name=Taylor%20Swift` - Load specific celebrity
- URL encoding required for names with spaces

**booking.html** (OPTIONAL but CRITICAL):
- `?celebrity=Taylor%20Swift` - Pre-fill celebrity name
- `&meetingType=quick` - Pre-select Quick Meet (15 min)
- `&meetingType=standard` - Pre-select Standard Session (30 min)
- `&meetingType=premium` - Pre-select Premium Experience (60 min)
- Both parameters recommended for best UX

---

## Key Technical Integration Points

### 1. Celebrity Profile → Booking (MOST CRITICAL)
**Files**: `celebrity-profile.html` → `booking.html`
**Method**: URL parameters
**Data Passed**: celebrity name, meeting type
**Purpose**: Enable seamless booking flow with pre-selection

**Code Location**:
- celebrity-profile.html: `bookMeeting()` function (lines ~450-470)
- booking.html: `initializePage()` function (lines ~2200-2250)
- booking.html: Pre-selection logic (lines ~1534-1565)

**Test URL**:
```
booking.html?celebrity=Taylor%20Swift&meetingType=standard
```

### 2. Browse Filters
**Files**: `browse.html`
**Method**: URL parameters + JavaScript filtering
**Data Used**: Celebrity category from `celebrityData` array
**Purpose**: Category-based filtering

**Test URLs**:
```
browse.html?category=Hollywood
browse.html?category=Musicians
```

### 3. Dashboard Bookings
**Files**: `booking.html` → `dashboard.html`
**Method**: LocalStorage
**Data Passed**: Complete booking object
**Purpose**: Display booking confirmation and history

**LocalStorage Key**: `bookingData`, `bookingHistory`

---

## Future Enhancement Opportunities

### Recommended Additions
1. **Back-end API Integration**
   - Replace localStorage with database
   - Implement real authentication
   - Connect payment processing

2. **Enhanced Booking Flow**
   - Add celebrity video introductions
   - Real-time availability calendar
   - Multiple booking times selection

3. **User Profile Expansion**
   - Upload profile photos
   - Manage multiple payment methods
   - Booking preferences and history filters

4. **Celebrity Dashboard** (New Page)
   - Separate dashboard for celebrities
   - Manage availability
   - Approve/decline bookings
   - View earnings

5. **Admin Dashboard** (New Page)
   - Platform management
   - User moderation
   - Analytics and reporting

---

## Debug Documentation Structure

**Location**: `docs/debug/`
**Organization**: Page-specific folders for easy navigation
**Last Reorganized**: 2025-10-09

### Directory Structure
```
docs/debug/
├── README.md                    - Structure guide
├── DEBUG-PLAN.md                - Master debugging framework
├── DEBUG-LOG.md                 - Chronological log of all 45 issues
├── PAGE-STATUS.md               - Page completion tracker
├── COMPONENT-TEMPLATES.md       - Reusable component standards
│
└── pages/                       - Page-specific debug docs
    ├── dashboard/
    │   ├── README.md
    │   └── DASHBOARD-SIDEBAR-FIX.md (Issues #39-#45)
    │
    ├── booking/
    │   ├── README.md
    │   ├── BOOKING-FIX-SUMMARY.md
    │   └── BOOKING-INTEGRATION.md
    │
    └── celebrity-profile/
        ├── README.md
        ├── AVAILABILITY-SYNC-FIX.md
        ├── CALENDAR-SLOT-DISPLAY-FIX.md
        ├── TOTAL-SLOTS-FIX.md
        ├── LOCATION-AVAILABILITY-INTEGRATION.md
        └── ISSUES-33-36-SUMMARY.md
```

### How to Use
- **Debugging specific page?** → Go to `docs/debug/pages/{page-name}/`
- **Want chronological history?** → See `docs/debug/DEBUG-LOG.md`
- **Need framework reference?** → See `docs/debug/DEBUG-PLAN.md`
- **Starting fresh?** → Read `docs/debug/README.md`

### Benefits
✅ Page-specific organization - all dashboard issues in one folder
✅ Easy navigation with README files at each level
✅ Master log maintains complete chronological history
✅ Scalable structure for adding new pages
✅ Cross-referenced documentation

---

**Last Updated**: 2025-10-11
**Version**: 2.0.0
**Design System**: v2.0 - Cameo-Inspired Luxury Minimal
**Status**: Production Ready
**Total Issues Fixed**: 45
**Major Redesign**: Complete
