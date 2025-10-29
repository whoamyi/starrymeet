# StarryMeet Backend API

Node.js/Express/TypeScript backend for the StarryMeet celebrity booking platform.

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup PostgreSQL

Install PostgreSQL 15+ if you haven't already:

```bash
# On macOS
brew install postgresql@15
brew services start postgresql@15

# On Ubuntu/Debian
sudo apt-get install postgresql-15
sudo systemctl start postgresql

# On Windows
# Download installer from postgresql.org
```

Create database:

```bash
psql postgres
CREATE DATABASE starrymeet_dev;
\q
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=starrymeet_dev
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

SENDGRID_API_KEY=SG.your_sendgrid_key
SENDGRID_FROM_EMAIL=noreply@starrymeet.com

FRONTEND_URL=http://localhost:5500
```

### 4. Seed Database

```bash
npx ts-node src/seed.ts
```

This will:
- Create all database tables
- Seed 35 celebrities from the frontend

### 5. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

## API Endpoints

### Authentication

```
POST   /api/auth/signup           # Create new account (firstName, lastName, email, password)
POST   /api/auth/signin           # Sign in (email, password, rememberMe)
GET    /api/auth/verify           # Verify session token (requires auth header)
POST   /api/auth/signout          # Sign out and delete session (requires auth)
POST   /api/auth/forgot-password  # Request password reset (email)

# Legacy endpoints (backward compatibility)
POST   /api/auth/register         # Alias for signup
POST   /api/auth/login            # Alias for signin
GET    /api/auth/me               # Get current user (requires auth)
```

**Authentication Flow**:
1. User signs up with email/password → Returns session token + user data
2. Frontend stores token in localStorage as `starrymeet_session`
3. Subsequent requests include `Authorization: Bearer <token>` header
4. Backend verifies token via middleware before accessing protected routes
5. Sessions stored in database with expiration (7 or 30 days)

**Session Response Format**:
```json
{
  "success": true,
  "message": "Sign in successful",
  "session": {
    "token": "jwt_token_here",
    "expiresAt": "2025-11-28T12:00:00.000Z"
  },
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": null
  }
}
```

### Celebrities

```
GET    /api/celebrities                  # List all celebrities
       ?category=Hollywood               # Filter by category
       &location=Los Angeles             # Filter by location
       &minPrice=100000                  # Min price (in cents)
       &maxPrice=500000                  # Max price (in cents)
       &rating=4.5                       # Min rating
       &search=emma                      # Search by name
       &featured=true                    # Only featured
       &limit=12                         # Results per page
       &offset=0                         # Pagination offset

GET    /api/celebrities/:id              # Get celebrity by ID or username
GET    /api/celebrities/:id/reviews      # Get celebrity reviews
```

### Bookings

```
POST   /api/bookings                     # Create booking
GET    /api/bookings                     # List user's bookings (auth required)
GET    /api/bookings/:id                 # Get booking details
PATCH  /api/bookings/:id/cancel          # Cancel booking (auth required)
```

#### Create Booking Request Body:

```json
{
  "celebrity_id": "uuid",
  "meeting_type": "quick",
  "booking_date": "2025-03-15",
  "time_slot": "afternoon",
  "contact_name": "John Doe",
  "contact_email": "john@example.com",
  "contact_phone": "+1234567890",
  "special_requests": "Would love to discuss Marvel movies!"
}
```

### Payments

```
POST   /api/payments/create-intent       # Create Stripe payment intent
POST   /api/payments/webhook              # Stripe webhook handler
```

## Database Schema

### Users
- `id` (UUID, PK)
- `email` (unique)
- `password_hash` (bcrypt)
- `first_name`, `last_name`
- `phone`, `avatar_url`
- `role` (user | celebrity | admin)
- `email_verified` (boolean)
- `verification_token` (for email verification)
- `reset_token` (for password reset)
- `reset_token_expires` (timestamp)
- `last_login` (timestamp)
- `is_active` (boolean, default: true)
- `created_at`, `updated_at`

### Sessions ⭐ NEW
- `id` (UUID, PK)
- `user_id` (FK to users)
- `token` (JWT token, unique)
- `expires_at` (timestamp)
- `ip_address` (VARCHAR(45), tracking)
- `user_agent` (TEXT, tracking)
- `created_at` (timestamp)

### User Profiles ⭐ NEW
- `user_id` (UUID, PK, FK to users)
- `bio` (TEXT)
- `location`, `profession`, `company`
- `website`, `instagram`, `linkedin`, `twitter`
- `preferences` (JSONB, for user settings)
- `created_at`, `updated_at`

### Favorites ⭐ NEW
- `id` (UUID, PK)
- `user_id` (FK to users)
- `celebrity_id` (UUID, references celebrities)
- `created_at` (timestamp)
- Unique constraint on (user_id, celebrity_id)

### Celebrities
- `id` (UUID, PK)
- `username` (unique)
- `display_name`, `category`, `location`
- `bio`, `avatar_url`, `cover_photo_url`
- `quick_meet_price_cents`, `standard_meet_price_cents`, `premium_meet_price_cents`
- `average_rating`, `total_reviews`, `total_bookings`
- `is_verified`, `is_active`, `is_featured`

### Bookings
- `id` (UUID, PK)
- `booking_number` (unique, e.g., "BK-2025-123456")
- `user_id` (FK to users, nullable)
- `celebrity_id` (FK to celebrities)
- `status` (pending | payment_processing | confirmed | completed | cancelled | refunded)
- `meeting_type` (quick | standard | premium)
- `booking_date`, `time_slot`
- `contact_name`, `contact_email`, `contact_phone`
- `special_requests`
- `subtotal_cents`, `platform_fee_cents`, `tax_cents`, `total_cents`

### Payments
- `id` (UUID, PK)
- `booking_id` (FK to bookings, unique)
- `stripe_payment_intent_id`, `stripe_charge_id`
- `amount_cents`, `currency`
- `status` (pending | processing | succeeded | failed | refunded)
- `payment_method_type`, `card_brand`, `last4`

### Reviews
- `id` (UUID, PK)
- `booking_id` (FK to bookings, unique)
- `user_id` (FK to users)
- `celebrity_id` (FK to celebrities)
- `rating` (1-5)
- `title`, `comment`
- `is_verified`, `helpful_count`

## Development

### Run Tests

```bash
npm test
```

### Build for Production

```bash
npm run build
npm start
```

### Database Migrations

For production, use Sequelize migrations instead of sync:

```bash
npm run db:migrate
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts              # Sequelize config
│   ├── models/
│   │   ├── User.ts                  # User model
│   │   ├── Celebrity.ts             # Celebrity model
│   │   ├── Booking.ts               # Booking model
│   │   ├── Payment.ts               # Payment model
│   │   ├── Review.ts                # Review model
│   │   └── index.ts                 # Model associations
│   ├── controllers/
│   │   ├── authController.ts        # Auth logic
│   │   ├── celebrityController.ts   # Celebrity logic
│   │   ├── bookingController.ts     # Booking logic
│   │   └── paymentController.ts     # Payment logic
│   ├── routes/
│   │   ├── auth.ts                  # Auth routes
│   │   ├── celebrities.ts           # Celebrity routes
│   │   ├── bookings.ts              # Booking routes
│   │   └── payments.ts              # Payment routes
│   ├── middleware/
│   │   ├── auth.ts                  # JWT authentication
│   │   └── errorHandler.ts          # Error handling
│   ├── utils/
│   │   └── jwt.ts                   # JWT utilities
│   ├── seeders/
│   │   └── celebrities.seed.ts      # Celebrity seed data
│   ├── seed.ts                      # Seed script
│   └── server.ts                    # Entry point
├── package.json
├── tsconfig.json
└── .env.example
```

## Stripe Integration

### Setup Stripe Webhook

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks to local server:

```bash
stripe listen --forward-to localhost:3000/api/payments/webhook
```

4. Copy the webhook secret to `.env` as `STRIPE_WEBHOOK_SECRET`

### Test Payment Flow

1. Create a booking
2. Use Stripe test card: `4242 4242 4242 4242`
3. Any future expiry date
4. Any 3-digit CVC

## Common Issues

### Port 3000 already in use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database connection refused

Make sure PostgreSQL is running:

```bash
# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql
```

### JWT errors

Make sure `JWT_SECRET` in `.env` is set to a strong random string (not the default).

## Production Deployment

See [docs/BACKEND-IMPLEMENTATION-PLAN.md](../docs/BACKEND-IMPLEMENTATION-PLAN.md) for AWS deployment instructions.

---

**Built with**: Node.js 20 + Express + TypeScript + PostgreSQL + Sequelize
**Version**: 1.0.0
