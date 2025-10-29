# StarryMeet - Celebrity Booking Platform

> Connect fans with their icons through authentic, unforgettable experiences

**Version**: 3.0.0
**Design System**: Black-White-Gold Luxury
**Status**: Full-Stack Platform with Authentication ✅

## 🌟 Overview

StarryMeet is a premium full-stack platform that enables fans to book one-on-one meetings with verified celebrities. The platform features 35 celebrities across multiple categories including Hollywood stars, K-Drama icons, business leaders, athletes, and musicians.

### Tech Stack

**Frontend**:
- Pure HTML/CSS/JavaScript
- Cameo-inspired design system
- 13 responsive pages
- GitHub Pages deployment

**Backend**:
- Node.js 20 + Express + TypeScript
- PostgreSQL 15 with Sequelize ORM
- JWT authentication
- Stripe payments
- RESTful API

## 🚀 Quick Start

### Frontend (Local Development)

```bash
# Option 1: Live Server (recommended)
npx live-server

# Option 2: Python
python3 -m http.server 8080

# Option 3: PHP
php -S localhost:8080
```

Open browser to `http://localhost:8080`

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with database credentials
npx ts-node src/seed.ts  # Seed 35 celebrities
npx ts-node src/server.ts # Start on port 3000
```

Backend API: `http://localhost:3000`

**See [SETUP.md](SETUP.md) for detailed setup instructions.**

## 📁 Project Structure

```
starrymeet/
├── index.html              # 🏠 Homepage (GitHub Pages entry)
├── browse.html             # Browse celebrities
├── celebrity-profile.html  # Celebrity details
├── request-flow.html       # 3-step request flow ⭐ NEW
├── auth.html               # Authentication (sign in/sign up) ⭐ NEW
├── dashboard.html          # Elegant user dashboard ⭐ REDESIGNED
├── *.html                  # Other pages (16 total)
│
├── css/
│   ├── main.css            # Main stylesheet with imports
│   ├── auth.css            # Authentication styling ⭐ NEW
│   ├── dashboard-elegant.css  # Dashboard redesign ⭐ NEW
│   ├── request-flow.css    # Request flow styling ⭐ NEW
│   └── base/               # Design tokens & utilities
│       ├── _variables.css  # Black-white-gold color system
│       └── ...
│
├── js/
│   ├── shared.js           # Global JavaScript & utilities
│   ├── auth.js             # Authentication logic ⭐ NEW
│   ├── dashboard-elegant.js # Dashboard functionality ⭐ NEW
│   ├── request-flow.js     # Request flow logic ⭐ NEW
│   └── api.js              # Backend API client
│
├── assets/                 # Images, icons, media
│
├── backend/                # 🔧 Backend API
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── models/         # Sequelize models (5 models)
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth, errors
│   │   └── server.ts       # Entry point
│   ├── package.json
│   └── README.md           # Backend docs
│
├── docs/                   # 📚 Documentation
│   ├── ARCHITECTURE-VISION.md
│   ├── IMPLEMENTATION-ROADMAP.md
│   ├── BACKEND-IMPLEMENTATION-PLAN.md
│   └── design/
│
├── README.md               # This file
├── SETUP.md                # Setup guide
└── .nojekyll               # GitHub Pages config
```

### Why This Structure?

✅ **HTML at root**: GitHub Pages requires `index.html` at root
✅ **Backend separated**: Clean separation, can deploy independently
✅ **CSS/JS organized**: Easy to find and maintain
✅ **Documentation**: All docs in `docs/` folder
✅ **Deployment ready**: Frontend auto-deploys via GitHub Pages

## 📋 Features

### For Fans
- **Browse & Discover**: Filter celebrities by category, location, and price
- **Celebrity Profiles**: Detailed profiles with availability, pricing, and reviews
- **3-Step Request Flow**: Streamlined request process (Confirm → Apply → Secure)
- **User Dashboard**: Elegant dashboard to manage requests and favorites
- **Secure Payments**: Real payment processing via Stripe
- **Authentication System**: Complete sign up/sign in with session management

### For Celebrities
- **Profile Management**: Control availability and pricing
- **Booking Approval**: Review and approve booking requests
- **Reviews & Ratings**: Build reputation through verified reviews
- **Analytics**: Track bookings and earnings (future)

### For Developers
- **RESTful API**: Clean, documented API endpoints
- **TypeScript**: Type-safe backend code
- **Sequelize ORM**: Database abstraction layer
- **JWT Auth**: Stateless authentication
- **Stripe Integration**: Production-ready payments
- **API Client**: Frontend JavaScript client for easy integration

## 🎨 Design System (v3.0 - Black-White-Gold)

### Design Philosophy
Professional luxury platform with sophisticated aesthetics:
- **Black-White-Gold Theme** - Pure black (#000000), white (#FFFFFF), and gold accent (#D4A574)
- **Minimal Elegance** - Clean lines, generous spacing, clear typography hierarchy
- **Subtle Sophistication** - No gradients, focus on content with gold highlights
- **Verified Badge System** - Luxury gold accents for premium features
- **Smooth Interactions** - Gentle hover effects, polished transitions

### Key Features
- **Colors**:
  - Primary: #000000 (Black), #FFFFFF (White)
  - Accent: #D4A574 (Gold)
  - Surfaces: #1a1a1a (Weak), #2a2a2a (Base)
  - Text: #ffffff (Primary), #a0a0a0 (Secondary)
- **Typography**: System fonts, clear hierarchy
- **Buttons**: Solid gold primary buttons with hover states
- **Cards**: Clean elevated cards with subtle borders
- **Responsive**: Mobile-first design with breakpoints at 640px, 768px, 1024px

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/signup           # Create new account
POST   /api/auth/signin           # Sign in with email/password
GET    /api/auth/verify           # Verify session token (requires auth)
POST   /api/auth/signout          # Sign out and delete session (requires auth)
POST   /api/auth/forgot-password  # Request password reset

# Legacy endpoints (backward compatibility)
POST   /api/auth/register         # Alias for signup
POST   /api/auth/login            # Alias for signin
GET    /api/auth/me               # Get current user (requires auth)
```

### Celebrities
```
GET    /api/celebrities              # List all (with filters)
GET    /api/celebrities/:id          # Get single celebrity
GET    /api/celebrities/:id/reviews  # Get reviews
```

### Bookings
```
POST   /api/bookings                 # Create booking
GET    /api/bookings                 # List user's bookings
GET    /api/bookings/:id             # Get booking details
PATCH  /api/bookings/:id/cancel      # Cancel booking
```

### Payments
```
POST   /api/payments/create-intent   # Create Stripe payment intent
POST   /api/payments/webhook          # Stripe webhook handler
```

## 💾 Database Schema

### Core Tables
- **users** - User accounts with authentication fields (email, password_hash, verification tokens)
- **sessions** - Active user sessions with JWT tokens and expiration
- **user_profiles** - Extended user information (bio, location, social links, preferences)
- **favorites** - User's favorite celebrities
- **celebrities** - Celebrity profiles with pricing (35 seeded)
- **bookings** - Booking records with status lifecycle
- **payments** - Stripe payment records
- **reviews** - User reviews and ratings

## 📊 Statistics

### Frontend
- **13 Pages**: Complete website
- **35 Celebrities**: Across 5 categories
- **100% Responsive**: Mobile-first design
- **0 Build Dependencies**: Pure HTML/CSS/JS

### Backend
- **26 TypeScript files**: ~2,080 lines of code
- **5 Database models**: Full relational schema
- **4 Controller files**: Complete CRUD operations
- **REST API**: All endpoints documented
- **JWT Auth**: Secure authentication

## 🔧 Development

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- npm or yarn

### Setup

1. **Clone repository**
```bash
git clone https://github.com/whoamyi/starrymeet.git
cd starrymeet
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npx ts-node src/seed.ts
npx ts-node src/server.ts
```

3. **Open Frontend**
```bash
# From root directory
npx live-server
```

4. **Access Application**
- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:3000`
- API Health: `http://localhost:3000/health`

**See [SETUP.md](SETUP.md) for complete setup guide.**

## 📄 Documentation

### Essential Docs
- **[SETUP.md](SETUP.md)** - Complete setup guide (start here!)
- **[backend/README.md](backend/README.md)** - Backend API documentation
- **[docs/ARCHITECTURE-VISION.md](docs/ARCHITECTURE-VISION.md)** - Full-stack architecture
- **[docs/IMPLEMENTATION-ROADMAP.md](docs/IMPLEMENTATION-ROADMAP.md)** - Development roadmap
- **[docs/design/DESIGN-SYSTEM-V2.md](docs/design/DESIGN-SYSTEM-V2.md)** - Design specifications

### Quick Reference
- `docs/QUICK-REFERENCE.md` - Fast lookup guide
- `docs/SITE-ARCHITECTURE.md` - Architecture overview
- `docs/design/BRAND-IDENTITY.md` - Brand guidelines

## 🚀 Deployment

### Frontend (GitHub Pages)

Already configured! Frontend auto-deploys to GitHub Pages:

```bash
git push origin main
```

**Live URL**: `https://whoamyi.github.io/starrymeet/`

### Backend (Production)

Deploy to AWS, Heroku, Railway, or any Node.js hosting:

```bash
# Build
npm run build

# Start
npm start
```

See [backend/README.md](backend/README.md) for detailed deployment instructions.

## 📈 Roadmap

### Phase 1: MVP ✅ COMPLETE
- [x] Frontend design and pages
- [x] Backend API with authentication
- [x] Database schema and models
- [x] Stripe payment integration
- [x] Celebrity search and filtering
- [x] Booking system
- [x] Frontend-Backend integration

### Phase 2: Production (In Progress) ⏳
- [x] API client for frontend
- [x] Complete authentication system (sign up, sign in, sessions)
- [x] Black-white-gold design system migration
- [x] Elegant dashboard redesign
- [x] Streamlined 3-step request flow
- [ ] Real-time messaging
- [ ] Email notifications
- [ ] Production deployment
- [ ] SSL/HTTPS setup

### Phase 3: Scale (Future)
- [ ] Mobile apps (React Native)
- [ ] Elasticsearch search
- [ ] Analytics dashboard
- [ ] Admin panel
- [ ] Advanced features

## 🤝 Contributing

This is a personal project. For suggestions or issues, please contact the developer.

## 📝 License

Private project - All rights reserved.

---

**Built with Claude Code** - Version 3.0.0
**Tech Stack**: HTML/CSS/JS + Node.js/Express/TypeScript + PostgreSQL
**Design System**: v3.0 - Black-White-Gold Luxury

**Frontend**: ✅ Complete - Live on GitHub Pages
**Backend**: ✅ Complete - Authentication & API ready
**Authentication**: ✅ Complete - Session-based with JWT
**Status**: Full-Stack Platform with Modern Auth Ready for Production

💻 **Quick Start**: See [SETUP.md](SETUP.md)
🔌 **API Docs**: See [backend/README.md](backend/README.md)
🎨 **Design**: See [docs/design/](docs/design/)
