# StarryMeet Setup Guide

Complete setup instructions for running the full-stack StarryMeet platform locally.

## Prerequisites

- **Node.js** 20+ (https://nodejs.org/)
- **PostgreSQL** 15+ (https://www.postgresql.org/)
- **npm** or **yarn**
- **Git**

## Quick Start (5 minutes)

### 1. Clone Repository

```bash
git clone https://github.com/whoamyi/starrymeet.git
cd starrymeet
```

### 2. Setup PostgreSQL Database

```bash
# Start PostgreSQL
# macOS
brew services start postgresql@15

# Linux/WSL
sudo service postgresql start

# Windows
# Start PostgreSQL from Services app

# Create database
psql postgres
CREATE DATABASE starrymeet_dev;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE starrymeet_dev TO postgres;
\q
```

### 3. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and set your database credentials
# nano .env  (or use any text editor)

# Sync database and seed data
npx ts-node src/seed.ts

# Start backend server
npx ts-node src/server.ts
```

Backend will start on **http://localhost:3000**

### 4. Setup Frontend

Open a **new terminal** window:

```bash
cd frontend

# Install live-server globally (one-time setup)
npm install -g live-server

# Start frontend server
live-server
```

Frontend will open in browser at **http://localhost:8080**

## Environment Configuration

### Backend (.env)

Edit `backend/.env`:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=starrymeet_dev
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Secret (change this!)
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Stripe (optional - for payments)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# SendGrid (optional - for emails)
SENDGRID_API_KEY=SG.your_key
SENDGRID_FROM_EMAIL=noreply@starrymeet.com

# Frontend URL
FRONTEND_URL=http://localhost:8080
```

## Testing the Integration

### 1. Check Backend is Running

Open browser to: http://localhost:3000/health

You should see:
```json
{
  "success": true,
  "message": "StarryMeet API is running",
  "timestamp": "2025-10-12T..."
}
```

### 2. Test API Endpoints

```bash
# Get all celebrities
curl http://localhost:3000/api/celebrities

# Register new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### 3. Test Frontend-Backend Connection

1. Open **http://localhost:8080** in browser
2. Open browser **DevTools Console** (F12)
3. Type: `api.getCelebrities()`
4. You should see celebrities loaded from the backend!

## Database Management

### Seed Database

```bash
cd backend
npx ts-node src/seed.ts
```

This creates:
- **35 celebrities** across 5 categories
- All database tables with proper schema

### Reset Database

```bash
# Drop and recreate database
psql postgres
DROP DATABASE starrymeet_dev;
CREATE DATABASE starrymeet_dev;
\q

# Re-seed
cd backend
npx ts-node src/seed.ts
```

### View Database

```bash
psql starrymeet_dev
\dt                              # List tables
SELECT * FROM celebrities LIMIT 5;  # View celebrities
SELECT * FROM users;                # View users
\q
```

## Development Workflow

### Backend Development

```bash
cd backend

# Start with auto-reload (install nodemon globally first)
npm install -g nodemon
npm run dev

# Or use ts-node directly
npx ts-node src/server.ts

# Run tests (future)
npm test
```

### Frontend Development

```bash
cd frontend

# Option 1: Live Server (recommended)
live-server

# Option 2: Python HTTP server
python3 -m http.server 8080

# Option 3: PHP server
php -S localhost:8080

# Option 4: VS Code Live Server extension
# Right-click index.html -> "Open with Live Server"
```

## API Endpoints Reference

### Authentication
```
POST   /api/auth/register       # Register new user
POST   /api/auth/login          # Login
GET    /api/auth/me             # Get current user (auth required)
```

### Celebrities
```
GET    /api/celebrities              # List all (with filters)
GET    /api/celebrities/:id          # Get by ID or username
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
POST   /api/payments/create-intent   # Create payment intent
POST   /api/payments/webhook          # Stripe webhook
```

## Frontend API Usage

The frontend includes an API client (`frontend/js/api.js`):

```javascript
// Register
await api.register({
  email: 'user@example.com',
  password: 'Password123!',
  first_name: 'John',
  last_name: 'Doe'
});

// Login
await api.login('user@example.com', 'Password123!');

// Get celebrities
const response = await api.getCelebrities({ category: 'Hollywood' });

// Create booking
const booking = await api.createBooking({
  celebrity_id: 'uuid-here',
  meeting_type: 'standard',
  booking_date: '2025-03-15',
  time_slot: 'afternoon',
  contact_name: 'John Doe',
  contact_email: 'john@example.com'
});
```

## Troubleshooting

### Backend won't start

**Error**: `Database connection refused`
```bash
# Make sure PostgreSQL is running
sudo service postgresql status
sudo service postgresql start
```

**Error**: `JWT_SECRET not set`
```bash
# Edit backend/.env and set a strong JWT secret
JWT_SECRET=my_super_secret_key_change_this
```

### Frontend can't connect to backend

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

Solution: Make sure backend is running and FRONTEND_URL in `.env` matches:
```env
FRONTEND_URL=http://localhost:8080
```

### Port already in use

**Backend (port 3000)**:
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
```

**Frontend (port 8080)**:
```bash
lsof -ti:8080 | xargs kill -9
```

### Database seed fails

```bash
# Make sure database exists
psql postgres -c "CREATE DATABASE starrymeet_dev;"

# Make sure you're in backend directory
cd backend
npx ts-node src/seed.ts
```

## Production Deployment

### Backend (AWS)

See [backend/README.md](backend/README.md) for AWS ECS deployment instructions.

### Frontend (GitHub Pages)

Already configured! Just push to main:

```bash
git add .
git commit -m "Update frontend"
git push origin main
```

Frontend auto-deploys to: `https://yourusername.github.io/starrymeet/frontend/`

## Next Steps

1. **Test the API** - Use Postman or curl to test endpoints
2. **Create a user account** - Register and login through the frontend
3. **Browse celebrities** - See 35 seeded celebrities
4. **Make a test booking** - Try the complete booking flow
5. **Setup Stripe** - Add real payment processing (optional)
6. **Deploy to production** - Follow deployment guides

## Support

- **Frontend Issues**: Check `frontend/README.md`
- **Backend Issues**: Check `backend/README.md`
- **Architecture**: See `docs/ARCHITECTURE-VISION.md`

---

**Happy Coding!** 🚀

Built with Node.js + Express + TypeScript + PostgreSQL + HTML/CSS/JS
