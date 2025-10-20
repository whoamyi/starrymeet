# StarryMeet Backend Implementation Plan

**Created**: 2025-10-12
**Version**: 1.0.0
**Status**: 🚧 Active Planning
**Phase**: Phase 1 - MVP Foundation

> **Purpose**: Detailed step-by-step plan for implementing the StarryMeet backend infrastructure, starting from zero to a functional MVP that supports real bookings and payments.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current Status](#current-status)
3. [Phase 1 Objectives](#phase-1-objectives)
4. [Technology Stack](#technology-stack)
5. [Project Structure](#project-structure)
6. [Database Design](#database-design)
7. [API Endpoints](#api-endpoints)
8. [Implementation Steps](#implementation-steps)
9. [Testing Strategy](#testing-strategy)
10. [Deployment Plan](#deployment-plan)

---

## Executive Summary

### What We're Building

A complete Node.js/Express backend API that will:
- Handle user authentication (JWT-based)
- Manage celebrity profiles and availability
- Process booking requests
- Integrate Stripe for payments
- Send email notifications
- Serve data to the existing frontend

### Timeline

**Estimated Duration**: 10-12 weeks (Phase 1 MVP)

**Breakdown**:
- Week 1-2: Project setup, database schema, authentication
- Week 3-4: Celebrity service, booking logic
- Week 5-6: Payment integration (Stripe)
- Week 7-8: Frontend API integration
- Week 9-10: AWS deployment
- Week 11-12: Testing, bug fixes, optimization

### Success Criteria

✅ Users can register and login
✅ Browse real celebrities from database
✅ Create bookings with real payments
✅ Email confirmations working
✅ Dashboard shows real data
✅ Deployed to AWS and accessible

---

## Current Status

### What We Have ✅

**Frontend** (85% complete):
- 13 HTML pages with complete UI
- Booking flow (5 steps)
- Dashboard interface
- Celebrity browse and profile pages
- Mock data via localStorage and shared.js

**Documentation** (95% complete):
- Architecture vision document
- Implementation roadmap
- Site architecture docs
- Component templates

### What We Need 🚧

**Backend** (0% complete):
- No API server
- No database
- No authentication
- No payment processing
- No email system

**Infrastructure** (0% complete):
- No cloud deployment
- No CI/CD pipeline
- No monitoring

---

## Phase 1 Objectives

### Primary Goals

1. **User Authentication**
   - User registration with email verification
   - Login with JWT tokens
   - Password reset functionality
   - Session management

2. **Celebrity Management**
   - Store celebrity profiles in database
   - Manage availability and pricing
   - Handle reviews and ratings
   - Celebrity search and filtering

3. **Booking System**
   - Create booking requests
   - Validate availability
   - Manage booking status lifecycle
   - Send confirmation emails

4. **Payment Processing**
   - Stripe integration for payments
   - Payment intent creation
   - Webhook handling
   - Refund processing

5. **API Integration**
   - Replace localStorage with API calls
   - Connect frontend to backend
   - Handle authentication flow
   - Error handling and loading states

6. **AWS Deployment**
   - Deploy API to AWS ECS
   - PostgreSQL on RDS
   - SSL/HTTPS setup
   - Logging and monitoring

---

## Technology Stack

### Core Technologies

**Runtime & Framework**:
- Node.js 20 LTS
- Express 4.18+
- TypeScript 5.x

**Database**:
- PostgreSQL 15
- Sequelize ORM (or Prisma)

**Authentication**:
- JSON Web Tokens (jsonwebtoken)
- bcrypt for password hashing
- Passport.js (optional)

**Payment Processing**:
- Stripe SDK
- Stripe webhooks

**Email**:
- SendGrid (or AWS SES)

**Validation**:
- Joi (or Zod)

**Testing**:
- Jest
- Supertest

**Development**:
- nodemon
- ts-node
- dotenv

### External Services

- **Stripe**: Payment processing
- **SendGrid**: Email delivery
- **AWS RDS**: PostgreSQL hosting
- **AWS ECS**: Container hosting
- **AWS S3**: File storage (future)
- **AWS CloudWatch**: Logging

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts         # Database connection
│   │   ├── stripe.ts           # Stripe configuration
│   │   └── email.ts            # Email service config
│   │
│   ├── middleware/
│   │   ├── auth.ts             # JWT authentication
│   │   ├── errorHandler.ts    # Global error handling
│   │   ├── validation.ts       # Request validation
│   │   └── logger.ts           # Request logging
│   │
│   ├── models/
│   │   ├── User.ts             # User model
│   │   ├── Celebrity.ts        # Celebrity model
│   │   ├── Booking.ts          # Booking model
│   │   ├── Payment.ts          # Payment model
│   │   ├── Review.ts           # Review model
│   │   └── index.ts            # Model aggregation
│   │
│   ├── controllers/
│   │   ├── authController.ts   # Auth endpoints
│   │   ├── userController.ts   # User management
│   │   ├── celebrityController.ts
│   │   ├── bookingController.ts
│   │   └── paymentController.ts
│   │
│   ├── services/
│   │   ├── authService.ts      # Auth business logic
│   │   ├── emailService.ts     # Email sending
│   │   ├── stripeService.ts    # Stripe operations
│   │   └── bookingService.ts   # Booking logic
│   │
│   ├── routes/
│   │   ├── auth.ts             # /api/auth routes
│   │   ├── users.ts            # /api/users routes
│   │   ├── celebrities.ts      # /api/celebrities routes
│   │   ├── bookings.ts         # /api/bookings routes
│   │   └── payments.ts         # /api/payments routes
│   │
│   ├── utils/
│   │   ├── jwt.ts              # JWT helpers
│   │   ├── validation.ts       # Validators
│   │   ├── errors.ts           # Custom error classes
│   │   └── helpers.ts          # Utility functions
│   │
│   ├── types/
│   │   ├── user.types.ts       # User TypeScript types
│   │   ├── booking.types.ts
│   │   └── celebrity.types.ts
│   │
│   ├── migrations/             # Database migrations
│   │   ├── 001-create-users.ts
│   │   ├── 002-create-celebrities.ts
│   │   └── 003-create-bookings.ts
│   │
│   ├── seeders/                # Database seed data
│   │   └── celebrities.ts      # Seed 12 celebrities
│   │
│   └── server.ts               # Application entry point
│
├── tests/
│   ├── unit/
│   │   ├── auth.test.ts
│   │   └── booking.test.ts
│   └── integration/
│       └── api.test.ts
│
├── .env.example                # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
├── jest.config.js
├── Dockerfile                  # For AWS deployment
└── README.md
```

---

## Database Design

### Core Tables

#### 1. Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'user', -- 'user' | 'celebrity' | 'admin'
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### 2. Celebrities Table

```sql
CREATE TABLE celebrities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Hollywood' | 'Musicians' | 'Athletes' | 'Business'
    bio TEXT,
    location VARCHAR(100),
    avatar_url TEXT,
    cover_photo_url TEXT,

    -- Pricing (in cents)
    quick_meet_price_cents INT, -- 15 min meeting
    standard_meet_price_cents INT, -- 30 min meeting
    premium_meet_price_cents INT, -- 60 min meeting

    -- Stats
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    total_bookings INT DEFAULT 0,

    -- Status
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,

    -- Stripe
    stripe_account_id VARCHAR(255), -- For payouts

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_celebrities_category ON celebrities(category);
CREATE INDEX idx_celebrities_rating ON celebrities(average_rating DESC);
CREATE INDEX idx_celebrities_username ON celebrities(username);
```

#### 3. Bookings Table

```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_number VARCHAR(20) UNIQUE NOT NULL, -- e.g., "BK-2025-123456"

    -- Relationships
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    celebrity_id UUID REFERENCES celebrities(id) ON DELETE CASCADE,

    -- Status
    status VARCHAR(20) DEFAULT 'pending',
    -- 'pending' | 'payment_processing' | 'confirmed' | 'completed' | 'cancelled' | 'refunded'

    -- Meeting details
    meeting_type VARCHAR(20) NOT NULL, -- 'quick' | 'standard' | 'premium'
    booking_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL, -- 'morning' | 'afternoon' | 'evening'

    -- Contact info (user may not be registered)
    contact_name VARCHAR(200) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20),
    special_requests TEXT,

    -- Pricing (cents)
    subtotal_cents INT NOT NULL,
    platform_fee_cents INT NOT NULL, -- Our 15-20% fee
    tax_cents INT NOT NULL,
    total_cents INT NOT NULL,

    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    confirmed_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,

    CONSTRAINT booking_date_future CHECK (booking_date >= CURRENT_DATE)
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_celebrity ON bookings(celebrity_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_number ON bookings(booking_number);
```

#### 4. Payments Table

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,

    -- Stripe IDs
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    stripe_charge_id VARCHAR(255),

    -- Payment details
    amount_cents INT NOT NULL,
    currency VARCHAR(3) DEFAULT 'usd',
    status VARCHAR(20) DEFAULT 'pending',
    -- 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded'

    -- Payment method info
    payment_method_type VARCHAR(50), -- 'card' | 'bank_transfer'
    card_brand VARCHAR(20), -- 'visa' | 'mastercard' | 'amex'
    last4 VARCHAR(4), -- Last 4 digits

    -- Refund info
    refund_amount_cents INT DEFAULT 0,
    refund_reason TEXT,
    stripe_refund_id VARCHAR(255),

    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    paid_at TIMESTAMP,
    refunded_at TIMESTAMP
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_stripe_intent ON payments(stripe_payment_intent_id);
```

#### 5. Reviews Table

```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    celebrity_id UUID REFERENCES celebrities(id) ON DELETE CASCADE,

    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,

    is_verified BOOLEAN DEFAULT FALSE, -- Only from actual bookings
    helpful_count INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_celebrity ON reviews(celebrity_id);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);
```

#### 6. Celebrity Availability Table (Future)

```sql
CREATE TABLE celebrity_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    celebrity_id UUID REFERENCES celebrities(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL, -- 'morning' | 'afternoon' | 'evening'
    is_available BOOLEAN DEFAULT TRUE,
    max_bookings INT DEFAULT 1,
    booked_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(celebrity_id, date, time_slot)
);

CREATE INDEX idx_availability_celebrity_date ON celebrity_availability(celebrity_id, date);
```

---

## API Endpoints

### Base URL

```
Development: http://localhost:3000/api
Production: https://api.starrymeet.com/api
```

### Authentication Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/verify-email
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/me                  # Get current user (protected)
```

### User Endpoints

```
GET    /api/users/me                 # Get profile
PATCH  /api/users/me                 # Update profile
GET    /api/users/me/bookings        # Get user's bookings
GET    /api/users/me/favorites       # Get saved celebrities (future)
```

### Celebrity Endpoints

```
GET    /api/celebrities              # List all celebrities
                                     # Query params: ?category=Hollywood&location=LA&minPrice=1000
GET    /api/celebrities/:id          # Get single celebrity
GET    /api/celebrities/:id/reviews  # Get celebrity reviews
GET    /api/celebrities/featured     # Get featured celebrities
```

### Booking Endpoints

```
POST   /api/bookings                 # Create new booking
GET    /api/bookings/:id             # Get booking details
GET    /api/bookings                 # List user's bookings
PATCH  /api/bookings/:id/cancel      # Cancel booking
POST   /api/bookings/:id/review      # Leave review (after completion)
```

### Payment Endpoints

```
POST   /api/payments/create-intent   # Create Stripe payment intent
POST   /api/payments/confirm         # Confirm payment
POST   /api/payments/:id/refund      # Process refund (admin)
POST   /api/webhooks/stripe          # Stripe webhook handler
```

---

## Implementation Steps

### Week 1-2: Foundation Setup

#### Step 1: Initialize Project

```bash
# Create project directory
mkdir starrymeet-backend
cd starrymeet-backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express typescript ts-node @types/node @types/express
npm install dotenv cors helmet morgan bcrypt jsonwebtoken
npm install sequelize pg pg-hstore
npm install stripe @sendgrid/mail
npm install joi
npm install --save-dev nodemon @types/bcrypt @types/jsonwebtoken @types/cors
npm install --save-dev jest @types/jest supertest @types/supertest ts-jest

# Initialize TypeScript
npx tsc --init
```

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "types": ["node", "jest"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

**package.json scripts**:
```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "migrate": "sequelize-cli db:migrate",
    "seed": "sequelize-cli db:seed:all"
  }
}
```

#### Step 2: Database Setup

**src/config/database.ts**:
```typescript
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;
```

**.env.example**:
```env
# Server
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=starrymeet_dev
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# SendGrid
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=noreply@starrymeet.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

#### Step 3: Create Basic Server

**src/server.ts**:
```typescript
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import sequelize from './config/database';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes (will add later)
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/celebrities', celebrityRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/payments', paymentRoutes);

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Sync models (dev only - use migrations in prod)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database synchronized');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
```

#### Step 4: Create Error Handler

**src/middleware/errorHandler.ts**:
```typescript
import { Request, Response, NextFunction } from 'express';

class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      }
    });
  }

  // Unknown error
  console.error('❌ Error:', err);
  return res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

export { AppError, errorHandler as default };
```

### Week 3-4: Authentication System

See [ARCHITECTURE-VISION.md](ARCHITECTURE-VISION.md) Section on Authentication for JWT implementation details.

### Week 5-6: Celebrity & Booking Services

See [IMPLEMENTATION-ROADMAP.md](IMPLEMENTATION-ROADMAP.md) Phase 1 sections 1.4 and 1.5 for detailed implementation.

### Week 7-8: Payment Integration

See [IMPLEMENTATION-ROADMAP.md](IMPLEMENTATION-ROADMAP.md) Phase 1 section 1.6 for Stripe integration.

### Week 9-10: Frontend Integration

Replace frontend localStorage calls with API requests using fetch/axios.

### Week 11-12: AWS Deployment

Deploy to AWS ECS with RDS PostgreSQL database.

---

## Testing Strategy

### Unit Tests

```typescript
// tests/unit/auth.test.ts
import { hashPassword, comparePassword } from '@/utils/password';

describe('Password utilities', () => {
  it('should hash password correctly', async () => {
    const password = 'MyPassword123!';
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(50);
  });

  it('should compare password correctly', async () => {
    const password = 'MyPassword123!';
    const hash = await hashPassword(password);
    const isMatch = await comparePassword(password, hash);
    expect(isMatch).toBe(true);
  });
});
```

### Integration Tests

```typescript
// tests/integration/auth.test.ts
import request from 'supertest';
import app from '@/server';

describe('Auth API', () => {
  it('POST /api/auth/register should create new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Test123!',
        firstName: 'John',
        lastName: 'Doe'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe('test@example.com');
  });

  it('POST /api/auth/login should return JWT token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Test123!'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });
});
```

---

## Deployment Plan

### AWS Resources

1. **RDS PostgreSQL**
   - Instance: db.t3.small (for MVP)
   - Storage: 20GB SSD
   - Backups: Daily automated

2. **ECS Fargate**
   - Container: 0.5 vCPU, 1GB RAM
   - Tasks: 2 (for redundancy)
   - Auto-scaling: CPU > 70%

3. **Application Load Balancer**
   - HTTPS (SSL from ACM)
   - Health checks enabled
   - Route to ECS tasks

4. **Route 53**
   - DNS: api.starrymeet.com
   - A record → Load Balancer

### Deployment Steps

1. Build Docker image
2. Push to AWS ECR
3. Create ECS task definition
4. Deploy to ECS service
5. Configure load balancer
6. Update DNS records
7. Test production API

---

## Next Steps

1. ✅ Create this implementation plan
2. Initialize backend project structure
3. Setup PostgreSQL database
4. Implement User model and authentication
5. Create Celebrity and Booking models
6. Build API endpoints
7. Integrate Stripe
8. Connect frontend to API
9. Deploy to AWS
10. Launch MVP

---

**Document Version**: 1.0.0
**Last Updated**: 2025-10-12
**Status**: Ready for Implementation
**Next Review**: After Week 2 (Foundation Complete)
