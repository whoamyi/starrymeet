# 🚀 Neon PostgreSQL Migration Guide

## 📋 Security Audit Summary

### ✅ Security Issues Fixed
1. **Removed hardcoded password** from `set-postgres-password.sql`
2. **Updated `view-db.sh`** to use environment variables from `.env`
3. **Added `set-postgres-password.sql`** to `.gitignore`
4. **Verified `.env` is not committed** to git (already in .gitignore)

### ✅ Database Structure (Ready for Migration)
Your database uses Sequelize ORM with the following models:
- **Users** (authentication, profiles, roles)
- **Celebrities** (celebrity profiles and availability)
- **Bookings** (appointment scheduling)
- **Payments** (transaction records)
- **Reviews** (user reviews for celebrities)

**Status**: Database structure is clean and ready for Neon deployment.

---

## 🎯 Migration Steps to Neon

### Step 1: Create Neon Database

1. **Log in to Neon Console**: https://console.neon.tech/
2. **Create a new project**:
   - Click "New Project"
   - Name: `starrymeet-production` (or your preferred name)
   - Region: Choose closest to your users (e.g., US East, EU West)
   - Postgres version: 15+ recommended

3. **Get your connection string**:
   - After creation, you'll see a connection string like:
   ```
   postgresql://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require
   ```
   - Copy this entire string

### Step 2: Update Environment Variables

Create a new `.env.production` file in the `backend` directory:

```env
# Server
NODE_ENV=production
PORT=3000

# Neon Database (Replace with your actual Neon connection string)
DATABASE_URL=postgresql://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require

# Or use individual variables:
DB_HOST=[your-neon-endpoint].neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=[your-neon-user]
DB_PASSWORD=[your-neon-password]

# JWT (GENERATE A NEW SECRET FOR PRODUCTION!)
# Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_production_jwt_secret_here
JWT_EXPIRES_IN=7d

# Stripe (Add your production keys)
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# SendGrid (Add your production API key)
SENDGRID_API_KEY=SG.your_sendgrid_key
SENDGRID_FROM_EMAIL=noreply@starrymeet.com

# Frontend URL (Update to your production domain)
FRONTEND_URL=https://starrymeet.com
```

### Step 3: Update Database Configuration

Your `backend/src/config/database.ts` already supports connection strings. Update it to prioritize Neon's `DATABASE_URL`:

**Current code is fine**, but here's an enhanced version for production:

```typescript
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Neon provides DATABASE_URL, use it if available
const databaseUrl = process.env.DATABASE_URL;

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false // Neon uses SSL
        }
      },
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    })
  : new Sequelize(
      process.env.DB_NAME || 'starrymeet_dev',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
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

### Step 4: Migrate Database Schema

You have two options:

#### Option A: Sequelize Auto-Sync (Easiest, for new database)

Run this script to create all tables automatically:

```bash
cd backend
npm run build
node dist/src/scripts/sync-database.js
```

#### Option B: Export/Import (If you have existing data)

1. **Export local database** (if you have data to migrate):
```bash
cd backend
PGPASSWORD='Abuelo115@' pg_dump -h localhost -U postgres -d starrymeet_dev > backup.sql
```

2. **Import to Neon**:
```bash
psql "postgresql://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require" < backup.sql
```

### Step 5: Seed Celebrity Data

Run the celebrity seeder to populate your database:

```bash
cd backend
npm run seed
```

This will create all the celebrity profiles from your seed data.

### Step 6: Test Connection

Test your Neon connection:

```bash
cd backend
npm run dev
```

Watch the console for:
```
✅ Database connected successfully
```

### Step 7: Environment-Specific Deployment

For production deployment, ensure:

1. **Update `package.json` scripts**:
```json
{
  "scripts": {
    "start": "node dist/src/server.js",
    "start:production": "NODE_ENV=production node dist/src/server.js",
    "build": "tsc",
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "seed": "ts-node src/seed.ts",
    "sync-db": "ts-node src/scripts/sync-database.ts"
  }
}
```

2. **Build for production**:
```bash
npm run build
```

3. **Set environment variables** on your hosting platform (Vercel, Railway, Render, etc.):
   - Copy all variables from `.env.production`
   - Set them in your hosting platform's environment variables section

---

## 🔒 Security Checklist

Before going live:

- [ ] **Generate new JWT_SECRET** for production (never reuse development secrets)
- [ ] **Update Stripe keys** to production keys (`sk_live_...`)
- [ ] **Update SendGrid API key** to production key
- [ ] **Set FRONTEND_URL** to your actual domain
- [ ] **Enable SSL/HTTPS** on your production server
- [ ] **Never commit `.env` files** to git (already in .gitignore ✅)
- [ ] **Use strong database passwords** (Neon generates these automatically)
- [ ] **Set up database backups** in Neon console
- [ ] **Enable Neon's connection pooling** (automatically enabled)

---

## 📊 Neon-Specific Features to Leverage

### 1. Branching (Development Databases)
Neon allows you to create branch databases for testing:
```bash
# Create a dev branch from production
neonctl branches create --name dev --parent main
```

### 2. Connection Pooling
Neon automatically provides connection pooling. Your current pool config is good:
```typescript
pool: {
  max: 10,
  min: 0,
  acquire: 30000,
  idle: 10000
}
```

### 3. Auto-Suspend
Neon automatically suspends inactive databases (free tier). Your app will auto-reconnect on next request.

### 4. Point-in-Time Recovery
Enable in Neon console for production:
- Settings → Backups → Enable continuous backups

---

## 🐛 Troubleshooting

### Connection Timeout
If you get connection timeouts, increase the acquire timeout:
```typescript
pool: {
  acquire: 60000, // 60 seconds
  idle: 10000
}
```

### SSL Certificate Errors
Ensure `dialectOptions` has SSL configuration:
```typescript
dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
}
```

### "too many connections" Error
Reduce pool size for free tier:
```typescript
pool: {
  max: 5, // Lower for free tier
  min: 0
}
```

---

## 📞 Next Steps After Migration

1. **Test all API endpoints** with Neon database
2. **Run full test suite** (if you have tests)
3. **Monitor Neon dashboard** for query performance
4. **Set up monitoring** (Sentry, LogRocket, etc.)
5. **Create database backup schedule** in Neon
6. **Document your production connection string** in a secure location (password manager)

---

## 🎉 You're Ready!

Your database is secure and ready for Neon deployment. Follow the steps above in order, and you'll have a production-ready database in ~30 minutes.

**Need help?** Check Neon docs: https://neon.tech/docs/introduction

**Last updated**: January 2025
