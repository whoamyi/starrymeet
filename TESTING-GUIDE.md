# StarryMeet Full-Stack Testing Guide

Complete step-by-step guide to test the fully integrated frontend-backend application.

---

## 🚀 Quick Start Summary

```bash
# Terminal 1 - Start Backend API
cd backend
npm start

# Terminal 2 - Start Frontend Server
cd ..
python3 -m http.server 8080
```

Then open: http://localhost:8080

---

## Part 1: Backend Setup & Testing

### Step 1: Install PostgreSQL Database

**On Ubuntu/WSL:**
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo service postgresql start

# Check status
sudo service postgresql status
```

**On macOS:**
```bash
brew install postgresql
brew services start postgresql
```

### Step 2: Create Database

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL shell, run these commands:
CREATE DATABASE starrymeet_dev;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE starrymeet_dev TO postgres;
\q
```

### Step 3: Configure Backend

The `.env` file is already created at `/home/whoami/starrymeet/backend/.env` with:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=starrymeet_dev
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=starrymeet_super_secret_jwt_key_2025_change_in_production
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_51234567890
FRONTEND_URL=http://localhost:8080
```

**If you need to change the database password:**
1. Open `backend/.env`
2. Update `DB_PASSWORD=your_password`

### Step 4: Install Backend Dependencies

```bash
cd backend
npm install
```

This installs 220+ packages including:
- Express (web server)
- Sequelize (database ORM)
- bcrypt (password hashing)
- jsonwebtoken (JWT authentication)
- Stripe (payments)
- TypeScript
- And more...

### Step 5: Start Backend Server

```bash
# From backend/ directory
npm start

# You should see:
# > ts-node src/server.ts
# Database connected successfully
# Server running on http://localhost:3000
```

**Troubleshooting:**
- If you get "nodemon not found" → Run `npm install` again
- If database connection fails → Check PostgreSQL is running with `sudo service postgresql status`
- If port 3000 is busy → Change `PORT=3001` in `.env`

### Step 6: Test Backend API Endpoints

**Open a new terminal and test with curl:**

```bash
# Test health check
curl http://localhost:3000/health

# Expected: {"status":"ok","timestamp":"..."}

# Test celebrity list (should return empty array initially)
curl http://localhost:3000/api/celebrities

# Expected: {"success":true,"data":{"celebrities":[],"total":0,"page":1,"limit":12}}

# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "full_name": "Test User",
    "phone_number": "+1234567890"
  }'

# Expected: {"success":true,"data":{"token":"...", "user":{...}}}
```

**Database Tables Created:**
When the server starts, Sequelize auto-creates these tables:
- `Users` - User accounts
- `Celebrities` - Celebrity profiles
- `Bookings` - Meeting bookings
- `Payments` - Payment records
- `Reviews` - User reviews

---

## Part 2: Frontend Setup & Testing

### Step 7: Start Frontend Server

**Option A: Python (Recommended)**
```bash
# From project root (/home/whoami/starrymeet)
python3 -m http.server 8080

# You should see:
# Serving HTTP on 0.0.0.0 port 8080 (http://0.0.0.0:8080/) ...
```

**Option B: Node.js http-server**
```bash
npx http-server -p 8080
```

**Option C: PHP**
```bash
php -S localhost:8080
```

### Step 8: Open Website in Browser

Open your browser to:
```
http://localhost:8080/index.html
```

or simply:
```
http://localhost:8080
```

---

## Part 3: Full-Stack Integration Testing

### Test 1: Frontend Loads Static Data (Fallback)

**What to check:**
1. Homepage loads successfully
2. You see celebrity cards with initials (AA, BB, CC, etc.)
3. Star ratings show "★ 4.95" (NO "Reserve" button)
4. Carousel arrows fade in when you hover over carousel
5. All text is consistent size (16px body text, small headings)
6. Design is minimal - black/white/gray with rare purple accent

**Expected behavior:**
- Since backend has no data yet, frontend uses static fallback data from `js/shared.js`
- You should see 12 celebrity cards with placeholder initials

### Test 2: Backend API Connection

**Open browser DevTools (F12) and check Console:**

Look for:
```
Failed to load celebrities from API: Error: [some error]
```

This is EXPECTED because:
1. Backend is running but has no celebrity data yet
2. Frontend gracefully falls back to static data

**To verify API is reachable:**
Open DevTools → Network tab → Refresh page → Look for:
- `GET http://localhost:3000/api/celebrities`
- Status: 200 OK
- Response: `{"success":true,"data":{"celebrities":[],...}}`

### Test 3: User Registration

**Test the full authentication flow:**

1. Open browser console (F12)
2. Type this in console:

```javascript
// Register a new user
const response = await api.register({
    email: 'john@example.com',
    password: 'Test123!',
    full_name: 'John Doe',
    phone_number: '+1234567890'
});
console.log(response);
```

**Expected result:**
```javascript
{
  success: true,
  data: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: {
      user_id: 1,
      email: "john@example.com",
      full_name: "John Doe",
      role: "user"
    }
  }
}
```

**What happened behind the scenes:**
1. Frontend sent POST to `http://localhost:3000/api/auth/register`
2. Backend hashed password with bcrypt
3. Backend stored user in PostgreSQL database
4. Backend generated JWT token
5. Frontend stored token in localStorage
6. User is now "logged in"

### Test 4: User Login

```javascript
// Login with the user you just created
const loginResponse = await api.login('john@example.com', 'Test123!');
console.log(loginResponse);

// Check if token is stored
console.log('Token:', localStorage.getItem('starryMeetToken'));
```

**Expected:**
- Same response structure as registration
- Token saved in localStorage
- Future API calls will include this token in Authorization header

### Test 5: Add Celebrity Data (Manual)

Since we don't have an admin panel yet, add celebrities via API:

```javascript
// You need a logged-in user first (do Test 3 or 4 above)

// Create a celebrity (this would normally be admin-only)
const celeb = await fetch('http://localhost:3000/api/celebrities', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('starryMeetToken')}`
    },
    body: JSON.stringify({
        display_name: 'Leonardo DiCaprio',
        category: 'Actors',
        location: 'Los Angeles',
        standard_meet_price_cents: 250000, // $2,500
        is_verified: true,
        is_featured: true
    })
}).then(r => r.json());

console.log(celeb);
```

**Refresh the page** - you should now see "Leonardo DiCaprio" card!

### Test 6: Create a Booking

```javascript
// Make sure you're logged in first (Test 3/4)

// Create a booking for a celebrity
const booking = await api.createBooking({
    celebrity_id: 1, // ID from the celebrity you created
    meeting_type: 'standard',
    preferred_date: '2025-11-01',
    preferred_location: 'Los Angeles, CA',
    notes: 'Super excited to meet you!'
});

console.log(booking);
```

**Expected:**
```javascript
{
  success: true,
  data: {
    booking: {
      booking_id: 1,
      user_id: 1,
      celebrity_id: 1,
      status: 'pending',
      meeting_type: 'standard',
      ...
    }
  }
}
```

### Test 7: View My Bookings

```javascript
const myBookings = await api.getMyBookings();
console.log(myBookings);
```

**Expected:**
- Array of your bookings
- Each booking includes celebrity info, status, date, etc.

---

## Part 4: Testing Checklist

### ✅ Frontend Visual Tests

- [ ] Homepage loads at http://localhost:8080
- [ ] Celebrity cards show with initials
- [ ] Star rating displays "★ 4.95" (no Reserve button)
- [ ] Carousel arrows fade in smoothly on hover
- [ ] All text sizes are consistent (16px body, small headings)
- [ ] Design is minimal - 95% black/white/gray
- [ ] Only purple color is on CTA button
- [ ] Mobile view is compact and app-like
- [ ] Navigation menu works
- [ ] Browse page loads
- [ ] Celebrity profile page loads

### ✅ Backend API Tests

- [ ] Backend server starts successfully
- [ ] PostgreSQL database connected
- [ ] Health endpoint works: `GET /health`
- [ ] Celebrity list endpoint: `GET /api/celebrities`
- [ ] User registration works: `POST /api/auth/register`
- [ ] User login works: `POST /api/auth/login`
- [ ] Token stored in localStorage
- [ ] Protected routes require authentication
- [ ] Bookings can be created
- [ ] Bookings can be retrieved

### ✅ Integration Tests

- [ ] Frontend calls backend API
- [ ] Backend responds with JSON
- [ ] Frontend displays backend data
- [ ] Authentication flow works end-to-end
- [ ] JWT tokens are properly stored and sent
- [ ] Error handling works (backend down, bad request, etc.)

---

## Part 5: Common Issues & Solutions

### Issue: Backend won't start

**Symptom:** `'nodemon' is not recognized`

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Issue: Database connection failed

**Symptom:** `Unable to connect to database`

**Solution:**
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Start it if not running
sudo service postgresql start

# Reset database password
sudo -u postgres psql
ALTER USER postgres WITH PASSWORD 'postgres';
\q
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill it
kill -9 $(lsof -ti:3000)

# Or change backend port in .env
# PORT=3001
```

### Issue: CORS errors in browser

**Symptom:** `Access to fetch at 'http://localhost:3000' from origin 'http://localhost:8080' has been blocked by CORS`

**Solution:**
- Backend already has CORS configured
- Make sure backend `.env` has: `FRONTEND_URL=http://localhost:8080`
- Restart backend server after changing `.env`

### Issue: Frontend shows old data

**Solution:**
```bash
# Hard refresh browser
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)

# Or clear browser cache
DevTools → Application → Clear storage → Clear site data
```

### Issue: API calls fail silently

**Solution:**
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for failed requests (red)
5. Click on failed request to see error details

---

## Part 6: Next Steps

### Add More Celebrities

Use the browser console to add celebrities:

```javascript
const celebrities = [
    {
        display_name: 'Dwayne Johnson',
        category: 'Actors',
        location: 'Los Angeles',
        standard_meet_price_cents: 500000,
        is_verified: true,
        is_featured: true
    },
    {
        display_name: 'Taylor Swift',
        category: 'Musicians',
        location: 'New York',
        standard_meet_price_cents: 1000000,
        is_verified: true,
        is_featured: true
    },
    {
        display_name: 'Serena Williams',
        category: 'Athletes',
        location: 'Miami',
        standard_meet_price_cents: 300000,
        is_verified: true,
        is_featured: true
    }
];

// Add them one by one
for (const celeb of celebrities) {
    await fetch('http://localhost:3000/api/celebrities', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('starryMeetToken')}`
        },
        body: JSON.stringify(celeb)
    }).then(r => r.json());
}
```

### Test Payment Flow

```javascript
// Create a payment intent for a booking
const payment = await api.createPaymentIntent(1); // booking_id
console.log(payment);

// This would integrate with Stripe on production
```

### Build Admin Panel

Next step would be to create an admin dashboard at `/admin.html` where you can:
- Add/edit/delete celebrities
- View all bookings
- Manage users
- Process payments

---

## 🎉 Success Criteria

You've successfully tested the full-stack integration when:

✅ Backend server runs without errors
✅ Frontend loads and displays beautifully
✅ User registration and login work
✅ API calls succeed (check Network tab)
✅ Database stores data correctly
✅ Bookings can be created and retrieved
✅ Authentication flow is secure
✅ Design matches true Cameo minimal aesthetic

---

## 📚 Documentation References

- **Backend API**: See [SETUP.md](SETUP.md) for detailed API documentation
- **Frontend API Client**: See [js/api.js](js/api.js) for all available methods
- **Database Models**: See [backend/src/models/](backend/src/models/) for schema
- **Design System**: See [css/design-principles.css](css/design-principles.css)

---

## 🐛 Reporting Issues

If you encounter issues:

1. Check DevTools Console for errors
2. Check DevTools Network tab for failed requests
3. Check backend terminal for server errors
4. Check this guide's "Common Issues" section
5. Create a GitHub issue with:
   - Error message
   - Steps to reproduce
   - Browser/OS info
   - Screenshots if applicable

---

**Happy Testing! 🚀**
