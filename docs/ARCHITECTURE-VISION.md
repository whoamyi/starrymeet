# StarryMeet Architecture Vision

**Document Type**: Target Architecture (Full-Stack Vision)
**Status**: 🎯 Vision / Planning
**Last Updated**: 2025-10-10
**Version**: 1.0.0

> **Purpose**: This document defines the COMPLETE target architecture for StarryMeet, modeling after Cameo's proven structure but adapted for in-person celebrity meetings. This is the END GOAL - what the system should look like when fully built.

---

## Executive Summary

**What StarryMeet Is**: A platform connecting fans with celebrities for in-person meetups (inspired by Cameo's video model, but for physical meetings).

**Business Model**: Marketplace connecting supply (celebrities) with demand (fans), taking a platform fee on each successful booking.

**Technical Approach**: Full-stack web application with:
- **Frontend**: Progressive Web App (React/Vue) for responsive, app-like experience
- **Backend**: Node.js/Express API server with microservices architecture
- **Database**: PostgreSQL (relational) + Redis (caching) + S3 (media)
- **Payments**: Stripe integration for secure transactions
- **Real-time**: WebSockets for live updates (booking confirmations, messages)
- **Infrastructure**: Cloud-hosted (AWS/GCP) with CDN, auto-scaling, monitoring

---

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Database Design](#database-design)
5. [API Design](#api-design)
6. [Authentication & Authorization](#authentication--authorization)
7. [Payment Processing](#payment-processing)
8. [Real-Time Features](#real-time-features)
9. [Media & File Management](#media--file-management)
10. [Search & Discovery](#search--discovery)
11. [Notifications System](#notifications-system)
12. [Admin Dashboard](#admin-dashboard)
13. [Analytics & Tracking](#analytics--tracking)
14. [Security & Compliance](#security--compliance)
15. [Infrastructure & DevOps](#infrastructure--devops)
16. [Third-Party Integrations](#third-party-integrations)
17. [Scalability Plan](#scalability-plan)

---

## System Architecture Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  Web App (React/Vue)  │  iOS App (Native)  │  Android App   │
│  Progressive Web App  │  (Future Phase 2)  │  (Future P2)   │
└──────────────┬────────────────────────────────────────────────┘
               │
               ├─── CDN (CloudFront/Cloudflare) ───────────┐
               │                                            │
               ↓                                            ↓
┌──────────────────────────────────┐          ┌──────────────────────┐
│        API GATEWAY LAYER         │          │    STATIC ASSETS     │
├──────────────────────────────────┤          │  Images, CSS, JS     │
│  - Rate Limiting                 │          │  S3 + CloudFront     │
│  - Request Validation            │          └──────────────────────┘
│  - Load Balancing                │
│  - SSL Termination               │
└──────────────┬───────────────────┘
               │
               ↓
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   User       │  Celebrity   │   Booking    │   Payment      │
│   Service    │   Service    │   Service    │   Service      │
│  (Node.js)   │  (Node.js)   │  (Node.js)   │  (Node.js)     │
└──────┬───────┴──────┬───────┴──────┬───────┴────────┬───────┘
       │              │              │                │
       ├──────────────┴──────────────┴────────────────┤
       │                                               │
       ↓                                               ↓
┌──────────────────────────┐              ┌──────────────────────┐
│   MESSAGE QUEUE          │              │   CACHE LAYER        │
│   (RabbitMQ/SQS)         │              │   (Redis)            │
│  - Async Tasks           │              │  - Session Store     │
│  - Email Queue           │              │  - API Cache         │
│  - Notifications         │              │  - Rate Limit Data   │
└──────────────────────────┘              └──────────────────────┘
       │
       ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  PostgreSQL  │   MongoDB    │      S3      │   Elasticsearch│
│  (Primary DB)│  (Logs/Docs) │  (Media)     │   (Search)     │
│  - Users     │  - Analytics │  - Photos    │  - Celebrity   │
│  - Bookings  │  - Audit Log │  - Videos    │    Search      │
│  - Payments  │              │  - Uploads   │  - Location    │
└──────────────┴──────────────┴──────────────┴────────────────┘
```

### Technology Stack

**Frontend**:
- **Framework**: React 18 (with hooks, context API)
- **State Management**: Redux Toolkit + React Query
- **UI Components**: Material-UI or Tailwind CSS + Headless UI
- **Forms**: React Hook Form + Yup validation
- **Routing**: React Router v6
- **Build Tool**: Vite (fast dev server, optimized builds)
- **PWA**: Workbox for offline support, app-like experience
- **Testing**: Jest + React Testing Library + Cypress (E2E)

**Backend**:
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js (REST API) + Socket.io (WebSocket)
- **Language**: TypeScript (type safety, better DX)
- **API Style**: RESTful + GraphQL (for complex queries)
- **Validation**: Joi or Zod (runtime validation)
- **ORM**: Prisma (type-safe database access)
- **Testing**: Jest + Supertest
- **Documentation**: Swagger/OpenAPI

**Database**:
- **Primary DB**: PostgreSQL 15+ (ACID compliance, relational data)
- **Cache**: Redis 7+ (sessions, rate limiting, API cache)
- **Search**: Elasticsearch 8+ (full-text search, filters)
- **File Storage**: AWS S3 (media files, documents)
- **Analytics**: MongoDB (flexible schema for events)

**Infrastructure**:
- **Cloud Provider**: AWS (or GCP as alternative)
- **Container**: Docker + Docker Compose (dev), Kubernetes (prod)
- **CI/CD**: GitHub Actions → AWS CodePipeline
- **Monitoring**: Datadog or New Relic + Sentry (error tracking)
- **CDN**: CloudFront (AWS) or Cloudflare
- **DNS**: Route 53 (AWS) or Cloudflare

**Third-Party Services**:
- **Payments**: Stripe (processing, escrow, payouts)
- **Email**: SendGrid or AWS SES
- **SMS**: Twilio (notifications, 2FA)
- **Maps**: Google Maps API (location selection, geocoding)
- **Calendar**: Google Calendar API (celebrity schedule sync)
- **Video Chat**: Twilio Video (for virtual pre-meeting verification)
- **File Upload**: AWS S3 + CloudFront
- **Background Jobs**: Bull (Redis-backed queue)

---

## Frontend Architecture

### Application Structure

```
src/
├── assets/              # Static assets (images, fonts, icons)
├── components/          # Reusable UI components
│   ├── common/          # Generic components (Button, Input, Card)
│   ├── layout/          # Layout components (Header, Footer, Sidebar)
│   └── features/        # Feature-specific components
│       ├── booking/     # Booking flow components
│       ├── celebrity/   # Celebrity card, profile components
│       └── user/        # User profile, dashboard components
├── pages/               # Page-level components (routes)
│   ├── Home.tsx
│   ├── Browse.tsx
│   ├── CelebrityProfile.tsx
│   ├── Booking.tsx
│   ├── Dashboard.tsx
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useAuth.ts
│   ├── useBooking.ts
│   └── useCelebrity.ts
├── services/            # API client services
│   ├── api.ts           # Base API configuration
│   ├── authService.ts
│   ├── bookingService.ts
│   └── celebrityService.ts
├── store/               # Redux store
│   ├── slices/          # Redux Toolkit slices
│   │   ├── authSlice.ts
│   │   ├── bookingSlice.ts
│   │   └── celebritySlice.ts
│   └── index.ts
├── utils/               # Utility functions
│   ├── validation.ts
│   ├── formatting.ts
│   └── helpers.ts
├── types/               # TypeScript type definitions
│   ├── user.types.ts
│   ├── booking.types.ts
│   └── celebrity.types.ts
├── routes/              # Route configuration
│   └── index.tsx
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

### Key Pages & User Flows

**1. Home Page** (`/`)
- Hero section with search
- Featured celebrities carousel
- How it works section
- Testimonials
- CTA to browse or sign up

**2. Browse Celebrities** (`/browse`)
- Filter sidebar:
  - Category (Actor, Musician, Athlete, etc.)
  - Price range ($50 - $10,000+)
  - Location (city/country)
  - Availability (dates)
  - Rating (4+ stars, 3+, etc.)
- Celebrity grid/list view toggle
- Pagination (infinite scroll or numbered pages)
- Search bar (name, keywords)
- Sort options (Price, Rating, Popularity, Newest)

**3. Celebrity Profile** (`/celebrity/:username`)
- Profile header:
  - Photo, name, profession
  - Rating (5-star) + review count
  - Price per meeting type
  - Availability indicator (green dot = available now)
- Bio section (about the celebrity)
- Meeting types offered:
  - Quick Meet (15 min) - $X
  - Standard Meet (30 min) - $Y
  - Premium Meet (60 min) - $Z
  - Custom packages (if applicable)
- Reviews tab (user testimonials)
- FAQs tab (celebrity-specific Q&A)
- Location availability (cities they visit)
- Calendar widget (available dates)
- "Book Now" CTA button

**4. Booking Flow** (`/booking/:celebrityId`)
- **Step 1: Meeting Type**
  - Select package (Quick/Standard/Premium)
  - Shows price, duration, what's included
- **Step 2: Location & Date**
  - Select city/location
  - Calendar with available dates
  - Time slot selection
- **Step 3: Personal Details**
  - Fan name, email, phone
  - Special requests/notes for celebrity
  - Occasion (birthday, gift, etc.)
- **Step 4: Payment**
  - Payment method (card, Apple Pay, Google Pay)
  - Billing address
  - Order summary
  - Terms acceptance
- **Step 5: Confirmation**
  - Booking confirmed message
  - Booking ID
  - Email confirmation sent
  - Download receipt
  - Next steps (expect email from celebrity team)

**5. User Dashboard** (`/dashboard`)
- Sidebar navigation:
  - Overview
  - Upcoming Meetings
  - Past Meetings
  - Messages
  - Favorites (saved celebrities)
  - Payment Methods
  - Account Settings
- **Overview Tab**:
  - Next meeting countdown
  - Recent bookings status
  - Saved celebrities
  - Recommendations
- **Upcoming Meetings Tab**:
  - List of confirmed meetings
  - Meeting details (date, time, location)
  - Reschedule/cancel options (if policy allows)
  - Add to calendar button
  - Countdown timer
- **Past Meetings Tab**:
  - History of completed meetings
  - Leave review button
  - Rebook option
- **Messages Tab**:
  - Chat with celebrity team
  - Booking-related communication
  - Real-time updates
- **Favorites Tab**:
  - Saved celebrity list
  - Quick book from favorites
- **Account Settings Tab**:
  - Profile editing
  - Password change
  - Email preferences
  - Payment methods
  - Privacy settings

**6. Celebrity Dashboard** (`/celebrity/dashboard`) - Future
- Manage availability/calendar
- Set pricing
- Review booking requests
- Manage profile
- View earnings
- Payout settings

---

## Backend Architecture

### Microservices Structure

```
services/
├── api-gateway/              # Entry point, routing, auth middleware
│   ├── src/
│   │   ├── middleware/       # Auth, rate limiting, logging
│   │   ├── routes/           # Route aggregation
│   │   └── server.ts
│   └── package.json
│
├── user-service/             # User management
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # User data models
│   │   ├── routes/           # User routes
│   │   ├── services/         # Business logic
│   │   └── server.ts
│   └── package.json
│
├── celebrity-service/        # Celebrity profiles, catalog
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.ts
│   └── package.json
│
├── booking-service/          # Booking management
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── workers/          # Background jobs
│   │   └── server.ts
│   └── package.json
│
├── payment-service/          # Payment processing
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── stripe/           # Stripe integration
│   │   └── server.ts
│   └── package.json
│
├── notification-service/     # Email, SMS, push notifications
│   ├── src/
│   │   ├── services/
│   │   ├── templates/        # Email templates
│   │   ├── workers/
│   │   └── server.ts
│   └── package.json
│
├── search-service/           # Elasticsearch integration
│   ├── src/
│   │   ├── controllers/
│   │   ├── indexers/         # Index management
│   │   ├── services/
│   │   └── server.ts
│   └── package.json
│
└── analytics-service/        # Event tracking, metrics
    ├── src/
    │   ├── collectors/
    │   ├── processors/
    │   └── server.ts
    └── package.json
```

### Service Responsibilities

**API Gateway**:
- Route incoming requests to appropriate microservice
- Authentication middleware (JWT validation)
- Rate limiting (protect against abuse)
- Request/response logging
- CORS handling
- SSL termination

**User Service**:
- User registration/login
- Profile management
- Password reset
- Email verification
- OAuth integration (Google, Facebook, Apple)
- User preferences
- Session management

**Celebrity Service**:
- Celebrity profile CRUD
- Category management
- Availability management
- Pricing configuration
- Media upload (photos, videos)
- Review aggregation
- Featured celebrities logic

**Booking Service**:
- Create booking requests
- Booking status management (pending, confirmed, completed, canceled)
- Availability checking (prevent double-booking)
- Calendar integration
- Booking modifications (reschedule, cancel)
- Refund policy enforcement
- Booking confirmation emails

**Payment Service**:
- Stripe integration
- Payment processing
- Refund handling
- Payout management (to celebrities)
- Transaction history
- Invoice generation
- Payment method storage
- Escrow management (hold funds until meeting confirmed)

**Notification Service**:
- Email notifications (SendGrid/SES)
- SMS notifications (Twilio)
- Push notifications (FCM for mobile)
- Template management
- Notification preferences
- Queue-based sending (Bull + Redis)

**Search Service**:
- Elasticsearch index management
- Celebrity search (name, category, location)
- Autocomplete suggestions
- Filtering & sorting logic
- Relevance scoring
- Search analytics

**Analytics Service**:
- Event tracking (page views, clicks, bookings)
- User behavior analysis
- Celebrity performance metrics
- Revenue analytics
- A/B testing support
- Dashboard data aggregation

---

## Database Design

### PostgreSQL Schema

**Core Tables**:

```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    role VARCHAR(20) DEFAULT 'user', -- 'user', 'celebrity', 'admin'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- Celebrities Table
CREATE TABLE celebrities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    profession VARCHAR(100), -- 'Actor', 'Musician', 'Athlete', etc.
    category_id INT REFERENCES categories(id),
    bio TEXT,
    profile_photo_url TEXT,
    cover_photo_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    total_bookings INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT
);

-- Meeting Types Table (packages offered by celebrity)
CREATE TABLE meeting_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    celebrity_id UUID REFERENCES celebrities(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- 'Quick Meet', 'Standard', 'Premium'
    duration_minutes INT NOT NULL, -- 15, 30, 60
    price_cents INT NOT NULL, -- Price in cents (e.g., $50.00 = 5000)
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Celebrity Availability (locations they visit)
CREATE TABLE celebrity_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    celebrity_id UUID REFERENCES celebrities(id) ON DELETE CASCADE,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Available Dates (specific dates celebrity is available)
CREATE TABLE available_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    availability_id UUID REFERENCES celebrity_availability(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_slots INT NOT NULL, -- Max bookings for this date
    booked_slots INT DEFAULT 0,
    is_blocked BOOLEAN DEFAULT FALSE, -- Manual block by celebrity
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(availability_id, date, start_time)
);

-- Bookings Table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_number VARCHAR(20) UNIQUE NOT NULL, -- e.g., 'BK-2025-001234'
    user_id UUID REFERENCES users(id),
    celebrity_id UUID REFERENCES celebrities(id),
    meeting_type_id UUID REFERENCES meeting_types(id),
    available_date_id UUID REFERENCES available_dates(id),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'canceled', 'refunded'
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    location_city VARCHAR(100) NOT NULL,
    location_country VARCHAR(100) NOT NULL,
    price_cents INT NOT NULL, -- Final price paid
    platform_fee_cents INT NOT NULL, -- Our commission
    celebrity_payout_cents INT NOT NULL, -- Celebrity's earnings
    special_requests TEXT,
    fan_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    confirmed_at TIMESTAMP,
    completed_at TIMESTAMP,
    canceled_at TIMESTAMP
);

-- Payments Table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    amount_cents INT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'succeeded', 'failed', 'refunded'
    payment_method VARCHAR(50), -- 'card', 'apple_pay', 'google_pay'
    refund_amount_cents INT DEFAULT 0,
    stripe_refund_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    celebrity_id UUID REFERENCES celebrities(id),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    is_verified BOOLEAN DEFAULT TRUE, -- Only from actual bookings
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(booking_id) -- One review per booking
);

-- Messages Table (chat between user and celebrity team)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id),
    recipient_id UUID REFERENCES users(id),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Favorites Table (users save celebrities to wishlist)
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    celebrity_id UUID REFERENCES celebrities(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, celebrity_id)
);

-- Indexes for performance
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_celebrity ON bookings(celebrity_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_celebrities_category ON celebrities(category_id);
CREATE INDEX idx_celebrities_rating ON celebrities(average_rating DESC);
CREATE INDEX idx_available_dates_date ON available_dates(date);
CREATE INDEX idx_reviews_celebrity ON reviews(celebrity_id);
CREATE INDEX idx_messages_booking ON messages(booking_id);
```

### Redis Cache Strategy

**Cache Keys**:
```
celebrity:{id}                  → Celebrity full profile (TTL: 1 hour)
celebrity:list:{category}       → Celebrity list by category (TTL: 30 min)
celebrity:featured              → Featured celebrities (TTL: 1 hour)
user:{id}:session               → User session data (TTL: 7 days)
booking:{id}                    → Booking details (TTL: 1 hour)
availability:{celebrity_id}     → Celebrity availability (TTL: 10 min)
rate_limit:{ip}:{endpoint}      → Rate limiting (TTL: 1 min)
```

**Cache Invalidation**:
- On celebrity profile update: Delete `celebrity:{id}`
- On booking creation: Delete `availability:{celebrity_id}`
- On review submission: Delete `celebrity:{id}` (rating changed)

---

## API Design

### RESTful API Endpoints

**Base URL**: `https://api.starrymeet.com/v1`

**Authentication**: Bearer token (JWT) in `Authorization` header

**Core Endpoints**:

```
┌─────────────────────────────────────────────────────────────┐
│                        AUTH ENDPOINTS                        │
└─────────────────────────────────────────────────────────────┘
POST   /auth/register           # Create new user account
POST   /auth/login              # Login and get JWT token
POST   /auth/logout             # Logout (invalidate token)
POST   /auth/refresh            # Refresh access token
POST   /auth/forgot-password    # Request password reset email
POST   /auth/reset-password     # Reset password with token
POST   /auth/verify-email       # Verify email address
POST   /auth/resend-verification # Resend verification email

┌─────────────────────────────────────────────────────────────┐
│                       USER ENDPOINTS                         │
└─────────────────────────────────────────────────────────────┘
GET    /users/me                # Get current user profile
PATCH  /users/me                # Update current user profile
DELETE /users/me                # Delete account
POST   /users/me/avatar         # Upload profile avatar
GET    /users/me/bookings       # Get user's bookings
GET    /users/me/favorites      # Get user's favorite celebrities
POST   /users/me/favorites      # Add celebrity to favorites
DELETE /users/me/favorites/:id  # Remove from favorites

┌─────────────────────────────────────────────────────────────┐
│                    CELEBRITY ENDPOINTS                       │
└─────────────────────────────────────────────────────────────┘
GET    /celebrities             # List celebrities (with filters)
                               # Query params: ?category=actor&city=LA&minPrice=50&maxPrice=500
GET    /celebrities/:id         # Get celebrity details
GET    /celebrities/:id/reviews # Get celebrity reviews
GET    /celebrities/:id/availability # Get available dates/locations
GET    /celebrities/featured    # Get featured celebrities
GET    /celebrities/search      # Search celebrities by name
GET    /categories              # Get all celebrity categories

┌─────────────────────────────────────────────────────────────┐
│                     BOOKING ENDPOINTS                        │
└─────────────────────────────────────────────────────────────┘
POST   /bookings                # Create new booking
GET    /bookings/:id            # Get booking details
PATCH  /bookings/:id            # Update booking (reschedule)
DELETE /bookings/:id            # Cancel booking
GET    /bookings/:id/messages   # Get booking chat messages
POST   /bookings/:id/messages   # Send message about booking
POST   /bookings/:id/review     # Leave review after meeting

┌─────────────────────────────────────────────────────────────┐
│                     PAYMENT ENDPOINTS                        │
└─────────────────────────────────────────────────────────────┘
POST   /payments/create-intent  # Create Stripe payment intent
POST   /payments/confirm        # Confirm payment
POST   /payments/:id/refund     # Process refund
GET    /payments/:id            # Get payment details
GET    /payments/methods        # Get saved payment methods
POST   /payments/methods        # Add payment method
DELETE /payments/methods/:id    # Remove payment method

┌─────────────────────────────────────────────────────────────┐
│                      SEARCH ENDPOINTS                        │
└─────────────────────────────────────────────────────────────┘
GET    /search/celebrities      # Full-text search celebrities
GET    /search/suggestions      # Autocomplete suggestions
POST   /search/filters          # Advanced filtering
```

### Example API Request/Response

**GET /celebrities?category=actor&city=Los%20Angeles&minPrice=50&maxPrice=500**

Response:
```json
{
  "success": true,
  "data": {
    "celebrities": [
      {
        "id": "uuid-123",
        "username": "emmawatson",
        "displayName": "Emma Watson",
        "profession": "Actor",
        "category": {
          "id": 1,
          "name": "Actors & Actresses"
        },
        "profilePhoto": "https://cdn.starrymeet.com/celebs/emma-watson.jpg",
        "averageRating": 4.9,
        "totalReviews": 328,
        "totalBookings": 450,
        "isVerified": true,
        "meetingTypes": [
          {
            "id": "uuid-mt-1",
            "name": "Quick Meet",
            "durationMinutes": 15,
            "priceCents": 15000,
            "description": "Quick photo and autograph"
          },
          {
            "id": "uuid-mt-2",
            "name": "Standard Meet",
            "durationMinutes": 30,
            "priceCents": 25000,
            "description": "Photo, autograph, and short conversation"
          }
        ],
        "availability": [
          {
            "city": "Los Angeles",
            "country": "USA",
            "availableDatesCount": 8
          }
        ]
      }
      // ... more celebrities
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8
    },
    "filters": {
      "appliedFilters": {
        "category": "actor",
        "city": "Los Angeles",
        "minPrice": 50,
        "maxPrice": 500
      }
    }
  }
}
```

**POST /bookings**

Request:
```json
{
  "celebrityId": "uuid-123",
  "meetingTypeId": "uuid-mt-2",
  "availableDateId": "uuid-ad-456",
  "date": "2025-11-15",
  "time": "14:00",
  "location": {
    "city": "Los Angeles",
    "country": "USA"
  },
  "specialRequests": "Please sign my book",
  "fanNotes": "Huge fan since Harry Potter!"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "uuid-booking-789",
      "bookingNumber": "BK-2025-001234",
      "status": "pending",
      "celebrity": {
        "id": "uuid-123",
        "displayName": "Emma Watson"
      },
      "meetingType": {
        "name": "Standard Meet",
        "durationMinutes": 30
      },
      "date": "2025-11-15",
      "time": "14:00",
      "location": {
        "city": "Los Angeles",
        "country": "USA"
      },
      "price": {
        "amountCents": 25000,
        "currency": "USD",
        "formatted": "$250.00"
      },
      "paymentIntent": {
        "clientSecret": "pi_xxx_secret_yyy",
        "publishableKey": "pk_live_xxx"
      },
      "createdAt": "2025-10-10T12:00:00Z"
    }
  }
}
```

---

## Authentication & Authorization

### JWT Strategy

**Token Structure**:
```javascript
// Access Token (short-lived: 15 minutes)
{
  "sub": "user-uuid",      // User ID
  "email": "user@email.com",
  "role": "user",          // 'user', 'celebrity', 'admin'
  "iat": 1696000000,       // Issued at
  "exp": 1696000900        // Expires at
}

// Refresh Token (long-lived: 7 days)
{
  "sub": "user-uuid",
  "type": "refresh",
  "iat": 1696000000,
  "exp": 1696604800
}
```

**Flow**:
1. User logs in → Receive access token (15 min) + refresh token (7 days)
2. Store refresh token in httpOnly cookie
3. Use access token for API requests
4. When access token expires → Use refresh token to get new access token
5. When refresh token expires → User must re-login

**Authorization Levels**:
- **Public**: Anyone (browse celebrities, view profiles)
- **Authenticated**: Logged-in users (create bookings, save favorites)
- **Celebrity**: Celebrity-specific actions (manage profile, view earnings)
- **Admin**: Platform management (verify celebrities, handle disputes)

---

## Payment Processing

### Stripe Integration Flow

**Booking Payment Flow**:

```
1. User selects meeting and proceeds to payment
   ↓
2. Frontend calls: POST /payments/create-intent
   - Backend creates Stripe PaymentIntent
   - Amount held (not charged yet)
   ↓
3. Frontend receives clientSecret
   - Renders Stripe Elements (card form)
   ↓
4. User enters card details
   - Stripe validates card
   ↓
5. Frontend calls: POST /payments/confirm
   - Backend confirms PaymentIntent
   - Charge is processed
   - Booking status → 'confirmed'
   ↓
6. Funds held in escrow (Stripe Connect)
   - Platform takes fee (e.g., 15%)
   - Remainder held for celebrity
   ↓
7. After meeting confirmed complete:
   - Funds released to celebrity
   - Payout to celebrity's bank account
```

**Refund Policy**:
- >7 days before meeting: 100% refund
- 3-7 days before: 50% refund
- <3 days before: No refund (unless celebrity cancels)
- Celebrity cancels: Full refund + $25 credit

**Stripe Connect** (for payouts to celebrities):
- Each celebrity has Stripe Connect account
- Platform charges user
- Platform transfers celebrity's portion (minus fee)
- Automated weekly payouts

---

## Real-Time Features

### WebSocket Events

**Socket.io Namespaces**:

```javascript
// Booking updates namespace
io.of('/bookings').on('connection', (socket) => {
  // Join room for specific booking
  socket.on('join-booking', (bookingId) => {
    socket.join(`booking-${bookingId}`);
  });

  // Emit booking status change
  socket.on('booking-update', (data) => {
    io.of('/bookings').to(`booking-${data.bookingId}`).emit('status-change', {
      status: data.status,
      message: 'Your booking has been confirmed!'
    });
  });
});

// Chat/messages namespace
io.of('/messages').on('connection', (socket) => {
  socket.on('join-chat', (bookingId) => {
    socket.join(`chat-${bookingId}`);
  });

  socket.on('send-message', (data) => {
    // Save to database
    // Emit to both parties
    io.of('/messages').to(`chat-${data.bookingId}`).emit('new-message', data);
  });
});
```

**Real-Time Features**:
- Booking confirmation notifications
- Chat messages between user and celebrity team
- Calendar slot availability updates (prevent double-booking)
- Payment status updates
- Admin notifications (new bookings, disputes)

---

## Media & File Management

### File Upload Strategy

**S3 Bucket Structure**:
```
s3://starrymeet-media/
├── avatars/
│   ├── users/
│   │   └── {userId}.jpg
│   └── celebrities/
│       └── {celebrityId}.jpg
├── profiles/
│   └── celebrities/
│       ├── {celebrityId}/
│       │   ├── profile.jpg
│       │   ├── cover.jpg
│       │   └── gallery/
│       │       ├── photo1.jpg
│       │       └── photo2.jpg
└── documents/
    └── bookings/
        └── {bookingId}/
            └── receipt.pdf
```

**Upload Process**:
1. Frontend requests signed URL: `POST /uploads/presigned-url`
2. Backend generates S3 presigned URL (valid 5 minutes)
3. Frontend uploads directly to S3 (no backend involved)
4. Frontend notifies backend: `POST /uploads/complete`
5. Backend updates database with file URL

**CDN**:
- CloudFront in front of S3
- Optimized delivery (edge locations)
- Image transformations (resize, compress, format conversion)
- Lazy loading on frontend

---

## Search & Discovery

### Elasticsearch Index

**Celebrity Index**:
```json
{
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "displayName": {
        "type": "text",
        "fields": {
          "keyword": { "type": "keyword" },
          "autocomplete": {
            "type": "text",
            "analyzer": "autocomplete"
          }
        }
      },
      "username": { "type": "keyword" },
      "profession": { "type": "keyword" },
      "category": {
        "type": "object",
        "properties": {
          "id": { "type": "integer" },
          "name": { "type": "keyword" }
        }
      },
      "bio": { "type": "text" },
      "averageRating": { "type": "float" },
      "totalBookings": { "type": "integer" },
      "meetingTypes": {
        "type": "nested",
        "properties": {
          "name": { "type": "keyword" },
          "priceCents": { "type": "integer" }
        }
      },
      "locations": {
        "type": "nested",
        "properties": {
          "city": { "type": "keyword" },
          "country": { "type": "keyword" }
        }
      },
      "isVerified": { "type": "boolean" },
      "isActive": { "type": "boolean" }
    }
  }
}
```

**Search Query Example**:
```json
{
  "query": {
    "bool": {
      "must": [
        {
          "multi_match": {
            "query": "emma watson",
            "fields": ["displayName^2", "username", "bio"],
            "fuzziness": "AUTO"
          }
        }
      ],
      "filter": [
        { "term": { "category.name": "Actors & Actresses" } },
        { "term": { "locations.city": "Los Angeles" } },
        { "range": { "meetingTypes.priceCents": { "gte": 5000, "lte": 50000 } } },
        { "term": { "isActive": true } }
      ]
    }
  },
  "sort": [
    { "averageRating": { "order": "desc" } },
    { "totalBookings": { "order": "desc" } }
  ]
}
```

---

## Notifications System

### Notification Types

**Email Notifications** (SendGrid templates):
- Welcome email (after signup)
- Email verification
- Booking confirmation (to user and celebrity)
- Booking reminder (24 hours before, 1 hour before)
- Booking completed (leave a review)
- Payment receipt
- Refund processed
- Password reset
- New message notification

**SMS Notifications** (Twilio):
- Booking confirmation code
- Meeting reminder (1 hour before)
- Last-minute changes
- 2FA codes

**Push Notifications** (for mobile apps - future):
- Real-time booking updates
- New messages
- Price drops on favorites
- New celebrities in your area

**In-App Notifications**:
- Dashboard bell icon
- Unread count badge
- Notification center

---

## Admin Dashboard

### Admin Features

**Dashboard Overview**:
- Total users, celebrities, bookings
- Revenue metrics (daily, weekly, monthly)
- Active bookings count
- Pending celebrity verifications
- Recent activity feed

**User Management**:
- Search/filter users
- View user details
- Suspend/ban accounts
- View booking history
- Refund processing

**Celebrity Management**:
- Pending verifications
- Approve/reject applications
- Edit celebrity profiles
- Set featured celebrities
- Monitor earnings/payouts

**Booking Management**:
- View all bookings
- Filter by status, date, celebrity
- Handle disputes
- Issue refunds
- Export booking data

**Financial Reports**:
- Revenue dashboard
- Transaction history
- Payout reports
- Fee collection
- Tax reporting exports

**Analytics**:
- User acquisition metrics
- Booking conversion rates
- Celebrity performance
- Search analytics
- A/B test results

---

## Analytics & Tracking

### Event Tracking

**Google Analytics 4 Events**:
```javascript
// Page views
gtag('event', 'page_view', {
  page_title: 'Celebrity Profile - Emma Watson',
  page_location: window.location.href
});

// User actions
gtag('event', 'select_celebrity', {
  celebrity_id: 'uuid-123',
  celebrity_name: 'Emma Watson',
  category: 'Actors'
});

gtag('event', 'begin_checkout', {
  celebrity_id: 'uuid-123',
  meeting_type: 'Standard Meet',
  value: 250.00,
  currency: 'USD'
});

gtag('event', 'purchase', {
  transaction_id: 'BK-2025-001234',
  value: 250.00,
  currency: 'USD',
  celebrity_id: 'uuid-123'
});
```

**Custom Analytics**:
- Celebrity page views (track popular celebrities)
- Search queries (improve search/autocomplete)
- Filter usage (understand user preferences)
- Booking abandonment funnel
- Time to booking (from browse to payment)
- Average booking value
- User retention (repeat bookings)

---

## Security & Compliance

### Security Measures

**Application Security**:
- HTTPS everywhere (SSL/TLS 1.3)
- CSRF protection (double-submit cookie pattern)
- XSS prevention (sanitize inputs, CSP headers)
- SQL injection prevention (parameterized queries, ORM)
- Rate limiting (prevent brute force, DDoS)
- Input validation (Joi/Zod schemas)
- Output encoding (prevent injection)

**Authentication Security**:
- Password hashing (bcrypt, cost factor 12)
- Password strength requirements (min 8 chars, uppercase, number, symbol)
- Account lockout after failed attempts
- 2FA optional (SMS or TOTP)
- Session expiry (auto-logout after inactivity)
- Refresh token rotation

**Payment Security**:
- PCI DSS compliance (Stripe handles card data)
- Never store card numbers
- Tokenization for saved cards
- 3D Secure for high-value transactions
- Fraud detection (Stripe Radar)

**Data Privacy (GDPR/CCPA)**:
- Cookie consent banner
- Privacy policy acceptance
- Data export on request
- Account deletion (right to be forgotten)
- Data encryption at rest (AES-256)
- Data encryption in transit (TLS 1.3)
- Regular security audits
- Penetration testing (annually)

**Monitoring & Logging**:
- Sentry for error tracking
- Datadog for APM (application performance)
- CloudWatch logs (AWS)
- Audit log for admin actions
- Security alerts (unusual login, failed payments)

---

## Infrastructure & DevOps

### Cloud Architecture (AWS)

```
┌─────────────────────────────────────────────────────────────┐
│                          USERS                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  Route 53 (DNS) → CloudFront (CDN) → WAF (Firewall)         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              ALB (Application Load Balancer)                 │
│  - SSL Termination                                           │
│  - Health Checks                                             │
│  - Auto Scaling Trigger                                      │
└────────────────────────┬────────────────────────────────────┘
                         │
           ┌─────────────┴─────────────┐
           │                           │
           ↓                           ↓
┌──────────────────────┐    ┌──────────────────────┐
│   ECS Cluster        │    │   ECS Cluster        │
│   (API Services)     │    │   (Worker Services)  │
│  - API Gateway       │    │  - Notification Srv  │
│  - User Service      │    │  - Analytics Srv     │
│  - Celebrity Service │    │  - Cron Jobs         │
│  - Booking Service   │    └──────────────────────┘
│  - Payment Service   │
└──────────┬───────────┘
           │
           ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATA STORES                             │
├───────────────┬────────────────┬──────────────┬─────────────┤
│  RDS          │  ElastiCache   │  S3          │ Elasticsearch│
│  (PostgreSQL) │  (Redis)       │  (Media)     │  Service     │
│  - Multi-AZ   │  - Cluster     │  - Lifecycle │  - 3-node    │
│  - Read Replica│  - Persistence│  - Versioning│  - Cluster   │
└───────────────┴────────────────┴──────────────┴─────────────┘
```

**Deployment Strategy**:
- **Blue-Green Deployment**: Zero-downtime releases
- **Auto Scaling**: Based on CPU/memory metrics
- **Health Checks**: ALB monitors service health
- **Rollback**: Instant rollback if deploy fails

**CI/CD Pipeline**:
```
GitHub Push
  ↓
GitHub Actions
  - Run tests (Jest, Cypress)
  - Lint code (ESLint, Prettier)
  - Build Docker images
  - Push to ECR (Elastic Container Registry)
  ↓
AWS CodePipeline
  - Deploy to staging
  - Run smoke tests
  - Manual approval gate
  - Deploy to production
  ↓
Post-Deploy
  - Run health checks
  - Monitor error rates (Sentry)
  - Alert on anomalies (Datadog)
```

**Monitoring**:
- **APM**: Datadog (response times, error rates, throughput)
- **Logs**: CloudWatch Logs (centralized logging)
- **Errors**: Sentry (real-time error tracking)
- **Uptime**: Pingdom or UptimeRobot (external monitoring)
- **Alerts**: PagerDuty (on-call rotation)

---

## Third-Party Integrations

**Essential Services**:

| Service | Purpose | Why Needed |
|---------|---------|------------|
| **Stripe** | Payment processing | PCI-compliant payments, escrow, payouts to celebrities |
| **SendGrid/SES** | Email delivery | Transactional emails (confirmations, receipts, notifications) |
| **Twilio** | SMS notifications | Booking reminders, 2FA codes |
| **Google Maps API** | Location services | City selection, geocoding, map display on profiles |
| **Cloudinary** | Image optimization | Resize/compress celebrity photos, responsive images |
| **Auth0** (optional) | Authentication | Social login (Google, Facebook), enterprise SSO |
| **Algolia** (alternative to Elasticsearch) | Search | Faster search, better autocomplete, typo tolerance |
| **Sentry** | Error tracking | Real-time error monitoring, performance tracking |
| **Segment** | Analytics hub | Centralized event tracking, send to GA4, Mixpanel, etc. |
| **Intercom** | Customer support | Live chat, help center, user onboarding |

---

## Scalability Plan

### Phase 1: MVP (0-1,000 users)
**Infrastructure**:
- Monolithic architecture (simpler to start)
- Single t3.medium EC2 instance
- Single RDS instance (db.t3.small)
- Redis (ElastiCache t3.micro)
- S3 + CloudFront

**Limitations**:
- Can handle ~100 concurrent users
- Manual scaling if traffic spikes
- Single point of failure

**Cost**: ~$300-500/month

---

### Phase 2: Growth (1,000-10,000 users)
**Infrastructure**:
- Migrate to microservices (modular scaling)
- ECS Fargate (2-4 containers)
- RDS with read replica
- Redis cluster (2 nodes)
- Elasticsearch (3-node cluster)

**Features**:
- Auto-scaling (based on CPU/memory)
- Load balancer (ALB)
- CDN for global users
- Database connection pooling

**Capacity**:
- ~1,000 concurrent users
- ~50,000 bookings/month
- ~100 requests/second

**Cost**: ~$1,500-2,500/month

---

### Phase 3: Scale (10,000-100,000 users)
**Infrastructure**:
- Multi-region deployment (US, Europe)
- Kubernetes (EKS) for orchestration
- RDS Multi-AZ + cross-region replicas
- Redis Cluster (6+ nodes)
- Elasticsearch (6+ nodes, sharded)
- SQS for async processing

**Features**:
- Horizontal auto-scaling (10-50 pods)
- Database sharding (by user region)
- Edge caching (CloudFront + API Gateway cache)
- CDN for API responses
- Message queues for background jobs

**Capacity**:
- ~10,000 concurrent users
- ~500,000 bookings/month
- ~1,000 requests/second

**Cost**: ~$10,000-15,000/month

---

### Phase 4: Enterprise (100,000+ users)
**Infrastructure**:
- Multi-cloud (AWS + GCP for redundancy)
- Kubernetes clusters across regions
- Database federation (distributed)
- Dedicated Elasticsearch clusters per region
- Apache Kafka for event streaming
- ML models for recommendations (SageMaker)

**Features**:
- Global load balancing (Route 53 geolocation routing)
- Active-active multi-region
- Real-time data replication
- Advanced caching (Redis + Memcached layers)
- Predictive auto-scaling
- AI-powered search

**Capacity**:
- ~50,000 concurrent users
- ~5,000,000 bookings/month
- ~10,000 requests/second

**Cost**: ~$50,000-100,000/month

---

## Success Metrics (KPIs)

**Business Metrics**:
- **GMV** (Gross Merchandise Value): Total booking value processed
- **Take Rate**: Platform fee % (target: 15-20%)
- **Active Celebrities**: Celebrities with 1+ booking/month
- **Booking Completion Rate**: Confirmed bookings / Total bookings
- **Repeat Booking Rate**: % of users with 2+ bookings
- **Average Booking Value**: Mean transaction value

**Product Metrics**:
- **Conversion Rate**: Bookings / Profile views (target: 3-5%)
- **Time to Booking**: Time from browse to payment (target: <10 min)
- **Search Success Rate**: % of searches resulting in profile view
- **Cart Abandonment**: % of users who start booking but don't complete
- **User Retention**: % of users active after 30/60/90 days

**Technical Metrics**:
- **API Response Time**: p50, p95, p99 (target: <200ms p95)
- **Error Rate**: % of requests with errors (target: <0.1%)
- **Uptime**: % availability (target: 99.9% = 43 min downtime/month)
- **Payment Success Rate**: % of payment attempts successful (target: >95%)

---

**Document Status**: ✅ Complete Vision
**Next Step**: Compare this vision to current implementation → Create gap analysis
**Last Updated**: 2025-10-10
