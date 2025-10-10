# AI-Driven Backend Implementation Plan

**Project**: StarryMeet Full-Stack Development
**AI Agent**: Claude (Anthropic)
**Timeline**: 14-16 weeks (3-4 months for MVP)
**Approach**: Session-based incremental development
**Last Updated**: 2025-10-10

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [Session-Based Development Strategy](#session-based-development-strategy)
3. [10 Development Sessions](#10-development-sessions)
4. [How We'll Work Together](#how-well-work-together)
5. [Prerequisites & Requirements](#prerequisites--requirements)
6. [Timeline & Milestones](#timeline--milestones)
7. [AI Advantages & Limitations](#ai-advantages--limitations)

---

## Overview

### Current State
- ✅ **Frontend**: 13 HTML pages, complete UI/UX (being redesigned to premium)
- ❌ **Backend**: Does not exist (0%)
- ❌ **Database**: Mock data only (localStorage)
- ❌ **Payments**: Demo mode only
- ❌ **Auth**: No real authentication

### Target State (MVP)
- ✅ Full-stack application
- ✅ Backend API (Node.js + TypeScript + Express)
- ✅ Database (PostgreSQL + Redis)
- ✅ Real authentication (JWT)
- ✅ Payment processing (Stripe)
- ✅ Deployed on AWS
- ✅ Real bookings and revenue

### Implementation Philosophy
**"Build in public, ship incrementally, test continuously"**

- Each session delivers a working, testable feature
- No big-bang releases - everything is incremental
- You test and approve before we move forward
- Git commits after each feature completion

---

## Session-Based Development Strategy

### Why Session-Based?

**AI Context Limitations**: Each conversation has a token limit, so we work in focused sessions.

**Benefits**:
1. **Focus**: One feature at a time, done right
2. **Testable**: Each session delivers something you can test
3. **Flexible**: Can pivot based on feedback
4. **Documented**: Each session is fully documented
5. **Reversible**: Git commits allow rollback

### Session Structure

Each session follows this pattern:

```
1. Planning (AI writes spec) → 2. Review (You approve) → 3. Implementation (AI codes) → 4. Testing (You test) → 5. Commit (AI commits to git)
```

**Typical Session Duration**:
- AI coding time: 30-60 minutes
- Your testing time: 1-2 days
- Total per session: 1-2 days including your review

**Session Frequency**:
- 2-3 sessions per week = sustainable pace
- Can accelerate if you test faster

---

## 10 Development Sessions

### Session 1: Backend Foundation (Week 1)
**Goal**: Create project structure and API skeleton

**What I'll Build**:
```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # Sequelize config
│   │   └── environment.ts       # Env variables
│   ├── models/
│   │   ├── User.ts
│   │   ├── Celebrity.ts
│   │   └── index.ts
│   ├── routes/
│   │   └── index.ts             # Route registry
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── logger.ts
│   ├── controllers/             # (empty for now)
│   ├── services/                # (empty for now)
│   └── server.ts                # Express app
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

**Dependencies I'll Install**:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "sequelize": "^6.35.0",
    "pg": "^8.11.3",
    "pg-hstore": "^2.3.4",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.6",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2"
  }
}
```

**API Endpoints** (this session):
- `GET /health` - Health check endpoint
- `GET /api/version` - API version info

**How to Test**:
```bash
# 1. Install dependencies
cd backend && npm install

# 2. Setup .env file
cp .env.example .env
# Edit .env with your database credentials

# 3. Run in dev mode
npm run dev

# 4. Test health endpoint
curl http://localhost:3000/health
# Expected: {"status": "ok", "timestamp": "..."}
```

**Deliverables**:
- ✅ Express server running on port 3000
- ✅ TypeScript compilation working
- ✅ Database connection established
- ✅ Error handling middleware
- ✅ Logging with Morgan
- ✅ CORS configured
- ✅ Health check endpoint responding

**Success Criteria**:
- Server starts without errors
- Can hit `/health` endpoint and get 200 response
- Database connection successful

---

### Session 2: Authentication System (Week 1-2)
**Goal**: Complete user registration and login with JWT

**What I'll Build**:

**Files Created**:
```
src/
├── models/
│   └── User.ts                  # User model with password hashing
├── controllers/
│   └── authController.ts        # Auth logic
├── routes/
│   └── authRoutes.ts            # Auth endpoints
├── middleware/
│   ├── authMiddleware.ts        # JWT verification
│   └── validation.ts            # Input validation
├── services/
│   ├── emailService.ts          # SendGrid integration
│   └── tokenService.ts          # JWT helpers
└── utils/
    └── passwordUtils.ts         # Bcrypt helpers
```

**User Model** (Sequelize):
```typescript
interface UserAttributes {
  id: string;
  email: string;
  password: string; // hashed
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'user' | 'celebrity' | 'admin';
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**API Endpoints**:
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login and get JWT
- `POST /api/auth/logout` - Invalidate token
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/verify-email` - Verify email with token
- `POST /api/auth/forgot-password` - Send reset email
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current user (protected)

**Request/Response Examples**:

**Register**:
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}

# Response (201 Created):
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Login**:
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

# Response (200 OK):
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Protected Route Example**:
```bash
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Response (200 OK):
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

**JWT Structure**:
```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'celebrity' | 'admin';
  iat: number; // issued at
  exp: number; // expires at (24h from iat)
}
```

**Security Features**:
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT with 24-hour expiry
- ✅ Refresh tokens for session extension
- ✅ Email verification required
- ✅ Rate limiting on auth endpoints (10 req/min)
- ✅ Input validation (email format, password strength)

**How to Test**:

I'll provide a **Postman Collection** with all endpoints pre-configured:
```json
{
  "name": "StarryMeet Auth API",
  "requests": [
    {
      "name": "Register User",
      "method": "POST",
      "url": "http://localhost:3000/api/auth/register",
      "body": { /* ... */ }
    },
    // ... all other endpoints
  ]
}
```

**Manual Test Steps**:
1. Register a new user → Should receive JWT token
2. Try login with wrong password → Should get 401 error
3. Login with correct credentials → Should receive token
4. Call `/api/auth/me` without token → Should get 401
5. Call `/api/auth/me` with valid token → Should get user data
6. Try to register same email twice → Should get 409 conflict

**Deliverables**:
- ✅ User registration working
- ✅ Login returning JWT
- ✅ Protected routes checking JWT
- ✅ Email verification flow (SendGrid)
- ✅ Password reset flow
- ✅ Postman collection for testing

**Success Criteria**:
- Can register user and receive JWT
- Can login and access protected routes
- Invalid tokens are rejected
- Email verification emails are sent

---

### Session 3: Celebrity & Booking Services (Week 2-3)
**Goal**: Build celebrity browsing and booking creation APIs

**What I'll Build**:

**Files Created**:
```
src/
├── models/
│   ├── Celebrity.ts             # Celebrity model
│   ├── Booking.ts               # Booking model
│   └── Availability.ts          # Celebrity availability
├── controllers/
│   ├── celebrityController.ts   # Celebrity CRUD
│   └── bookingController.ts     # Booking logic
├── routes/
│   ├── celebrityRoutes.ts
│   └── bookingRoutes.ts
├── services/
│   ├── availabilityService.ts   # Availability checking
│   └── pricingService.ts        # Price calculation
└── utils/
    └── dateUtils.ts             # Date helpers
```

**Database Models**:

**Celebrity Model**:
```typescript
interface CelebrityAttributes {
  id: string;
  userId: string;                // FK to users table
  username: string;              // unique, e.g., "taylor-swift"
  displayName: string;           // "Taylor Swift"
  category: 'Hollywood' | 'Musicians' | 'Athletes' | 'Business';
  bio: string;
  location: string;
  avatarUrl: string;
  quickMeetPriceCents: number;   // 15 min
  standardMeetPriceCents: number; // 30 min
  premiumMeetPriceCents: number;  // 60 min
  averageRating: number;         // 0.00 - 5.00
  totalBookings: number;
  isVerified: boolean;
  isActive: boolean;
  stripeAccountId?: string;      // For payouts
  createdAt: Date;
  updatedAt: Date;
}
```

**Booking Model**:
```typescript
interface BookingAttributes {
  id: string;
  bookingNumber: string;         // e.g., "BK-2025-001234"
  userId: string;                // FK to users
  celebrityId: string;           // FK to celebrities
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded';
  meetingType: 'quick' | 'standard' | 'premium';
  bookingDate: Date;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  userName: string;
  userEmail: string;
  userPhone: string;
  specialRequests?: string;
  priceCents: number;
  platformFeeCents: number;      // 15% of price
  taxCents: number;
  totalCents: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Celebrity API Endpoints**:

```
GET    /api/celebrities
       ?category=Musicians
       &location=Los Angeles
       &minPrice=1000
       &maxPrice=10000
       &availability=2025-10-15
       &rating=4.5
       &limit=12
       &offset=0

Response:
{
  "success": true,
  "data": {
    "celebrities": [ /* array of 12 celebrities */ ],
    "pagination": {
      "total": 45,
      "limit": 12,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

```
GET    /api/celebrities/:id

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "displayName": "Taylor Swift",
    "category": "Musicians",
    "bio": "...",
    "pricing": {
      "quick": 250000,    // cents ($2,500)
      "standard": 500000, // cents ($5,000)
      "premium": 1000000  // cents ($10,000)
    },
    "averageRating": 4.9,
    "totalBookings": 234,
    "isVerified": true
  }
}
```

```
GET    /api/celebrities/:id/availability
       ?month=2025-10

Response:
{
  "success": true,
  "data": {
    "availableDates": [
      {
        "date": "2025-10-15",
        "slots": ["morning", "afternoon", "evening"]
      },
      {
        "date": "2025-10-16",
        "slots": ["afternoon"]
      }
    ]
  }
}
```

**Booking API Endpoints**:

```
POST   /api/bookings
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "celebrityId": "uuid",
  "meetingType": "standard",
  "bookingDate": "2025-10-15",
  "timeSlot": "afternoon",
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "userPhone": "+1234567890",
  "specialRequests": "Looking forward to meeting!"
}

Response (201 Created):
{
  "success": true,
  "data": {
    "booking": {
      "id": "uuid",
      "bookingNumber": "BK-2025-001234",
      "status": "pending",
      "celebrity": {
        "displayName": "Taylor Swift"
      },
      "totalCents": 525000,  // $5,250 ($5,000 + $250 tax)
      "bookingDate": "2025-10-15",
      "timeSlot": "afternoon"
    },
    "paymentRequired": true,
    "nextStep": "payment"
  }
}
```

```
GET    /api/bookings/:id
Authorization: Bearer <jwt>

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "bookingNumber": "BK-2025-001234",
    "status": "confirmed",
    "celebrity": { /* celebrity details */ },
    "bookingDate": "2025-10-15",
    "timeSlot": "afternoon",
    "totalCents": 525000,
    "createdAt": "2025-10-10T12:00:00Z"
  }
}
```

```
GET    /api/bookings
Authorization: Bearer <jwt>
?status=confirmed&limit=10

Response:
{
  "success": true,
  "data": {
    "bookings": [ /* array of user's bookings */ ],
    "pagination": { /* ... */ }
  }
}
```

```
PUT    /api/bookings/:id/cancel
Authorization: Bearer <jwt>

{
  "reason": "Schedule conflict"
}

Response:
{
  "success": true,
  "data": {
    "booking": { /* updated booking with status: 'cancelled' */ },
    "refundAmount": 525000,  // Full refund if >7 days before
    "refundStatus": "processing"
  }
}
```

**Business Logic**:

**Booking Validation**:
- ✅ Celebrity must be active and verified
- ✅ Date must be ≥7 days in future
- ✅ Time slot must be available
- ✅ Price must match database pricing
- ✅ User cannot book same celebrity twice on same date

**Pricing Calculation**:
```typescript
function calculateTotal(meetingType: string, priceCents: number) {
  const platformFee = Math.floor(priceCents * 0.15); // 15%
  const tax = Math.floor(priceCents * 0.05); // 5% tax
  const total = priceCents + platformFee + tax;

  return {
    priceCents,
    platformFeeCents: platformFee,
    taxCents: tax,
    totalCents: total
  };
}
```

**Data Seeding**:

I'll migrate the 12 celebrities from `js/shared.js` to PostgreSQL:
```sql
INSERT INTO celebrities (id, display_name, category, bio, ...) VALUES
  ('uuid-1', 'Taylor Swift', 'Musicians', 'Grammy-winning artist...', ...),
  ('uuid-2', 'LeBron James', 'Athletes', 'NBA Legend...', ...),
  -- ... all 12 celebrities
```

**How to Test**:

**Test Scenario 1: Browse Celebrities**
```bash
# Get all celebrities
curl http://localhost:3000/api/celebrities

# Filter by category
curl http://localhost:3000/api/celebrities?category=Musicians

# Filter by price range
curl http://localhost:3000/api/celebrities?minPrice=1000&maxPrice=5000
```

**Test Scenario 2: Create Booking**
```bash
# 1. Get JWT token (from Session 2)
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 2. Get celebrity ID
curl http://localhost:3000/api/celebrities | jq '.data.celebrities[0].id'

# 3. Create booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "celebrityId": "uuid",
    "meetingType": "standard",
    "bookingDate": "2025-11-15",
    "timeSlot": "afternoon",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "userPhone": "+1234567890"
  }'
```

**Test Scenario 3: Validation Errors**
```bash
# Try booking with date < 7 days
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"bookingDate": "2025-10-12", ...}'
# Expected: 400 Bad Request - "Booking must be at least 7 days in advance"

# Try booking unavailable slot
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"timeSlot": "morning", "bookingDate": "2025-11-15", ...}'
# Expected: 400 Bad Request - "Time slot not available"
```

**Deliverables**:
- ✅ Celebrity browsing with filters
- ✅ Celebrity detail view
- ✅ Availability checking
- ✅ Booking creation with validation
- ✅ Booking list (user's bookings)
- ✅ Booking cancellation
- ✅ 12 celebrities seeded in database
- ✅ Postman collection updated

**Success Criteria**:
- Can browse and filter celebrities
- Can create booking (returns pending status)
- Validation rules enforced
- Cannot book unavailable slots

---

### Session 4: Stripe Payment Integration (Week 3-4)
**Goal**: Process real payments and handle celebrity payouts

**What I'll Build**:

**Files Created**:
```
src/
├── models/
│   └── Payment.ts               # Payment records
├── controllers/
│   └── paymentController.ts     # Payment logic
├── routes/
│   ├── paymentRoutes.ts
│   └── webhookRoutes.ts         # Stripe webhooks
├── services/
│   ├── stripeService.ts         # Stripe SDK wrapper
│   └── payoutService.ts         # Celebrity payouts
└── utils/
    └── webhookValidator.ts      # Stripe signature verification
```

**Payment Model**:
```typescript
interface PaymentAttributes {
  id: string;
  bookingId: string;             // FK to bookings
  stripePaymentIntentId: string;
  stripeChargeId?: string;
  amountCents: number;
  currency: string;              // 'usd'
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded';
  paymentMethodType: string;     // 'card' | 'bank_transfer'
  last4?: string;                // Last 4 digits of card
  refundAmountCents: number;
  refundReason?: string;
  paidAt?: Date;
  refundedAt?: Date;
  createdAt: Date;
}
```

**Stripe Integration Flow**:

```
1. User completes booking form → Backend creates booking (status: pending)
2. Frontend requests payment intent → Backend creates Stripe PaymentIntent
3. Frontend shows Stripe Elements → User enters card details
4. Frontend confirms payment → Stripe processes payment
5. Stripe sends webhook → Backend updates booking (status: confirmed)
6. Backend sends confirmation email → User and celebrity notified
7. After meeting → Backend transfers funds to celebrity (Stripe Connect)
```

**Payment API Endpoints**:

```
POST   /api/payments/create-intent
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "bookingId": "uuid"
}

Response:
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxxxx_secret_xxxxx",  // For Stripe.js
    "paymentIntentId": "pi_xxxxx",
    "amountCents": 525000,
    "currency": "usd"
  }
}
```

```
POST   /api/payments/confirm
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "paymentIntentId": "pi_xxxxx"
}

Response:
{
  "success": true,
  "data": {
    "payment": { /* payment record */ },
    "booking": { /* updated booking with status: confirmed */ }
  }
}
```

```
POST   /api/payments/refund/:bookingId
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "reason": "User requested cancellation"
}

Response:
{
  "success": true,
  "data": {
    "refund": {
      "amountCents": 525000,
      "reason": "User requested cancellation",
      "status": "succeeded"
    },
    "booking": { /* booking with status: refunded */ }
  }
}
```

**Webhook Endpoint**:
```
POST   /api/webhooks/stripe
Stripe-Signature: t=xxxxx,v1=xxxxx

# Stripe sends events like:
# - payment_intent.succeeded
# - payment_intent.payment_failed
# - charge.refunded
# - transfer.created

Response:
{
  "received": true
}
```

**Stripe Connect (Celebrity Payouts)**:

**Setup**:
1. Celebrity creates Stripe Connect account
2. We save `stripeAccountId` in celebrity record
3. When booking confirmed, create transfer to celebrity

**Transfer Logic**:
```typescript
// When payment succeeds
const celebrityPayout = totalCents - platformFeeCents - taxCents;

await stripe.transfers.create({
  amount: celebrityPayout,
  currency: 'usd',
  destination: celebrity.stripeAccountId,
  transfer_group: bookingId,
  metadata: {
    bookingId,
    celebrityId,
    userId
  }
});
```

**Refund Policy** (automatically enforced):
- **≥7 days before**: 100% refund
- **3-6 days before**: 50% refund
- **<3 days before**: No refund
- **Celebrity cancels**: 100% refund + $50 credit

**Code Example**:
```typescript
function calculateRefundAmount(booking: Booking): number {
  const daysUntilBooking = daysBetween(new Date(), booking.bookingDate);

  if (daysUntilBooking >= 7) {
    return booking.totalCents; // 100% refund
  } else if (daysUntilBooking >= 3) {
    return Math.floor(booking.totalCents * 0.5); // 50% refund
  } else {
    return 0; // No refund
  }
}
```

**Webhook Handler**:
```typescript
app.post('/api/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;

      case 'charge.refunded':
        await handleRefund(event.data.object);
        break;
    }

    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
```

**Security Features**:
- ✅ Stripe webhook signature verification
- ✅ Idempotency keys for duplicate prevention
- ✅ PCI compliance (card data never touches our servers)
- ✅ 3D Secure (SCA) support
- ✅ Fraud detection (Stripe Radar)

**How to Test**:

**Test Setup**:
```bash
# 1. Get Stripe test API keys
# Go to https://dashboard.stripe.com/test/apikeys
# Copy publishable key (pk_test_...) and secret key (sk_test_...)

# 2. Add to .env
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# 3. Install Stripe CLI for webhook testing
brew install stripe/stripe-cli/stripe
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Test Scenario 1: Successful Payment**
```bash
# 1. Create booking (from Session 3)
BOOKING_ID="uuid"

# 2. Create payment intent
curl -X POST http://localhost:3000/api/payments/create-intent \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"bookingId": "'$BOOKING_ID'"}'

# Save clientSecret from response
CLIENT_SECRET="pi_xxxxx_secret_xxxxx"

# 3. Use Stripe test card to complete payment
# Card: 4242 4242 4242 4242
# Exp: Any future date
# CVC: Any 3 digits
# ZIP: Any 5 digits

# 4. Stripe webhook fires → Booking status changes to 'confirmed'
```

**Test Scenario 2: Failed Payment**
```bash
# Use Stripe test card for declined payment
# Card: 4000 0000 0000 0002 (card_declined)

# Expected:
# - Payment fails
# - Booking status remains 'pending'
# - User notified of failure
```

**Test Scenario 3: Refund**
```bash
# 1. Get a confirmed booking
BOOKING_ID="uuid"

# 2. Request refund
curl -X POST http://localhost:3000/api/payments/refund/$BOOKING_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Schedule conflict"}'

# Expected:
# - Refund processed (amount based on refund policy)
# - Booking status changes to 'refunded'
# - User receives refund confirmation email
```

**Stripe Test Cards**:
```
Success:        4242 4242 4242 4242
Declined:       4000 0000 0000 0002
Requires 3DS:   4000 0025 0000 3155
Insufficient:   4000 0000 0000 9995
```

**Deliverables**:
- ✅ Payment intent creation
- ✅ Payment confirmation
- ✅ Webhook handling (success, failure, refund)
- ✅ Refund logic with policy enforcement
- ✅ Celebrity payout via Stripe Connect
- ✅ Email notifications for all payment events
- ✅ Postman collection with Stripe endpoints

**Success Criteria**:
- Can create payment intent
- Test card payment succeeds
- Webhook updates booking status
- Refunds work correctly
- Celebrity receives payout

---

### Session 5: Frontend API Integration (Week 4-5)
**Goal**: Connect frontend to real backend API

**What I'll Build**:

**Files Created/Updated**:
```
js/
├── api.js                       # NEW: API client
├── auth.js                      # NEW: Auth helpers
├── config.js                    # NEW: API config
└── shared.js                    # UPDATED: Remove mock data

All 13 HTML pages:
├── index.html                   # Updated: Use API for celebrities
├── browse.html                  # Updated: API calls, real filters
├── celebrity-profile.html       # Updated: Fetch from API
├── booking.html                 # Updated: Real booking creation
├── dashboard.html               # Updated: Fetch user data
├── login.html                   # NEW: Login page
├── register.html                # NEW: Registration page
└── ... (all other pages)
```

**API Client** (`js/api.js`):
```javascript
/**
 * StarryMeet API Client
 * Centralized API communication with JWT handling
 */

class APIClient {
  constructor() {
    this.baseURL = 'http://localhost:3000/api';  // Production: https://api.starrymeet.com
    this.token = localStorage.getItem('jwt');
  }

  /**
   * Generic request wrapper
   */
  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Add JWT if available
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers
      });

      // Handle 401 Unauthorized (token expired)
      if (response.status === 401) {
        this.logout();
        window.location.href = '/login.html';
        return;
      }

      const data = await response.json();

      // Handle API errors
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ============ Auth Methods ============

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    // Save JWT
    this.token = response.data.token;
    localStorage.setItem('jwt', this.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  }

  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    // Save JWT
    this.token = response.data.token;
    localStorage.setItem('jwt', this.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  // ============ Celebrity Methods ============

  async getCelebrities(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return await this.request(`/celebrities?${queryString}`);
  }

  async getCelebrity(id) {
    return await this.request(`/celebrities/${id}`);
  }

  async getCelebrityAvailability(id, month) {
    return await this.request(`/celebrities/${id}/availability?month=${month}`);
  }

  // ============ Booking Methods ============

  async createBooking(bookingData) {
    return await this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  }

  async getBooking(id) {
    return await this.request(`/bookings/${id}`);
  }

  async getMyBookings(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return await this.request(`/bookings?${queryString}`);
  }

  async cancelBooking(id, reason) {
    return await this.request(`/bookings/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    });
  }

  // ============ Payment Methods ============

  async createPaymentIntent(bookingId) {
    return await this.request('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({ bookingId })
    });
  }

  async confirmPayment(paymentIntentId) {
    return await this.request('/payments/confirm', {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId })
    });
  }

  async refundBooking(bookingId, reason) {
    return await this.request(`/payments/refund/${bookingId}`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }
}

// Global instance
const api = new APIClient();
```

**Updated browse.html**:
```javascript
// OLD (mock data):
function loadCelebrities() {
  const celebrities = celebrityData; // From shared.js
  displayCelebrities(celebrities);
}

// NEW (real API):
async function loadCelebrities() {
  try {
    showLoadingSkeleton();

    const filters = {
      category: selectedCategory,
      limit: 12,
      offset: 0
    };

    const response = await api.getCelebrities(filters);
    displayCelebrities(response.data.celebrities);

  } catch (error) {
    showError('Failed to load celebrities. Please try again.');
  } finally {
    hideLoadingSkeleton();
  }
}

// Loading skeleton (better UX)
function showLoadingSkeleton() {
  const grid = document.getElementById('celebrityGrid');
  grid.innerHTML = `
    ${Array(12).fill(0).map(() => `
      <div class="celebrity-card skeleton">
        <div class="skeleton-image"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text short"></div>
      </div>
    `).join('')}
  `;
}
```

**Updated booking.html** (Step 5: Payment):
```javascript
// OLD (demo payment):
function processPayment() {
  console.log('Payment processed (demo)');
  window.location.href = 'dashboard.html';
}

// NEW (real Stripe integration):
async function processPayment(event) {
  event.preventDefault();

  try {
    // 1. Create booking
    showLoadingState('Creating booking...');
    const bookingResponse = await api.createBooking(bookingData);
    const booking = bookingResponse.data.booking;

    // 2. Create payment intent
    showLoadingState('Preparing payment...');
    const paymentResponse = await api.createPaymentIntent(booking.id);
    const clientSecret = paymentResponse.data.clientSecret;

    // 3. Confirm payment with Stripe
    showLoadingState('Processing payment...');
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: bookingData.userName,
          email: bookingData.userEmail,
          phone: bookingData.userPhone
        }
      }
    });

    if (error) {
      showError(error.message);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      // 4. Confirm payment on backend
      await api.confirmPayment(paymentIntent.id);

      // 5. Show success and redirect
      showSuccess('Booking confirmed! Redirecting to dashboard...');
      setTimeout(() => {
        window.location.href = `dashboard.html?bookingId=${booking.id}`;
      }, 2000);
    }

  } catch (error) {
    showError('Payment failed. Please try again.');
    console.error(error);
  }
}

// Initialize Stripe Elements
const stripe = Stripe('pk_test_xxxxx'); // From environment
const elements = stripe.elements();
const cardElement = elements.create('card', {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a'
    }
  }
});
cardElement.mount('#card-element');
```

**Updated dashboard.html**:
```javascript
// OLD (mock data):
function loadUpcomingMeetings() {
  const bookings = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
  displayBookings(bookings);
}

// NEW (real API):
async function loadUpcomingMeetings() {
  try {
    const response = await api.getMyBookings({ status: 'confirmed', limit: 10 });
    displayBookings(response.data.bookings);
  } catch (error) {
    showError('Failed to load bookings');
  }
}

// Load user profile
async function loadUserProfile() {
  try {
    const response = await api.getCurrentUser();
    displayUserProfile(response.data);
  } catch (error) {
    // Token invalid or expired
    window.location.href = '/login.html';
  }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
  await loadUserProfile();
  await loadUpcomingMeetings();
  await loadPastMeetings();
  await loadSavedCelebrities();
});
```

**New login.html**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login - StarryMeet</title>
  <link rel="stylesheet" href="css/shared.css">
  <script src="js/api.js"></script>
</head>
<body>
  <div class="auth-container">
    <h1>Welcome Back</h1>
    <form id="loginForm">
      <input type="email" id="email" placeholder="Email" required>
      <input type="password" id="password" placeholder="Password" required>
      <button type="submit" class="btn-primary">Log In</button>
    </form>
    <p>Don't have an account? <a href="register.html">Sign up</a></p>
  </div>

  <script>
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        await api.login(email, password);
        window.location.href = 'dashboard.html';
      } catch (error) {
        alert('Login failed: ' + error.message);
      }
    });
  </script>
</body>
</html>
```

**Environment Configuration** (`js/config.js`):
```javascript
const config = {
  development: {
    apiUrl: 'http://localhost:3000/api',
    stripePublishableKey: 'pk_test_xxxxx'
  },
  production: {
    apiUrl: 'https://api.starrymeet.com/api',
    stripePublishableKey: 'pk_live_xxxxx'
  }
};

const env = window.location.hostname === 'localhost' ? 'development' : 'production';
export const API_URL = config[env].apiUrl;
export const STRIPE_KEY = config[env].stripePublishableKey;
```

**Auth Guard** (for protected pages):
```javascript
// Add to top of dashboard.html, booking.html, etc.
(function checkAuth() {
  const token = localStorage.getItem('jwt');
  if (!token) {
    window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
  }
})();
```

**Migration Steps**:

1. **Remove Mock Data** from `shared.js`:
   - Delete `celebrityData` array
   - Keep only utility functions

2. **Update All Pages** to use API:
   - Replace `celebrityData` with `api.getCelebrities()`
   - Replace `localStorage` bookings with API calls
   - Add loading states
   - Add error handling

3. **Add Authentication**:
   - Create login.html and register.html
   - Add auth guards to protected pages
   - Handle JWT expiry gracefully

4. **Stripe Integration**:
   - Include Stripe.js: `<script src="https://js.stripe.com/v3/"></script>`
   - Initialize Stripe Elements in booking.html
   - Replace demo payment with real flow

**How to Test**:

**Test Scenario 1: Full User Journey**
```
1. Open http://localhost:8000 (index.html)
2. Click "Browse Celebrities" → Should load from API (not mock data)
3. Click on a celebrity → Should fetch from /api/celebrities/:id
4. Select meeting type, click "Book Now" → Should redirect to booking
5. If not logged in → Redirect to login
6. After login → Complete booking flow
7. Enter Stripe test card → Payment should process
8. Redirect to dashboard → Should show confirmed booking
```

**Test Scenario 2: Error Handling**
```
1. Turn off backend server
2. Try to browse celebrities → Should show error message
3. Turn on backend
4. Retry → Should load successfully
```

**Test Scenario 3: JWT Expiry**
```
1. Login and get JWT
2. Wait 24 hours (or manually expire token in localStorage)
3. Try to access dashboard → Should redirect to login
4. Login again → Should get new token and access dashboard
```

**Deliverables**:
- ✅ API client (js/api.js) with all methods
- ✅ All 13 pages updated to use real API
- ✅ Login and registration pages
- ✅ Auth guards on protected pages
- ✅ Stripe payment integration in booking flow
- ✅ Loading states and error handling
- ✅ No more mock data

**Success Criteria**:
- Can browse celebrities from database
- Can register and login
- Can create booking with real payment
- Dashboard shows real user data
- JWT expiry handled correctly

---

### Session 6: AWS Deployment (Week 5-6)
**Goal**: Deploy both frontend and backend to AWS

**What I'll Build/Configure**:

**AWS Infrastructure** (via Terraform or AWS Console):
```
AWS Resources:
├── VPC (Virtual Private Cloud)
│   ├── Public Subnet (ALB, NAT Gateway)
│   └── Private Subnet (ECS, RDS)
│
├── RDS PostgreSQL
│   ├── Instance: db.t3.small (production) or db.t3.micro (dev)
│   ├── Storage: 20 GB SSD
│   ├── Multi-AZ: Yes (for production)
│   └── Automated backups: Daily
│
├── ECS Cluster (Fargate)
│   ├── Backend Service (2 tasks)
│   ├── Task Definition: 0.5 vCPU, 1 GB RAM
│   ├── Auto-scaling: 2-10 tasks based on CPU
│   └── Health checks: /health endpoint
│
├── Application Load Balancer (ALB)
│   ├── Listeners: HTTP (80) → HTTPS (443)
│   ├── Target Group: ECS tasks
│   └── Health check: GET /health
│
├── S3 + CloudFront
│   ├── S3 Bucket: starrymeet-frontend
│   ├── CloudFront Distribution
│   ├── SSL: ACM certificate
│   └── Custom domain: www.starrymeet.com
│
├── Route 53
│   ├── Domain: starrymeet.com
│   ├── A Record: www → CloudFront
│   └── A Record: api → ALB
│
├── ACM (SSL Certificates)
│   ├── Certificate: *.starrymeet.com
│   └── Auto-renewal
│
└── CloudWatch
    ├── Logs: ECS logs
    ├── Metrics: CPU, Memory, Request count
    └── Alarms: High error rate, high CPU
```

**Files I'll Create**:
```
backend/
├── Dockerfile                   # Container image
├── docker-compose.yml           # Local development
├── .dockerignore
├── ecosystem.config.js          # PM2 config (optional)
└── deploy/
    ├── terraform/               # Infrastructure as Code
    │   ├── main.tf
    │   ├── variables.tf
    │   ├── outputs.tf
    │   ├── vpc.tf
    │   ├── rds.tf
    │   ├── ecs.tf
    │   └── alb.tf
    └── scripts/
        ├── deploy.sh            # Deployment script
        └── rollback.sh          # Rollback script

frontend/
└── deploy/
    └── s3-deploy.sh             # Deploy to S3
```

**Backend Dockerfile**:
```dockerfile
# Multi-stage build for smaller image
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Security: Run as non-root user
USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

**ECS Task Definition**:
```json
{
  "family": "starrymeet-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/starrymeet-backend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:db-url"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:jwt"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/starrymeet-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      }
    }
  ]
}
```

**Deployment Script** (`deploy/scripts/deploy.sh`):
```bash
#!/bin/bash

set -e

echo "🚀 Starting deployment..."

# 1. Build Docker image
echo "📦 Building Docker image..."
docker build -t starrymeet-backend:latest .

# 2. Tag and push to ECR
echo "⬆️  Pushing to ECR..."
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
docker tag starrymeet-backend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/starrymeet-backend:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/starrymeet-backend:latest

# 3. Update ECS service
echo "🔄 Updating ECS service..."
aws ecs update-service \
  --cluster starrymeet-cluster \
  --service starrymeet-backend \
  --force-new-deployment \
  --region us-east-1

# 4. Wait for deployment to complete
echo "⏳ Waiting for deployment..."
aws ecs wait services-stable \
  --cluster starrymeet-cluster \
  --services starrymeet-backend \
  --region us-east-1

echo "✅ Deployment complete!"

# 5. Health check
echo "🏥 Running health check..."
curl -f https://api.starrymeet.com/health || exit 1

echo "🎉 Deployment successful!"
```

**Frontend Deployment** (`frontend/deploy/s3-deploy.sh`):
```bash
#!/bin/bash

set -e

echo "🚀 Deploying frontend to S3..."

# 1. Build (if using build process)
# npm run build

# 2. Sync to S3
aws s3 sync . s3://starrymeet-frontend \
  --exclude "*.sh" \
  --exclude ".git/*" \
  --exclude "node_modules/*" \
  --cache-control "public, max-age=31536000" \
  --delete

# 3. Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"

echo "✅ Frontend deployed!"
```

**Terraform Configuration** (example: `deploy/terraform/rds.tf`):
```hcl
resource "aws_db_instance" "postgres" {
  identifier           = "starrymeet-db"
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = "db.t3.small"
  allocated_storage    = 20
  storage_type         = "gp3"

  db_name  = "starrymeet"
  username = var.db_username
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "Mon:04:00-Mon:05:00"

  skip_final_snapshot = false
  final_snapshot_identifier = "starrymeet-db-final-snapshot"

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  tags = {
    Name        = "StarryMeet Database"
    Environment = "production"
  }
}

output "rds_endpoint" {
  value = aws_db_instance.postgres.endpoint
}
```

**Environment Variables** (AWS Secrets Manager):
```json
{
  "DATABASE_URL": "postgresql://user:pass@starrymeet-db.xxxxx.us-east-1.rds.amazonaws.com:5432/starrymeet",
  "JWT_SECRET": "super-secret-jwt-key-change-in-production",
  "STRIPE_SECRET_KEY": "sk_live_xxxxx",
  "STRIPE_WEBHOOK_SECRET": "whsec_xxxxx",
  "SENDGRID_API_KEY": "SG.xxxxx",
  "NODE_ENV": "production",
  "PORT": "3000",
  "CORS_ORIGIN": "https://www.starrymeet.com"
}
```

**CI/CD Pipeline** (GitHub Actions):
```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build, tag, and push image to Amazon ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: starrymeet-backend
          IMAGE_TAG: ${{ github.sha }}
        run: |
          cd backend
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster starrymeet-cluster \
            --service starrymeet-backend \
            --force-new-deployment

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to S3
        run: |
          aws s3 sync ./frontend s3://starrymeet-frontend --delete

      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
```

**Cost Estimates** (Monthly):

**Development Environment**:
- RDS (db.t3.micro): $15/month
- ECS (1 task, 0.25 vCPU, 0.5 GB): $15/month
- ALB: $20/month
- S3 + CloudFront: $5/month
- **Total: ~$55/month**

**Production Environment**:
- RDS (db.t3.small, Multi-AZ): $70/month
- ECS (2 tasks, 0.5 vCPU, 1 GB): $60/month
- ALB: $20/month
- S3 + CloudFront: $20/month
- Route 53: $1/month
- **Total: ~$171/month**

**How to Deploy**:

**Step 1: Setup AWS Account**
```bash
# Install AWS CLI
brew install awscli

# Configure credentials
aws configure
# AWS Access Key ID: xxxxx
# AWS Secret Access Key: xxxxx
# Default region: us-east-1
# Default output format: json
```

**Step 2: Deploy Infrastructure (via Terraform)**
```bash
cd backend/deploy/terraform

# Initialize Terraform
terraform init

# Plan deployment
terraform plan -out=tfplan

# Review plan, then apply
terraform apply tfplan

# Save outputs
terraform output -json > outputs.json
```

**Step 3: Deploy Backend**
```bash
cd backend

# First time: Create ECR repository
aws ecr create-repository --repository-name starrymeet-backend

# Deploy
./deploy/scripts/deploy.sh
```

**Step 4: Deploy Frontend**
```bash
cd frontend

# Update API URL in config
# Change API_URL to: https://api.starrymeet.com

# Deploy
./deploy/s3-deploy.sh
```

**Step 5: Verify Deployment**
```bash
# Check backend health
curl https://api.starrymeet.com/health

# Check frontend
curl https://www.starrymeet.com

# Check ECS tasks
aws ecs describe-services \
  --cluster starrymeet-cluster \
  --services starrymeet-backend

# Check logs
aws logs tail /ecs/starrymeet-backend --follow
```

**Monitoring Setup**:

**CloudWatch Alarms**:
```bash
# High error rate alarm
aws cloudwatch put-metric-alarm \
  --alarm-name starrymeet-high-error-rate \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --metric-name 5XXError \
  --namespace AWS/ApplicationELB \
  --period 300 \
  --statistic Sum \
  --threshold 10 \
  --alarm-actions arn:aws:sns:us-east-1:123456789:alerts

# High CPU alarm
aws cloudwatch put-metric-alarm \
  --alarm-name starrymeet-high-cpu \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --period 300 \
  --statistic Average \
  --threshold 80 \
  --alarm-actions arn:aws:sns:us-east-1:123456789:alerts
```

**Deliverables**:
- ✅ Backend deployed to ECS Fargate
- ✅ PostgreSQL database on RDS
- ✅ Frontend on S3 + CloudFront
- ✅ SSL certificates for both domains
- ✅ API accessible at https://api.starrymeet.com
- ✅ Frontend at https://www.starrymeet.com
- ✅ CloudWatch monitoring and alarms
- ✅ CI/CD pipeline with GitHub Actions
- ✅ Deployment and rollback scripts

**Success Criteria**:
- Both frontend and backend accessible via HTTPS
- Health check endpoint responding
- Can register, login, and create booking in production
- Stripe payments working in production
- CloudWatch logging all requests
- Auto-scaling working under load

---

### Session 7: Real-Time Features (Week 6-7)
**Goal**: Add WebSocket-based chat and notifications

**What I'll Build**:

**Files Created**:
```
backend/src/
├── models/
│   ├── Message.ts               # Message model
│   └── Conversation.ts          # Conversation model
├── controllers/
│   └── messageController.ts     # Message CRUD
├── routes/
│   └── messageRoutes.ts
├── services/
│   └── socketService.ts         # Socket.io logic
└── socket/
    ├── index.ts                 # Socket.io server setup
    ├── authMiddleware.ts        # Socket authentication
    ├── handlers/
    │   ├── chatHandler.ts       # Chat events
    │   └── notificationHandler.ts # Notification events
    └── types.ts                 # Socket event types

frontend/js/
├── socket.js                    # Socket.io client
├── chat.js                      # Chat UI logic
└── notifications.js             # Notification UI
```

**Socket.io Server Setup** (`backend/src/socket/index.ts`):
```typescript
import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';

export function initializeSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
      socket.data.userId = decoded.userId;
      socket.data.role = decoded.role;

      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  // Connection event
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.data.userId}`);

    // Join user's personal room (for notifications)
    socket.join(`user:${socket.data.userId}`);

    // Chat events
    socket.on('join_conversation', async (data) => {
      const { conversationId } = data;

      // Verify user has access to this conversation
      const hasAccess = await verifyConversationAccess(
        socket.data.userId,
        conversationId
      );

      if (hasAccess) {
        socket.join(`conversation:${conversationId}`);

        // Load recent messages
        const messages = await getRecentMessages(conversationId, 50);
        socket.emit('message_history', messages);
      }
    });

    socket.on('send_message', async (data) => {
      const { conversationId, text } = data;

      // Save message to database
      const message = await createMessage({
        conversationId,
        senderId: socket.data.userId,
        text
      });

      // Broadcast to conversation room
      io.to(`conversation:${conversationId}`).emit('new_message', message);

      // Send push notification to recipient (if offline)
      const recipient = await getConversationRecipient(conversationId, socket.data.userId);
      if (!isUserOnline(recipient.id)) {
        await sendPushNotification(recipient.id, {
          title: 'New message',
          body: text.substring(0, 100)
        });
      }
    });

    socket.on('typing', (data) => {
      const { conversationId } = data;
      socket.to(`conversation:${conversationId}`).emit('user_typing', {
        userId: socket.data.userId
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.data.userId}`);
    });
  });

  return io;
}
```

**Message Model**:
```typescript
interface MessageAttributes {
  id: string;
  conversationId: string;        // FK to conversations
  senderId: string;              // FK to users
  text: string;
  readAt?: Date;
  createdAt: Date;
}
```

**Conversation Model**:
```typescript
interface ConversationAttributes {
  id: string;
  bookingId: string;             // FK to bookings
  userId: string;                // FK to users
  celebrityId: string;           // FK to celebrities
  lastMessageAt?: Date;
  createdAt: Date;
}
```

**Frontend Socket Client** (`frontend/js/socket.js`):
```javascript
class SocketClient {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    const token = localStorage.getItem('jwt');

    if (!token) {
      console.error('Cannot connect: No JWT token');
      return;
    }

    this.socket = io('wss://api.starrymeet.com', {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.connected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Listen for real-time events
    this.socket.on('new_message', (message) => {
      this.handleNewMessage(message);
    });

    this.socket.on('user_typing', (data) => {
      this.handleTyping(data);
    });

    this.socket.on('booking_update', (booking) => {
      this.handleBookingUpdate(booking);
    });

    this.socket.on('notification', (notification) => {
      this.handleNotification(notification);
    });
  }

  joinConversation(conversationId) {
    if (!this.connected) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('join_conversation', { conversationId });

    // Listen for message history
    this.socket.once('message_history', (messages) => {
      this.displayMessages(messages);
    });
  }

  sendMessage(conversationId, text) {
    this.socket.emit('send_message', { conversationId, text });
  }

  sendTypingIndicator(conversationId) {
    this.socket.emit('typing', { conversationId });
  }

  handleNewMessage(message) {
    // Append message to chat UI
    const chatContainer = document.getElementById('messages');
    const messageElement = this.createMessageElement(message);
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Play notification sound
    if (message.senderId !== this.userId) {
      this.playNotificationSound();
    }
  }

  handleTyping(data) {
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.style.display = 'block';

    // Hide after 3 seconds
    setTimeout(() => {
      typingIndicator.style.display = 'none';
    }, 3000);
  }

  handleBookingUpdate(booking) {
    // Update booking status in UI
    const bookingElement = document.getElementById(`booking-${booking.id}`);
    if (bookingElement) {
      bookingElement.querySelector('.status').textContent = booking.status;
    }

    // Show toast notification
    showToast(`Booking ${booking.bookingNumber} ${booking.status}`);
  }

  handleNotification(notification) {
    // Show browser notification
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.body,
        icon: '/images/logo.png'
      });
    }

    // Show in-app notification
    showInAppNotification(notification);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }
}

// Global instance
const socketClient = new SocketClient();

// Auto-connect on page load
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('jwt')) {
    socketClient.connect();
  }
});
```

**Chat UI** (add to dashboard.html):
```html
<!-- Chat Tab in Dashboard -->
<div id="messages-tab" class="tab-content" style="display: none;">
  <div class="chat-container">
    <!-- Conversation list (left sidebar) -->
    <div class="conversation-list">
      <h3>Messages</h3>
      <div id="conversations">
        <!-- Conversations loaded here -->
      </div>
    </div>

    <!-- Chat messages (main area) -->
    <div class="chat-messages">
      <div class="chat-header">
        <img src="" id="chat-avatar" alt="">
        <h3 id="chat-name">Select a conversation</h3>
      </div>

      <div id="messages" class="messages">
        <!-- Messages loaded here -->
      </div>

      <div id="typing-indicator" style="display: none;">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="text">Celebrity is typing...</span>
      </div>

      <div class="message-input">
        <input
          type="text"
          id="message-text"
          placeholder="Type a message..."
          onkeyup="handleTyping()"
          onkeypress="handleEnter(event)"
        >
        <button onclick="sendMessage()" class="btn-send">
          Send
        </button>
      </div>
    </div>
  </div>
</div>

<script>
let currentConversationId = null;

// Load conversations
async function loadConversations() {
  const response = await api.getConversations();
  const conversations = response.data;

  const container = document.getElementById('conversations');
  container.innerHTML = conversations.map(conv => `
    <div class="conversation-item" onclick="openConversation('${conv.id}')">
      <img src="${conv.celebrity.avatarUrl}" alt="${conv.celebrity.displayName}">
      <div class="conversation-info">
        <h4>${conv.celebrity.displayName}</h4>
        <p>${conv.lastMessage || 'No messages yet'}</p>
      </div>
      ${conv.unreadCount > 0 ? `<span class="unread-badge">${conv.unreadCount}</span>` : ''}
    </div>
  `).join('');
}

// Open conversation
function openConversation(conversationId) {
  currentConversationId = conversationId;

  // Join conversation via socket
  socketClient.joinConversation(conversationId);

  // Update header
  // ... (show celebrity name and avatar)
}

// Send message
function sendMessage() {
  const input = document.getElementById('message-text');
  const text = input.value.trim();

  if (text && currentConversationId) {
    socketClient.sendMessage(currentConversationId, text);
    input.value = '';
  }
}

// Typing indicator
let typingTimeout;
function handleTyping() {
  if (!currentConversationId) return;

  clearTimeout(typingTimeout);
  socketClient.sendTypingIndicator(currentConversationId);

  typingTimeout = setTimeout(() => {
    // Stop typing indicator after 3 seconds
  }, 3000);
}

// Enter key to send
function handleEnter(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}
</script>

<style>
.chat-container {
  display: flex;
  height: 600px;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
}

.conversation-list {
  width: 300px;
  border-right: 1px solid var(--gray-200);
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.conversation-item:hover {
  background: var(--gray-50);
}

.messages {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.message {
  margin-bottom: 1rem;
}

.message.own {
  text-align: right;
}

.message-bubble {
  display: inline-block;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  max-width: 70%;
}

.message.own .message-bubble {
  background: var(--purple);
  color: white;
}

.message:not(.own) .message-bubble {
  background: var(--gray-100);
  color: var(--gray-900);
}

.message-input {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid var(--gray-200);
}

#typing-indicator {
  padding: 0.5rem 1rem;
  color: var(--gray-500);
  font-style: italic;
}

.dot {
  animation: typing 1.4s infinite;
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gray-400);
  margin-right: 3px;
}

@keyframes typing {
  0%, 60%, 100% { opacity: 0.3; }
  30% { opacity: 1; }
}
</style>
```

**Push Notifications** (backend):
```typescript
// Using Firebase Cloud Messaging (FCM)
import admin from 'firebase-admin';

async function sendPushNotification(userId: string, notification: {
  title: string;
  body: string;
}) {
  // Get user's FCM token
  const user = await User.findByPk(userId);

  if (!user?.fcmToken) {
    return; // User hasn't registered for push notifications
  }

  const message = {
    notification: {
      title: notification.title,
      body: notification.body
    },
    token: user.fcmToken
  };

  try {
    await admin.messaging().send(message);
    console.log('Push notification sent');
  } catch (error) {
    console.error('Push notification failed:', error);
  }
}
```

**Notification API Endpoints**:
```
POST   /api/notifications/register-device
{
  "fcmToken": "xxxxx"
}

GET    /api/notifications
Response: {
  "data": [
    {
      "id": "uuid",
      "type": "booking_confirmed",
      "title": "Booking confirmed!",
      "body": "Your booking with Taylor Swift is confirmed",
      "read": false,
      "createdAt": "2025-10-10T12:00:00Z"
    }
  ]
}

PUT    /api/notifications/:id/read
```

**How to Test**:

**Test Scenario 1: Real-Time Chat**
```
1. Open two browsers (User and Celebrity accounts)
2. Create a booking (generates conversation)
3. User: Go to Messages tab, select conversation
4. User: Type message → Should appear in celebrity's browser instantly
5. Celebrity: Reply → Should appear in user's browser instantly
6. Test typing indicator: Start typing → Other user sees "typing..."
```

**Test Scenario 2: Notifications**
```
1. User creates booking
2. Celebrity should receive:
   - Browser notification (if enabled)
   - In-app notification badge
   - Email (from previous sessions)
3. Celebrity confirms booking
4. User should receive notification
```

**Test Scenario 3: Offline Handling**
```
1. User sends message to celebrity
2. Celebrity is offline
3. Celebrity should receive push notification
4. Celebrity comes online
5. Message history should load automatically
```

**Deliverables**:
- ✅ Socket.io server integrated with Express
- ✅ Real-time chat between users and celebrities
- ✅ Typing indicators
- ✅ Message persistence in PostgreSQL
- ✅ Push notifications (FCM)
- ✅ In-app notifications
- ✅ Conversation list with unread badges
- ✅ Browser notifications (Web Notifications API)

**Success Criteria**:
- Messages appear instantly in both browsers
- Typing indicator works
- Push notifications sent when offline
- Conversation history persists
- No messages lost during disconnection

---

### Session 8: Microservices Refactor (Week 7-9)
**Goal**: Split monolith into 8 microservices

*(This session is optional for MVP - can be deferred to Phase 2 of roadmap)*

**High-Level Overview**:

**Before** (Monolith):
```
backend/
└── src/
    ├── models/          # All models
    ├── controllers/     # All controllers
    ├── routes/          # All routes
    └── services/        # All services
```

**After** (Microservices):
```
services/
├── user-service/        # Port 3001 - User auth & profiles
├── celebrity-service/   # Port 3002 - Celebrity data & availability
├── booking-service/     # Port 3003 - Booking logic
├── payment-service/     # Port 3004 - Stripe integration
├── notification-service/# Port 3005 - Emails, SMS, push
├── search-service/      # Port 3006 - Elasticsearch
├── message-service/     # Port 3007 - Chat & WebSocket
├── analytics-service/   # Port 3008 - Reporting & metrics
└── api-gateway/         # Port 80/443 - Routes to services
```

**Benefits**:
- ✅ Independent scaling (scale booking service during peak)
- ✅ Independent deployment (update payment without touching chat)
- ✅ Technology flexibility (use Go for search service if needed)
- ✅ Team autonomy (different teams own different services)
- ✅ Fault isolation (payment service down doesn't kill chat)

**Challenges**:
- ❌ Complexity (8 services vs 1)
- ❌ Distributed transactions (booking + payment must be atomic)
- ❌ Service discovery (how services find each other)
- ❌ Monitoring (8 services to monitor)

**When to Refactor**:
- Wait until traffic > 10K requests/day
- Wait until team > 5 developers
- Not needed for MVP

---

### Session 9: React Migration (Week 9-12)
**Goal**: Migrate from vanilla JS to React 18

**What I'll Build**:

**New React Project Structure**:
```
frontend-react/
├── public/
│   └── assets/
├── src/
│   ├── api/
│   │   ├── client.ts            # Axios wrapper
│   │   └── endpoints/
│   │       ├── auth.ts
│   │       ├── celebrities.ts
│   │       ├── bookings.ts
│   │       └── payments.ts
│   ├── components/
│   │   ├── common/              # Reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   └── features/            # Feature-specific
│   │       ├── CelebrityCard.tsx
│   │       ├── BookingWizard.tsx
│   │       └── ChatWindow.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Browse.tsx
│   │   ├── CelebrityProfile.tsx
│   │   ├── Booking.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── store/
│   │   ├── store.ts             # Redux store
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       ├── celebritySlice.ts
│   │       ├── bookingSlice.ts
│   │       └── uiSlice.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useSocket.ts
│   │   └── useBooking.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── types/
│   │   ├── Celebrity.ts
│   │   ├── Booking.ts
│   │   └── User.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── routes.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

**Example: Browse Page in React**:
```tsx
// pages/Browse.tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCelebrities, setFilters } from '@/store/slices/celebritySlice';
import CelebrityCard from '@/components/features/CelebrityCard';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';

export default function Browse() {
  const dispatch = useAppDispatch();
  const { celebrities, loading, filters } = useAppSelector(state => state.celebrity);

  useEffect(() => {
    dispatch(fetchCelebrities(filters));
  }, [filters, dispatch]);

  const handleCategoryChange = (category: string) => {
    dispatch(setFilters({ ...filters, category }));
  };

  return (
    <div className="browse-page">
      <h1 className="text-4xl font-bold mb-8">Browse Celebrities</h1>

      <div className="filters mb-6">
        {['All', 'Hollywood', 'Musicians', 'Athletes', 'Business'].map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`filter-btn ${filters.category === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSkeleton count={12} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {celebrities.map(celebrity => (
            <CelebrityCard key={celebrity.id} celebrity={celebrity} />
          ))}
        </div>
      )}
    </div>
  );
}
```

**Redux Slice Example**:
```typescript
// store/slices/celebritySlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/api/client';

export const fetchCelebrities = createAsyncThunk(
  'celebrity/fetchAll',
  async (filters: CelebrityFilters) => {
    const response = await api.get('/celebrities', { params: filters });
    return response.data;
  }
);

const celebritySlice = createSlice({
  name: 'celebrity',
  initialState: {
    celebrities: [],
    loading: false,
    error: null,
    filters: { category: 'All', limit: 12, offset: 0 }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCelebrities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCelebrities.fulfilled, (state, action) => {
        state.loading = false;
        state.celebrities = action.payload.celebrities;
      })
      .addCase(fetchCelebrities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setFilters } = celebritySlice.actions;
export default celebritySlice.reducer;
```

**Stripe Integration in React**:
```tsx
// components/features/PaymentForm.tsx
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';

export default function PaymentForm({ bookingId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      // 1. Create payment intent
      const { data } = await api.post('/payments/create-intent', { bookingId });

      // 2. Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          }
        }
      );

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': { color: '#aab7c4' }
            }
          }
        }}
      />

      {error && <div className="error-message">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn-primary w-full mt-4"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}
```

**Benefits of React Migration**:
- ✅ Component reusability
- ✅ State management with Redux
- ✅ TypeScript for type safety
- ✅ Better developer experience
- ✅ Easier testing
- ✅ Modern tooling (Vite, ESLint, Prettier)

**Migration Strategy**:
1. Build React app alongside current HTML pages
2. Test each page in React
3. Gradual cutover (page by page)
4. Retire old HTML pages

---

### Session 10: Advanced Features (Week 12-14)
**Goal**: Add search, admin panel, and mobile apps

**Elasticsearch Search**:
- Index all celebrities
- Autocomplete suggestions
- Faceted search (filters)
- Fuzzy matching ("tylor swift" → "Taylor Swift")

**Admin Panel**:
- React admin app
- Celebrity verification workflow
- User management
- Financial reporting
- Analytics dashboards

**Mobile Apps** (React Native):
- Shared business logic with web
- Push notifications
- Biometric auth
- Camera for profile photos
- Submit to App Store & Play Store

---

## How We'll Work Together

### Session Workflow

**1. Planning Phase** (AI creates spec)
```
I write a detailed specification:
- What I'll build
- Files I'll create/modify
- API endpoints
- Database changes
- Testing instructions

You review and approve before I code.
```

**2. Implementation Phase** (AI codes)
```
I write all the code:
- Backend files
- Frontend files
- Tests
- Documentation

I commit to git with clear message.
```

**3. Testing Phase** (You test)
```
You test the feature:
- Follow test instructions
- Try edge cases
- Report any bugs

I fix bugs in next iteration.
```

**4. Approval Phase** (Move forward)
```
Once you approve:
- We move to next session
- I document what was built
- We plan next session
```

### Communication Protocol

**What You'll Say**:
- "Approved, proceed with Session X"
- "Bug found: [description]"
- "Change request: [description]"
- "Skip Session X, move to Session Y"

**What I'll Say**:
- "Session X specification ready for review"
- "Session X implementation complete"
- "Bug fixed, please re-test"
- "Session X approved, moving to Session Y"

### Git Workflow

**Branching Strategy**:
```
main (production)
├── develop (integration)
    ├── feature/auth-system (Session 2)
    ├── feature/booking-api (Session 3)
    ├── feature/stripe-payments (Session 4)
    └── ...
```

**Commit Messages**:
```
feat(auth): Add user registration and login endpoints

- Implement POST /api/auth/register
- Implement POST /api/auth/login
- Add JWT generation and verification
- Add input validation middleware

Session 2 complete.
```

### Testing Approach

**I'll Provide**:
1. **Postman Collection** - All API endpoints pre-configured
2. **Test Scripts** - Step-by-step manual test instructions
3. **Sample Data** - Test users, celebrities, bookings
4. **Test Cards** - Stripe test cards for payment testing

**You'll Do**:
1. Run API tests in Postman
2. Test frontend in browser
3. Verify database records
4. Check email delivery (if applicable)
5. Report any issues

### Documentation

**After Each Session**:
- I update API documentation
- I update architecture diagrams
- I add code comments
- I write migration guides

**You Get**:
- Clear changelog of what was built
- Updated Postman collection
- Test results summary
- Next session plan

---

## Prerequisites & Requirements

### What You Need to Provide

**Accounts & API Keys**:
1. **Stripe**:
   - Test API keys: `sk_test_...` and `pk_test_...`
   - Webhook secret: `whsec_...`
   - Later: Production keys

2. **SendGrid**:
   - API key for email sending
   - Verified sender email

3. **AWS**:
   - AWS account with admin access
   - Access Key ID and Secret Access Key
   - Or: I guide you through setup

4. **Domain** (optional for MVP):
   - Domain name (e.g., starrymeet.com)
   - Access to DNS settings

**Decisions Needed**:
1. **Database**: PostgreSQL (recommended) or MongoDB?
2. **Cloud Provider**: AWS (recommended), GCP, or Azure?
3. **Hosting**: ECS Fargate, EC2, or alternative (Railway, Render)?
4. **Budget**: Comfort level with cloud costs ($50-200/month)?

### What I Need to Know

**Business Requirements**:
- Platform fee percentage? (15% recommended)
- Refund policy details (confirmed in Session 4)
- Celebrity payout frequency (weekly? monthly?)
- Minimum booking advance notice (7 days confirmed)
- Tax handling (collect and remit, or celebrity handles?)

**Technical Preferences**:
- TypeScript strict mode? (recommended: yes)
- Test coverage target? (80% recommended)
- Code style (ESLint + Prettier auto-format?)
- Logging level (development: debug, production: info)

### Infrastructure Access

**For Development**:
- PostgreSQL database (local or cloud)
- Node.js 20+ installed
- Git installed
- Code editor (VS Code recommended)

**For Deployment**:
- AWS account (or alternative cloud)
- Domain registrar access (for DNS)
- Stripe account (test mode for development)
- Email service account (SendGrid or alternative)

---

## Timeline & Milestones

### 14-Week Plan (MVP Complete)

**Weeks 1-2: Foundation**
- Session 1: Backend foundation ✅
- Session 2: Authentication ✅

**Weeks 3-4: Core Features**
- Session 3: Celebrity & Booking APIs ✅
- Session 4: Stripe payments ✅

**Weeks 5-6: Integration & Deployment**
- Session 5: Frontend API integration ✅
- Session 6: AWS deployment ✅

**Weeks 7-9: Real-Time & Scaling**
- Session 7: WebSocket chat & notifications ✅
- Session 8: Microservices (optional) ⏭️

**Weeks 10-12: Modern Stack**
- Session 9: React migration ✅

**Weeks 13-14: Advanced Features**
- Session 10: Search, admin, mobile ✅

### Milestones

**Milestone 1: Backend MVP** (Week 4)
- ✅ API endpoints operational
- ✅ Database schema complete
- ✅ Authentication working
- ✅ Payments processing

**Milestone 2: Full Integration** (Week 6)
- ✅ Frontend connected to backend
- ✅ Deployed to AWS
- ✅ Can create real bookings

**Milestone 3: Real-Time Platform** (Week 9)
- ✅ Chat working
- ✅ Notifications functional
- ✅ Scalable architecture

**Milestone 4: Modern Stack** (Week 12)
- ✅ React frontend
- ✅ TypeScript everywhere
- ✅ Test coverage >80%

**Milestone 5: Production Ready** (Week 14)
- ✅ Search working
- ✅ Admin panel complete
- ✅ Mobile apps submitted

### Realistic Expectations

**What's Achievable**:
- ✅ Working MVP in 6-8 weeks (Sessions 1-6)
- ✅ Production-ready in 12-14 weeks (all sessions)
- ✅ First paying customer within 16 weeks

**What Takes Longer**:
- ❌ Perfect UI/UX (iterative process)
- ❌ Zero bugs (bugs are normal, we fix them)
- ❌ Viral growth (requires marketing, not just tech)

**Success Factors**:
- Consistent 2-3 sessions per week
- Quick testing turnaround (1-2 days)
- Clear communication
- Realistic scope (can defer features)

---

## AI Advantages & Limitations

### What Makes This Work

**AI Strengths**:
1. **Consistency**: I follow architecture docs precisely
2. **Speed**: Can generate 1000s of lines of boilerplate quickly
3. **Best Practices**: Know industry standards for security, performance
4. **Documentation**: Document as I build
5. **Patience**: Never get tired or frustrated
6. **Learning**: Adapt based on your feedback

**Real Example**:
```
Traditional development:
- 1 developer × 14 weeks × 40 hrs/week = 560 hours
- Cost: $50-150/hr = $28K-84K

AI-assisted development:
- AI coding: ~50 hours (spread over 14 weeks)
- Your testing: ~50 hours
- Total: ~100 hours of human time
- Cost: Infrastructure only (~$200/month)
```

### My Limitations

**What I Can't Do**:
1. **Run Code**: You must test everything
2. **Access External Services**: You configure Stripe, AWS, etc.
3. **Make Business Decisions**: You decide features, pricing, etc.
4. **Real-Time Debugging**: Can't see your screen or logs
5. **Context Limits**: Need session-based approach

**How We Compensate**:
1. **Testing**: I write comprehensive test instructions
2. **Configuration**: I provide exact setup steps
3. **Decisions**: I offer options with pros/cons
4. **Debugging**: You send error logs, I diagnose
5. **Sessions**: Each session is self-contained

### When to Escalate

**Bring in Human Developer If**:
- Complex algorithm optimization needed
- Real-time debugging session required
- Unusual third-party integration
- Performance tuning at scale
- DevOps automation beyond basics

**I'm Best For**:
- CRUD APIs (create, read, update, delete)
- Database schema design
- API integration (Stripe, SendGrid, etc.)
- Boilerplate code generation
- Documentation writing
- Test case creation

---

## Next Steps

### Immediate Actions

**To Start Session 1**:
1. Confirm you want to proceed
2. Provide PostgreSQL connection details (or I help you set up)
3. Decide: Local development first, or cloud from start?
4. I create backend project structure
5. We test `/health` endpoint

**To Prepare for All Sessions**:
1. Create Stripe test account (https://dashboard.stripe.com/register)
2. Create SendGrid account (https://signup.sendgrid.com/)
3. Create AWS account (https://aws.amazon.com/free/)
4. Clone frontend repo locally
5. Install Node.js 20+, PostgreSQL, Git

### Questions to Answer

**Before We Start**:
- [ ] Do you have a PostgreSQL database ready?
- [ ] Do you have AWS account (or alternative cloud)?
- [ ] Do you have Stripe test account?
- [ ] What's your timeline expectation (weeks)?
- [ ] What's your budget for infrastructure?
- [ ] Any features to prioritize or defer?

### First Session Preview

**Session 1 Will Deliver**:
```
backend/
├── src/
│   ├── server.ts          # Express server
│   ├── config/
│   │   └── database.ts    # Sequelize config
│   └── routes/
│       └── health.ts      # Health check
├── package.json
├── tsconfig.json
└── .env.example

Working endpoints:
- GET /health → 200 OK
- GET /api/version → { version: "1.0.0" }
```

**Test Command**:
```bash
curl http://localhost:3000/health
# Expected: {"status": "ok", "timestamp": "2025-10-10T12:00:00Z"}
```

**Time Required**:
- AI coding: 30 minutes
- Your setup & testing: 1-2 hours
- Total: ~2 hours until Session 1 complete

---

## Summary

**This Plan Gives You**:
- ✅ Clear roadmap (10 sessions)
- ✅ Incremental delivery (test as we build)
- ✅ Full-stack platform (frontend + backend)
- ✅ Real payments (Stripe integration)
- ✅ Production deployment (AWS)
- ✅ Modern tech stack (React, Node.js, PostgreSQL)
- ✅ Scalable architecture (microservices ready)

**What You Get at End**:
- Working celebrity booking platform
- Deployed on AWS (HTTPS)
- Real payment processing
- User authentication
- Real-time chat
- Admin panel
- Mobile apps (React Native)
- Full documentation

**What You Invest**:
- Time: 2-3 sessions per week × 14 weeks
- Testing: 1-2 hours per session
- Infrastructure: $50-200/month
- No developer salaries

**Risk Mitigation**:
- Each session is self-contained (can stop anytime)
- Git history allows rollback
- Incremental approach (nothing big-bang)
- I adapt based on your feedback

---

## Ready to Begin?

**Say the word and we'll start with**:
1. Frontend premium redesign (today)
2. Backend Session 1 (next session)

**The Future StarryMeet Stack**:
```
Frontend (Premium): React 18 + TypeScript + Tailwind
Backend: Node.js 20 + Express + TypeScript
Database: PostgreSQL 15 + Redis 7
Payments: Stripe + Connect
Real-Time: Socket.io
Search: Elasticsearch 8
Cloud: AWS (ECS, RDS, S3)
Mobile: React Native (iOS + Android)
```

Let's build a platform worth millions! 🚀

---

**Document Status**: Complete & Ready for Execution
**Last Updated**: 2025-10-10
**Next Action**: Premium Frontend Redesign → Backend Session 1
