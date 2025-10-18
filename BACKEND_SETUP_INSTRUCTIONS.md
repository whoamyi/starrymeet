# StarryMeet Backend Setup - Quick Start Guide

## ✅ What's Already Done

Your backend is **fully implemented** with:

- ✅ **User Model** with authentication
- ✅ **PostgreSQL** database configuration (Sequelize ORM)
- ✅ **JWT Authentication** (register, login, get current user)
- ✅ **Secure password hashing** (bcrypt)
- ✅ **All API endpoints** implemented
- ✅ **Security middleware** (Helmet, CORS)
- ✅ **Complete database schema** (Users, Celebrities, Bookings, Payments, Reviews)

## 🚀 Quick Setup (3 Steps)

### Step 1: Set PostgreSQL Password

```bash
# Access PostgreSQL as postgres user
sudo -u postgres psql

# Set password (in PostgreSQL prompt)
ALTER USER postgres PASSWORD 'your_secure_password';

# Exit
\q
```

### Step 2: Update .env File

Edit `backend/.env` and update line 10:
```env
DB_PASSWORD=your_secure_password
```

**Note:** JWT_SECRET has already been set with a secure random value.

### Step 3: Run Setup Script

```bash
cd backend
./setup-db.sh
```

This will create the `starrymeet_dev` database.

## 🎯 Start the Backend

```bash
cd backend
npm run dev
```

You should see:
```
✅ Database connection established
✅ Database models synchronized
🚀 Server running on port 3000
📍 Environment: development
🔗 API: http://localhost:3000
🔗 Health: http://localhost:3000/health
```

## 🧪 Test the API

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "a1b2c3d4-...",
      "email": "test@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "user"
    }
  }
}
```

### 3. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

### 4. Get Current User (Protected Route)
```bash
# Replace YOUR_TOKEN_HERE with the token from register/login response
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📡 Available API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Celebrities (`/api/celebrities`)
- `GET /api/celebrities` - Get all celebrities
- `GET /api/celebrities/:id` - Get celebrity by ID
- Protected routes for celebrity management

### Bookings (`/api/bookings`)
- `POST /api/bookings` - Create booking (requires auth)
- `GET /api/bookings` - Get user's bookings (requires auth)
- `GET /api/bookings/:id` - Get booking details (requires auth)

### Payments (`/api/payments`)
- Payment processing endpoints (requires auth)

## 🔒 Security Features

- ✅ **JWT tokens** expire after 7 days
- ✅ **Passwords** hashed with bcrypt (10 rounds)
- ✅ **Email validation** enforced
- ✅ **SQL injection protection** via Sequelize ORM
- ✅ **CORS** configured for frontend
- ✅ **Helmet.js** security headers
- ✅ **UUID** primary keys for security

## 📊 Database Schema

### Users Table
```sql
id              UUID PRIMARY KEY
email           VARCHAR(255) UNIQUE NOT NULL
password_hash   VARCHAR(255) NOT NULL
first_name      VARCHAR(100) NOT NULL
last_name       VARCHAR(100) NOT NULL
phone           VARCHAR(20)
avatar_url      TEXT
role            VARCHAR(20) DEFAULT 'user'  -- 'user', 'celebrity', 'admin'
email_verified  BOOLEAN DEFAULT false
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

## 🔧 Troubleshooting

### PostgreSQL Not Running
```bash
sudo systemctl start postgresql
sudo systemctl status postgresql
```

### Connection Error
1. Check `.env` file has correct `DB_PASSWORD`
2. Verify PostgreSQL is running
3. Check database exists: `psql -U postgres -l`

### Port 3000 Already in Use
```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=3001
```

## 📚 Additional Documentation

- Full setup guide: `backend/DATABASE_SETUP.md`
- Backend README: `backend/README.md`
- API documentation: Coming soon

## 🎉 Next Steps

1. ✅ Backend is running
2. ✅ Database is set up
3. ✅ Authentication works

**Now you can:**
- Test the API endpoints
- Integrate with your frontend
- Add more celebrities to the database
- Implement booking flow
- Add payment processing

## 💡 Pro Tips

- Use **Postman** or **Thunder Client** (VS Code extension) for easier API testing
- The backend automatically creates/updates tables in development mode
- Check console logs for detailed error messages
- Use `npm run build` and `npm start` for production

---

**Need help?** Check `backend/DATABASE_SETUP.md` for detailed troubleshooting.
