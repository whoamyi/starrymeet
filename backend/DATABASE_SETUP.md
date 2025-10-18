# PostgreSQL Database Setup Guide

This guide will help you set up the PostgreSQL database for StarryMeet.

## Prerequisites

- PostgreSQL installed on your system
- Node.js and npm installed

## Quick Setup (Recommended)

### 1. Install PostgreSQL (if not already installed)

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

### 2. Configure PostgreSQL Password

Set a password for the PostgreSQL user:

```bash
# Access PostgreSQL as the postgres user
sudo -u postgres psql

# In the PostgreSQL prompt, run:
ALTER USER postgres PASSWORD 'your_secure_password';

# Exit PostgreSQL
\q
```

### 3. Update .env File

Edit `backend/.env` and update the database password:

```env
DB_PASSWORD=your_secure_password
```

**Note:** The JWT_SECRET has already been generated with a secure random value.

### 4. Run the Setup Script

```bash
cd backend
./setup-db.sh
```

This script will:
- ✅ Check PostgreSQL connection
- ✅ Create the `starrymeet_dev` database
- ✅ Grant necessary privileges

### 5. Start the Backend Server

```bash
npm run dev
```

The server will automatically:
- Connect to the database
- Sync/create all tables (users, celebrities, bookings, payments, reviews)
- Start listening on port 3000

## Manual Setup

If you prefer to set up the database manually:

```bash
# 1. Create the database
sudo -u postgres psql -c "CREATE DATABASE starrymeet_dev;"

# 2. Grant privileges
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE starrymeet_dev TO postgres;"
```

## Verify Setup

1. **Check Database Connection:**
```bash
npm run dev
```

You should see:
```
✅ Database connection established
✅ Database models synchronized
🚀 Server running on port 3000
```

2. **Test Health Endpoint:**
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "success": true,
  "message": "StarryMeet API is running",
  "timestamp": "2025-10-18T..."
}
```

3. **Test User Registration:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-here",
      "email": "test@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "user"
    }
  }
}
```

## Database Schema

The following tables will be automatically created:

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password_hash` (String)
- `first_name` (String)
- `last_name` (String)
- `phone` (String, Optional)
- `avatar_url` (Text, Optional)
- `role` (Enum: 'user', 'celebrity', 'admin')
- `email_verified` (Boolean, Default: false)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Celebrities Table
- Celebrity profile information
- Links to users with role='celebrity'

### Bookings Table
- Booking requests and details
- Foreign keys to users and celebrities

### Payments Table
- Payment transaction records
- Links to bookings

### Reviews Table
- User reviews for completed bookings
- Foreign keys to users, celebrities, and bookings

## API Endpoints

### Authentication

**Register:**
- `POST /api/auth/register`
- Body: `{ email, password, first_name, last_name, phone? }`

**Login:**
- `POST /api/auth/login`
- Body: `{ email, password }`

**Get Current User:**
- `GET /api/auth/me`
- Headers: `Authorization: Bearer <token>`

### Protected Routes

All protected routes require the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Troubleshooting

### Connection Refused

**Problem:** Cannot connect to PostgreSQL

**Solution:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL if not running
sudo systemctl start postgresql
```

### Authentication Failed

**Problem:** Password authentication failed

**Solution:**
1. Check `backend/.env` has correct `DB_PASSWORD`
2. Reset PostgreSQL password:
```bash
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'new_password';"
```

### Port Already in Use

**Problem:** Port 3000 is already in use

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change PORT in .env
PORT=3001
```

### Database Already Exists

**Problem:** Database already exists and you want to recreate it

**Solution:**
```bash
# Drop and recreate
sudo -u postgres psql -c "DROP DATABASE starrymeet_dev;"
./setup-db.sh
```

## Production Considerations

For production deployment:

1. **Use Environment-Specific Databases:**
```env
# .env.production
DB_NAME=starrymeet_prod
NODE_ENV=production
```

2. **Disable Auto-Sync:**
In `server.ts`, remove `sequelize.sync()` and use migrations:
```bash
npm run db:migrate
```

3. **Use Migrations:**
Create migrations for schema changes instead of using `sync({ alter: true })`

4. **Secure Your Database:**
- Use strong passwords
- Enable SSL connections
- Restrict network access
- Regular backups

## Security Notes

- ✅ JWT secret is generated with cryptographically secure random bytes
- ✅ Passwords are hashed with bcrypt (10 rounds)
- ✅ Email validation is enforced
- ✅ SQL injection protection via Sequelize ORM
- ✅ CORS configured for frontend URL
- ✅ Helmet.js security headers enabled

## Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify all environment variables in `.env`
3. Ensure PostgreSQL version is 12 or higher
4. Check the backend README.md for additional information
