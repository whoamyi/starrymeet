# StarryMeet - Celebrity Booking Platform

> Connect fans with their icons through authentic, unforgettable experiences

**Version**: 2.0.0
**Design System**: Cameo-Inspired Luxury Minimal
**Status**: Full-Stack Platform ✅

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
├── booking.html            # 5-step booking flow
├── dashboard.html          # User dashboard
├── *.html                  # Other pages (13 total)
│
├── css/
│   ├── shared.css          # Global styles & design system
│   └── pages/              # Page-specific styles
│       ├── index.css
│       ├── browse.css
│       └── ...
│
├── js/
│   ├── shared.js           # Global JavaScript & utilities
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
- **Multi-Step Booking**: Secure 5-step booking process with Stripe integration
- **User Dashboard**: Manage bookings, saved celebrities, messages, and settings
- **Secure Payments**: Real payment processing via Stripe
- **JWT Authentication**: Secure user accounts with token-based auth

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

## 🎨 Design System (v2.0)

### Design Philosophy
Inspired by Cameo's sophisticated aesthetics:
- **Pure Black Theme** (#000000) with luxury purple and gold accents
- **Minimal Elegance** - Restrained typography, clean lines, breathing room
- **Vibrant Gradients** - 8 Cameo-style gradient card variants
- **Gold Verified Badges** - Luxury gold gradient accents
- **Subtle Interactions** - Gentle hover effects, smooth transitions

### Key Features
- **Typography**: Inter sans-serif, restrained sizing (h1: 48px, h2: 36px)
- **Buttons**: Fully rounded with gradient backgrounds, subtle hover glows
- **Cards**: 8 vibrant gradient variants for emphasis
- **Colors**: Pure black backgrounds with purple (#8B5CF6) and gold (#F59E0B) accents
- **Responsive**: Mobile-first design with breakpoints at 768px and 1024px

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login
GET    /api/auth/me            # Get current user
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
- **users** - User accounts with JWT authentication
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

### Phase 1: MVP ✅
- [x] Frontend design and pages
- [x] Backend API with authentication
- [x] Database schema and models
- [x] Stripe payment integration
- [x] Celebrity search and filtering
- [x] Booking system
- [x] Frontend-Backend integration

### Phase 2: Production (In Progress)
- [x] API client for frontend
- [ ] Real-time messaging
- [ ] Email notifications (SendGrid)
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

**Built with Claude Code** - Version 2.0.0
**Tech Stack**: HTML/CSS/JS + Node.js/Express/TypeScript + PostgreSQL
**Design System**: v2.0 - Cameo-Inspired Luxury Minimal

**Frontend**: ✅ Complete - Live on GitHub Pages
**Backend**: ✅ Complete - Ready for deployment
**Status**: Full-Stack Platform Ready for Production

💻 **Quick Start**: See [SETUP.md](SETUP.md)
🔌 **API Docs**: See [backend/README.md](backend/README.md)
🎨 **Design**: See [docs/design/](docs/design/)
