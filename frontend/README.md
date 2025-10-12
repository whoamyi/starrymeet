# StarryMeet Frontend

Static HTML/CSS/JavaScript frontend for the StarryMeet celebrity booking platform.

## Overview

The frontend is built with vanilla HTML, CSS, and JavaScript - no build tools or frameworks required. It's designed to work as a progressive web app with responsive design across all devices.

## Quick Start

### Option 1: Live Server (Recommended)

```bash
cd frontend
npx live-server
```

Open browser to `http://localhost:8080`

### Option 2: Simple HTTP Server

```bash
cd frontend
python3 -m http.server 8000
# or
php -S localhost:8000
```

Open browser to `http://localhost:8000`

### Option 3: VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

## File Structure

```
frontend/
├── index.html                  # Homepage
├── browse.html                 # Browse celebrities
├── celebrity-profile.html      # Celebrity details
├── booking.html                # 5-step booking flow
├── dashboard.html              # User dashboard
├── how-it-works.html          # Process explanation
├── about.html                  # Company info
├── for-celebrities.html        # Celebrity onboarding
├── faq.html                    # FAQ page
├── contact.html                # Contact form
├── terms.html                  # Terms of service
├── privacy.html                # Privacy policy
├── 404.html                    # Error page
│
├── css/
│   ├── shared.css              # Global styles & design system
│   └── pages/
│       ├── index.css           # Homepage styles
│       ├── browse.css          # Browse page styles
│       ├── celebrity-profile.css
│       ├── booking.css
│       ├── dashboard.css
│       └── ...
│
├── js/
│   └── shared.js               # Global JavaScript & utilities
│
└── assets/                     # Images, icons, media (future)
```

## Design System

### Colors

```css
--black: #000000;              /* Pure black backgrounds */
--white: #FFFFFF;              /* Pure white text */
--primary: #8B5CF6;            /* Purple (primary brand) */
--accent: #F59E0B;             /* Gold (accents, verified badges) */
--text-primary: #FFFFFF;       /* Primary text */
--text-secondary: #9CA3AF;     /* Secondary text */
--text-tertiary: #6B7280;      /* Tertiary text */
```

### Typography

```css
--font-display: 'Inter', sans-serif;  /* Headings */
--font-body: 'Inter', sans-serif;     /* Body text */

h1: 48px (clamp)
h2: 36px (clamp)
h3: 24px
Body: 16px
Small: 14px
```

### Spacing

Based on 8px grid system:
- `--space-1`: 4px
- `--space-2`: 8px
- `--space-3`: 12px
- `--space-4`: 16px
- `--space-6`: 24px
- `--space-8`: 32px

### Components

- **Buttons**: Fully rounded, gradient backgrounds, subtle glow on hover
- **Cards**: Dark backgrounds with subtle borders, gradient hover effects
- **Badges**: Gold gradient for verified status
- **Inputs**: Dark backgrounds, purple focus rings
- **Shadows**: Extremely subtle purple-tinted glows

## Key Features

### Navigation

Responsive header with:
- Logo
- Desktop menu (Browse, How It Works, For Celebrities)
- Mobile hamburger menu
- Auth buttons (Login/Sign Up)

### Celebrity Cards

Display celebrity information with:
- Avatar (gradient background with initials)
- Name (body font, white, normal weight)
- Category badge
- Location
- Price (12px, subtle)
- Rating (golden star ★ 4.89)

### Booking Flow (5 Steps)

1. **Meeting Type**: Select Quick (15min), Standard (30min), or Premium (60min)
2. **Date & Time**: Calendar picker and time slot selection
3. **Personal Details**: Contact information and special requests
4. **Review**: Summary of booking details
5. **Payment**: Stripe payment form (connects to backend)

### Dashboard

User dashboard with tabs:
- Overview
- Upcoming Meetings
- Past Meetings
- Saved Celebrities
- Messages
- Settings

## Data Management

### LocalStorage Keys

```javascript
starryMeetWatchlist    // Saved celebrities
starryMeetUser         // User profile
starryMeetBookings     // Booking records
```

### Celebrity Data

35 celebrities across 5 categories:
- Hollywood (15 celebrities)
- K-Drama (5 celebrities)
- Business Leaders (5 celebrities)
- Athletes (5 celebrities)
- Musicians (5 celebrities)

## JavaScript Functions

### Global Functions (shared.js)

```javascript
getCelebrityByName(name)           // Find celebrity by name
getAllCelebrities()                // Get all celebrities
getCelebritiesByCategory(category) // Filter by category
getInitials(name)                  // Get initials (e.g., "EW")
formatPrice(price)                 // Format currency ($5,000)
saveToWatchlist(name)              // Save celebrity
navigateToPage(page, params)       // Navigate with URL params
```

## Responsive Design

### Breakpoints

```css
Mobile: < 768px
Tablet: 768px - 1024px
Desktop: > 1024px
```

### Mobile Features

- Hamburger menu
- Stacked layout
- Touch-optimized buttons
- Swipeable carousels
- Bottom navigation (dashboard)

## Pages Overview

### Homepage (index.html)

- Hero section with "Your Memory. Your Moment"
- Featured celebrities carousel
- Categories grid
- How it works section
- Trust indicators
- CTA sections

### Browse (browse.html)

- Celebrity grid/list
- Category filters
- Search bar
- Price range filter
- Location filter
- Sorting options

### Celebrity Profile (celebrity-profile.html)

- Hero image with initials
- Profile information
- Pricing options
- Availability calendar
- Reviews section
- Similar celebrities

### Booking (booking.html)

- 5-step wizard
- Progress indicator
- Form validation
- Price calculation
- Payment integration (Stripe)

### Dashboard (dashboard.html)

- Sidebar navigation
- Tabbed interface
- Booking management
- Message center
- Account settings

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Integration with Backend

### API Endpoints (to implement)

```javascript
// Replace localStorage with API calls

// Auth
POST /api/auth/register
POST /api/auth/login

// Celebrities
GET /api/celebrities
GET /api/celebrities/:id

// Bookings
POST /api/bookings
GET /api/bookings

// Payments
POST /api/payments/create-intent
```

### Example API Client (to add)

```javascript
// js/api.js
const API_URL = 'http://localhost:3000/api';

async function fetchCelebrities(filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_URL}/celebrities?${params}`);
  return response.json();
}
```

## Development Workflow

1. **Edit HTML/CSS/JS** in VS Code or your editor
2. **Live reload** with Live Server
3. **Test** on different screen sizes
4. **Commit** changes to git
5. **Deploy** to GitHub Pages or hosting

## Deployment

### GitHub Pages

Already configured with `.nojekyll` file.

Website auto-deploys to: `https://yourusername.github.io/starrymeet/frontend/`

### Custom Domain

1. Add `CNAME` file to frontend/
2. Configure DNS records
3. Enable HTTPS in GitHub settings

## Performance

- No build step required
- Minimal JavaScript
- Optimized CSS (custom properties)
- Lazy loading images (future)
- Service worker (future PWA)

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader friendly
- High contrast colors

## Future Enhancements

- [ ] Replace localStorage with backend API
- [ ] Add real Stripe payment processing
- [ ] Implement real-time messaging
- [ ] Add push notifications
- [ ] Progressive Web App features
- [ ] Image optimization
- [ ] Code splitting
- [ ] Service worker for offline support

---

**Version**: 2.0.0
**Design System**: Cameo-Inspired Luxury Minimal
**Status**: Frontend Complete - Ready for Backend Integration
