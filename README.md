# StarryMeet - Celebrity Booking Platform

> Connect fans with their icons through authentic, unforgettable experiences

**Version**: 2.0.0
**Design System**: Cameo-Inspired Luxury Minimal
**Status**: Production Ready ✅

## 🌟 Overview

StarryMeet is a premium platform that enables fans to book one-on-one meetings with verified celebrities. The platform features 35 celebrities across multiple categories including Hollywood stars, K-Drama icons, business leaders, athletes, and musicians.

### Design Philosophy (v2.0)
Inspired by Cameo's sophisticated aesthetics, StarryMeet v2.0 features:
- **Pure Black Theme** (#000000) with luxury purple and gold accents
- **Minimal Elegance** - Restrained typography, clean lines, breathing room
- **Vibrant Gradients** - 8 Cameo-style gradient card variants for emphasis
- **Gold Verified Badges** - Luxury gold gradient accents for verified elements
- **Subtle Interactions** - Gentle hover effects, smooth transitions

## 📋 Features

### For Fans
- **Browse & Discover**: Filter celebrities by category, location, and price
- **Celebrity Profiles**: Detailed profiles with availability, pricing, and reviews
- **Multi-Step Booking**: Secure 5-step booking process with instant confirmation
- **User Dashboard**: Manage bookings, saved celebrities, messages, and account settings
- **Watchlist**: Save favorite celebrities and get notified of availability
- **Secure Payments**: Encrypted payment processing with multiple card support

### For Celebrities
- **Flexible Scheduling**: Set availability around existing commitments
- **Full Control**: Approve every booking personally
- **Premium Positioning**: Featured alongside top talent
- **Professional Support**: Dedicated team handles logistics
- **Earnings Calculator**: Estimate potential monthly/annual earnings

## 🗂️ File Structure

```
starrymeet/
├── index.html              # Landing page
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
├── js/shared.js            # Common JavaScript
├── css/shared.css          # Shared styles
└── INTEGRATION.md          # Integration guide
```

## 🚀 Quick Start

1. Open `index.html` in a web browser
2. Navigate through the platform
3. All pages use shared.js and shared.css for consistency

## 💾 Data Management

**LocalStorage Schema:**
- `starryMeetWatchlist` - Saved celebrities
- `starryMeetUser` - User profile
- `starryMeetBookings` - Booking records

## 📊 Statistics

- **10 Pages**: Complete website
- **35 Celebrities**: Across 5 categories
- **10,014 Lines**: Total code
- **100% Responsive**: Mobile-first design

## 📝 Key Functions

```javascript
getCelebrityByName(name)     // Find celebrity
formatPrice(price)           // Format currency
saveToWatchlist(name)        // Save celebrity
navigateToPage(page, params) // Navigate with params
```

## 🎨 Design System (v2.0)

### Key Features
- **Typography**: Inter sans-serif, restrained sizing (h1: 48px, h2: 36px)
- **Buttons**: Fully rounded with gradient backgrounds, subtle hover glows
- **Cards**: 8 vibrant gradient variants (purple, pink, red, blue, teal, lime, orange, gold)
- **Badges**: Gold gradient verified badges with uppercase styling
- **Colors**: Pure black backgrounds (#000000) with purple (#8B5CF6) and gold (#F59E0B) accents
- **Shadows**: Extremely subtle purple-tinted glows (like a mirage)

### CSS Architecture
- **Variables**: Complete design token system in `css/shared.css`
- **Universal Dark Theme**: All pages use consistent #000000 backgrounds
- **Responsive**: Mobile-first design with tablet and desktop breakpoints

## 📄 Documentation

### Essential Docs
- `docs/QUICK-REFERENCE.md` - Fast lookup for common tasks
- `docs/SITE-ARCHITECTURE.md` - Complete architecture with v2.0 design system
- `docs/design/DESIGN-SYSTEM-V2.md` - Complete design system specifications
- `docs/design/REDESIGN-QA-CHECKLIST.md` - Quality assurance checklist
- `INTEGRATION.md` - Integration guide

### Recent Updates (v2.0)
- **Typography Refinement**: Reduced h1 from 60px to 48px, h2 from 48px to 36px
- **Button Enhancement**: Fully rounded corners, gradient backgrounds, subtle hover glows
- **Gradient Cards**: Added 8 Cameo-style gradient card variants for emphasis
- **Gold Verified Badges**: Luxury gold gradient with uppercase styling
- **Pure Black Theme**: All pages use #000000 backgrounds consistently
- **Legal Pages Fixed**: Removed inline CSS conflicts from privacy.html and terms.html

---

**Built with Claude Code** - Version 2.0.0
**Design System**: v2.0 - Cameo-Inspired Luxury Minimal
