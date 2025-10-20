# Backend Quick Start Guide

**How to start and maintain the StarryMeet backend server**

Last Updated: 2025-10-20

---

## Quick Start (TL;DR)

```bash
cd backend
npm run dev
```

**Keep this terminal window open!** The backend must be running for the frontend to load celebrity data.

---

## What You Need

1. **PostgreSQL** - Must be running
2. **Node.js** - v18 or higher
3. **npm** - Package manager

---

## Step-by-Step

### 1. Check PostgreSQL is Running

```bash
systemctl status postgresql
# or
service postgresql status
```

**If not running:**
```bash
sudo systemctl start postgresql
# or
sudo service postgresql start
```

### 2. Start Backend Server

```bash
cd /home/whoami/starrymeet/backend
npm run dev
```

**Expected output:**
```
[nodemon] starting `ts-node src/server.ts`
✅ Database connection established
🚀 Server running on port 3000
```

### 3. Verify Backend is Working

```bash
curl http://localhost:3000/api/celebrities?limit=1
```

**Expected:** JSON response with celebrity data

---

## Common Issues

### "Failed to fetch" error in browser

**Problem**: Backend server is not running

**Solution**:
```bash
cd backend && npm run dev
```

### "Database connection failed"

**Problem**: PostgreSQL is not running or wrong credentials

**Solution**:
```bash
# Start PostgreSQL
sudo systemctl start postgresql

# Check credentials in backend/.env
cat backend/.env | grep DB_
```

### Port 3000 already in use

**Problem**: Another process is using port 3000

**Solution**:
```bash
# Find the process
lsof -i:3000

# Kill it (replace PID with actual process ID)
kill -9 <PID>

# Or change port in backend/.env
PORT=3001
```

---

## Production Deployment

For GitHub Pages or other hosting:

1. **Deploy backend separately** (Heroku, Railway, Render, etc.)
2. **Update frontend API URL** in `js/api.js`:
   ```javascript
   return 'https://your-backend-url.herokuapp.com/api';
   ```
3. **Configure CORS** in backend to allow frontend domain

---

## Development Workflow

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend && npm run dev
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   python3 -m http.server 8000
   # or
   npx live-server
   ```

3. **Access Application**:
   - Frontend: http://localhost:8000
   - Backend API: http://localhost:3000/api

---

## Environment Variables

Located in `backend/.env`:

```env
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=starrymeet_dev
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:8000
```

---

## Database Info

- **Name**: starrymeet_dev
- **Tables**: users, celebrities, bookings, payments, reviews
- **Records**: 21,580 celebrities
- **Location**: localhost:5432

**View data:**
```bash
cd backend
./view-db.sh
```

---

## Stopping the Server

In the terminal running the backend:
- Press `Ctrl + C`

Or kill the process:
```bash
ps aux | grep "ts-node src/server.ts"
kill <PID>
```

---

## Auto-Start on System Boot (Optional)

Create a systemd service:

```bash
sudo nano /etc/systemd/system/starrymeet-backend.service
```

```ini
[Unit]
Description=StarryMeet Backend Server
After=postgresql.service

[Service]
Type=simple
User=whoami
WorkingDirectory=/home/whoami/starrymeet/backend
ExecStart=/usr/bin/npm run dev
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable starrymeet-backend
sudo systemctl start starrymeet-backend
```

---

## Troubleshooting Checklist

- [ ] PostgreSQL is running
- [ ] Backend server is running (npm run dev)
- [ ] Port 3000 is accessible
- [ ] Database credentials are correct
- [ ] Frontend is pointing to correct API URL
- [ ] No firewall blocking port 3000

---

**Status**: ✅ Backend running successfully on port 3000
**Last Started**: Check with `ps aux | grep ts-node`
