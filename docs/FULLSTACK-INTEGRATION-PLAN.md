# Full-Stack Integration Plan - StarryMeet MVP

**Date**: 2025-10-17
**Goal**: Transform frontend demo into fully functional MVP using localStorage
**Scope**: End-to-end user journey with real data flow (excluding Stripe)

---

## Current State Analysis

### Data Issues
1. **Homepage**: Hardcoded celebrity data (different from CELEBRITIES array)
2. **Browse**: Static cards, no real filtering/search
3. **Celebrity Profile**: Static data, no dynamic loading
4. **Booking**: No data persistence between steps
5. **Dashboard**: Mock data, not connected to real bookings
6. **Auth**: Creates session but doesn't persist user data properly

### Integration Points Needed
```
User Flow:
1. Homepage → Browse (search/filter)
2. Browse → Celebrity Profile (pass celebrity data)
3. Celebrity Profile → Booking (maintain celebrity context)
4. Booking → Payment → Dashboard (save booking)
5. Auth → User Session → Dashboard (load user data)
```

---

## Implementation Strategy

### Phase 1: Centralized Data Management
**File**: `js/shared.js`

Add to existing system:
```javascript
// Enhanced LocalStorage Data Structure
{
  users: [
    {
      id: 'user_123',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed', // For demo, plain text OK
      createdAt: '2025-10-17',
      avatar: 'url or null'
    }
  ],
  bookings: [
    {
      id: 'booking_456',
      userId: 'user_123',
      celebrityName: 'Emma Watson',
      date: '2025-03-15',
      time: '14:00',
      location: 'London',
      meetingType: 'Private Meet & Greet',
      duration: '30 minutes',
      price: 5000,
      status: 'pending|approved|completed',
      applicationData: {
        occupation: '...',
        hometown: '...',
        whyMeet: '...',
        topics: '...'
      },
      createdAt: '2025-10-17'
    }
  ],
  favorites: [
    { userId: 'user_123', celebrityName: 'Emma Watson' }
  ],
  currentSession: {
    userId: 'user_123',
    isAuthenticated: true
  }
}
```

### Phase 2: Homepage Integration
**File**: `index.html`

Changes:
- Remove hardcoded celebrities array
- Use `CELEBRITIES` from shared.js
- Populate carousels with real data
- Make search redirect to browse.html with query param

### Phase 3: Browse Page Integration
**File**: `browse.html`

Changes:
- Load all celebrities from `CELEBRITIES` array
- Implement real category filtering
- Implement real search functionality
- Handle URL parameters (?category=Hollywood&search=emma)
- Dynamic card generation with real data

### Phase 4: Celebrity Profile Integration
**File**: `celebrity-profile.html`

Changes:
- Get celebrity name from URL parameter
- Load celebrity data from `CELEBRITIES` array
- Generate dynamic testimonials using existing function
- Update all pricing/booking buttons with real data
- Handle celebrity not found (404)

### Phase 5: Booking Flow Integration
**File**: `booking.html`

Changes:
- Receive celebrity data via URL params or localStorage
- Maintain celebrity context through all 5 steps
- Save application data to localStorage
- Create booking record on completion
- Redirect to dashboard with success message

### Phase 6: Authentication Integration
**Files**: `js/auth.js`, `js/shared.js`

Changes:
- Create user record in localStorage on signup
- Validate credentials on login
- Set session data properly
- Protect dashboard route
- Implement proper logout

### Phase 7: Dashboard Integration
**File**: `dashboard.html`

Changes:
- Load real user data from localStorage
- Display real bookings (pending/approved/completed)
- Show real favorites from localStorage
- Settings tab updates real user data
- Messages show placeholder for booked celebrities

---

## Data Flow Diagrams

### User Journey 1: New User Booking
```
Homepage
  ↓ (search "Emma Watson")
Browse Page (filtered)
  ↓ (click celebrity card)
Celebrity Profile (Emma Watson data loaded)
  ↓ (click "Request to book")
Auth Modal (if not logged in)
  ↓ (signup/login)
Booking Flow
  - Step 1: Select date/time/location (Emma Watson context)
  - Step 2: Confirm details (Emma Watson pricing)
  - Step 3: Application form
  - Step 4: Review (all Emma Watson data)
  - Step 5: Success
  ↓ (save booking to localStorage)
Dashboard
  ↓ (show Emma Watson in "My Bookings" - Pending)
```

### User Journey 2: Returning User
```
Homepage (logged in)
  ↓ (already authenticated)
Browse Page
  ↓ (add to favorites)
localStorage.favorites updated
  ↓
Dashboard
  ↓ (show in "My Favorites")
```

---

## Implementation Order

### Priority 1 (Core MVP)
1. ✅ Centralized data management (shared.js)
2. ✅ Celebrity profile dynamic loading
3. ✅ Booking flow data persistence
4. ✅ Auth system create real users
5. ✅ Dashboard show real bookings

### Priority 2 (Search/Filter)
6. ✅ Browse page filtering
7. ✅ Browse page search
8. ✅ Homepage search integration

### Priority 3 (Polish)
9. ✅ Favorites system
10. ✅ Form validation improvements
11. ✅ Error handling
12. ✅ Loading states

---

## Testing Checklist

### End-to-End Tests
- [ ] New user can signup
- [ ] User can search for celebrity
- [ ] User can view celebrity profile
- [ ] User can complete booking flow
- [ ] Booking appears in dashboard
- [ ] User can logout and login again
- [ ] Previous booking persists after login
- [ ] User can add to favorites
- [ ] Favorites persist across sessions
- [ ] Category filtering works
- [ ] Search filtering works
- [ ] User can update profile settings

---

## Key Functions to Create

### In shared.js
```javascript
// User Management
function createUser(userData)
function loginUser(email, password)
function logoutUser()
function getCurrentUser()
function updateUserProfile(userId, updates)

// Booking Management
function createBooking(bookingData)
function getBookings(userId, status)
function updateBookingStatus(bookingId, status)

// Favorites Management
function addToFavorites(userId, celebrityName)
function removeFromFavorites(userId, celebrityName)
function getFavorites(userId)
function isFavorite(userId, celebrityName)

// Session Management
function setSession(userId)
function getSession()
function clearSession()
function requireAuth() // Redirect to login if not authenticated
```

---

## localStorage Keys

```
starrymeet_users              - Array of user objects
starrymeet_bookings           - Array of booking objects
starrymeet_favorites          - Array of favorite objects
starrymeet_session            - Current session object
starrymeet_currentBooking     - Booking in progress (temp)
```

---

## Next Steps

1. Implement centralized data functions in shared.js
2. Update celebrity-profile.html to load dynamic data
3. Update booking.html to save data
4. Update auth.js to create real users
5. Update dashboard.html to show real data
6. Update browse.html for filtering/search
7. Update index.html to use CELEBRITIES array
8. Test complete user journey
9. Commit and deploy

---

## Success Criteria

✅ User can complete full booking without data loss
✅ Data persists across page refreshes
✅ Search and filters work with real data
✅ Dashboard shows accurate user data
✅ All celebrity data comes from CELEBRITIES array
✅ No hardcoded demo data remains
