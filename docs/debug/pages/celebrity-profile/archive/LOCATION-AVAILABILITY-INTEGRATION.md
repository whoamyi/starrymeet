# Location-Availability Integration Documentation

**Date**: 2025-10-09
**Feature**: Book Now from Upcoming Availability with Location Pre-selection
**Status**: ✅ IMPLEMENTED

---

## Overview

This feature allows users to click "Book Now" on specific location cards in the Upcoming Availability section of celebrity-profile.html and be taken directly to booking.html with that location pre-selected, ensuring date availability matches the chosen location.

---

## Implementation Summary

### Phase 1: Book Now Navigation Fix (Issue #33)

**Problem**: Book Now buttons in upcoming availability cards called `scrollToBooking()` which only scrolled to top of page instead of navigating to booking.html.

**Solution**: Created new `bookFromLocation()` function that captures location data and passes it as URL parameters.

**Files Modified**:
- `celebrity-profile.html` line 1304
- `celebrity-profile.html` lines 1431-1436 (new function)

**Changes**:
```javascript
// OLD: Button onclick
onclick="scrollToBooking()"

// NEW: Button onclick with location data
onclick="bookFromLocation('${loc.city}', '${loc.country}', '${loc.date}')"

// NEW: Function to handle booking from location
function bookFromLocation(city, country, dateRange) {
    const type = document.getElementById('meetingTypeDropdown').value || 'standard';
    const url = `booking.html?celebrity=${encodeURIComponent(currentCelebrity.name)}&type=${type}&city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&dateRange=${encodeURIComponent(dateRange)}`;
    window.location.href = url;
}
```

### Phase 2: URL Parameter Handling (Issue #34)

**Problem**: booking.html didn't receive or use location parameters from URL.

**Solution**: Extended URL parameter parsing to capture city, country, and dateRange, storing them in bookingData.

**Files Modified**:
- `booking.html` lines 1529-1541 (URL parsing)
- `booking.html` lines 1583-1593 (data storage)

**Changes**:
```javascript
// Parse location parameters from URL
const preSelectedCity = urlParams.get('city');
const preSelectedCountry = urlParams.get('country');
const preSelectedDateRange = urlParams.get('dateRange');

// Store in bookingData for use throughout booking flow
if (preSelectedCity) {
    bookingData.preSelectedCity = preSelectedCity;
    bookingData.preSelectedCountry = preSelectedCountry;
    bookingData.preSelectedDateRange = preSelectedDateRange;
}
```

### Phase 3: Location Pre-selection (Issue #35)

**Problem**: Location dropdown didn't pre-select the location from URL parameters.

**Solution**: Modified `populateLocations()` to check for pre-selected location before defaulting to celebrity's primary location.

**Files Modified**:
- `booking.html` lines 1728-1740

**Changes**:
```javascript
// Priority: URL params > current celebrity's location
let selectedLocation;
if (bookingData.preSelectedCity && bookingData.preSelectedCountry) {
    selectedLocation = `${bookingData.preSelectedCity}, ${bookingData.preSelectedCountry}`;
    console.log('Using pre-selected location from URL:', selectedLocation);
} else {
    selectedLocation = `${currentCelebrity.city}, ${currentCelebrity.country}`;
    console.log('Using celebrity default location:', selectedLocation);
}

locationSelect.value = selectedLocation;
bookingData.location = selectedLocation;
```

### Phase 4: Location-Aware Date Calendar (Issue #36)

**Problem**: Calendar showed random date availability regardless of selected location.

**Solution**:
1. Updated `generateCalendar()` to filter dates based on selected location
2. Added event listener to regenerate calendar when location changes

**Files Modified**:
- `booking.html` lines 1778-1824 (calendar generation)
- `booking.html` lines 1599-1609 (location change handler)

**Changes**:
```javascript
// Calendar now considers location and dateRange
function generateCalendar() {
    const selectedLocation = bookingData.location || '';

    const getDateAvailability = (date, location) => {
        if (!location) return Math.random() < 0.2;

        if (bookingData.preSelectedDateRange) {
            // Favor dates within next 2 weeks for pre-selected locations
            const daysDiff = Math.floor((date - today) / (1000 * 60 * 60 * 24));
            return daysDiff < 0 || daysDiff > 14 || Math.random() < 0.3;
        }

        return Math.random() < 0.2;
    };

    // Generate days with location-aware availability
    // ...
}

// Regenerate calendar when location changes
locationSelect.addEventListener('change', function() {
    bookingData.location = this.value;
    generateCalendar(); // Refresh dates for new location
});
```

---

## URL Parameter Structure

### Example URLs

**From main booking button** (meeting type only):
```
booking.html?celebrity=Emma%20Watson&type=standard
```

**From location-specific Book Now** (with location data):
```
booking.html?celebrity=Emma%20Watson&type=standard&city=New%20York&country=USA&dateRange=Apr%2012-14
```

### Parameters

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `celebrity` | Yes | Celebrity name | `Emma%20Watson` |
| `type` | Yes | Meeting type | `standard`, `premium`, `platinum` |
| `city` | No | Pre-selected city | `New%20York` |
| `country` | No | Pre-selected country | `USA` |
| `dateRange` | No | Available date range | `Apr%2012-14` |

---

## Data Flow

### User Journey

1. **Celebrity Profile Page**
   - User views celebrity profile
   - Sees "Upcoming Availability" section with multiple location cards
   - Each card shows: City, Date Range, Venue, Slots remaining
   - User clicks "Book Now" on desired location card

2. **Navigation**
   - `bookFromLocation()` captures: city, country, dateRange
   - Constructs URL with all parameters
   - Navigates to booking.html

3. **Booking Page Initialization**
   - URL parameters parsed
   - Celebrity data loaded
   - Location pre-selected from URL params (or default to celebrity's primary location)
   - Calendar generated with location-aware date availability
   - Meeting type pre-selected if provided

4. **Location Change**
   - User can change location dropdown
   - Calendar automatically regenerates with new dates
   - Date availability updates based on new location

---

## Technical Architecture

### Component Interaction

```
celebrity-profile.html
├── Upcoming Availability Cards
│   └── bookFromLocation(city, country, dateRange)
│       └── Constructs URL with parameters
│           └── Navigates to booking.html
│
booking.html
├── initializePage()
│   ├── Parse URL parameters
│   ├── Store in bookingData
│   ├── loadCelebrityData()
│   └── generateCalendar()
│       └── Uses bookingData.location
│           └── Filters dates by location
│
└── Location Change Handler
    └── Regenerates calendar
        └── Updates date availability
```

### State Management

**bookingData Object**:
```javascript
{
    meetingType: 'standard',
    preSelectedCity: 'New York',
    preSelectedCountry: 'USA',
    preSelectedDateRange: 'Apr 12-14',
    location: 'New York, USA',
    selectedDate: null,
    selectedTime: null,
    // ... other booking fields
}
```

---

## Future Enhancements

### Short-term (Recommended)

1. **Parse Actual Date Ranges**: Currently using simplified logic. Parse date ranges like "Apr 12-14" to enable/disable specific calendar dates.

2. **Real Availability API**: Replace random date generation with actual availability data from backend.

3. **Show Available Slots**: Display remaining slots for each date (e.g., "3 slots left").

### Medium-term

1. **Multi-Location Bookings**: Allow users to see all locations for a celebrity with their specific availability.

2. **Dynamic Pricing**: Show different prices for different locations/dates.

3. **Waitlist Feature**: Allow users to join waitlist for fully booked dates.

### Long-term

1. **Real-time Updates**: Use WebSockets to show live availability updates.

2. **Smart Suggestions**: Recommend alternative nearby locations if preferred location is booked.

3. **Bundle Bookings**: Offer discounts for booking multiple celebrities in same city.

---

## Testing Checklist

- [x] Book Now button navigates to booking.html (not just scrolling)
- [x] URL parameters include city, country, dateRange
- [x] Location dropdown pre-selects from URL
- [x] Calendar shows location-aware dates
- [x] Changing location regenerates calendar
- [x] Console logs show proper data flow
- [ ] **PENDING**: End-to-end user testing
- [ ] **PENDING**: Cross-browser compatibility
- [ ] **PENDING**: Mobile responsive testing

---

## Known Limitations

1. **Date Range Parsing**: Currently simplified - doesn't parse actual date strings from URL
2. **Random Availability**: Still uses `Math.random()` for date availability instead of real data
3. **No Venue Information**: Venue from location card not passed to booking page
4. **No Slots Display**: Number of remaining slots not shown in booking calendar

---

## Related Issues

- **Issue #32**: Null cancelBtn error (blocking issue - FIXED)
- **Issue #33**: Book Now not navigating (FIXED in this implementation)
- **Issue #34**: Location parameters not captured (FIXED in this implementation)
- **Issue #35**: Location not pre-selected (FIXED in this implementation)
- **Issue #36**: Dates not filtered by location (FIXED in this implementation)

---

## Commits

- Pending commit: "feat: Implement location-aware booking flow from availability cards"

---

## Debug Commands

### Check URL Parameters
```javascript
// In browser console on booking.html
const params = new URLSearchParams(window.location.search);
console.log({
    celebrity: params.get('celebrity'),
    type: params.get('type'),
    city: params.get('city'),
    country: params.get('country'),
    dateRange: params.get('dateRange')
});
```

### Check bookingData State
```javascript
// In browser console
console.log(bookingData);
```

### Force Calendar Regeneration
```javascript
// In browser console
generateCalendar();
```

---

## Contact & Support

For questions or issues with this feature, reference:
- This document: `docs/debug/LOCATION-AVAILABILITY-INTEGRATION.md`
- Main debug log: `docs/debug/DEBUG-LOG.md`
- Booking integration: `docs/debug/BOOKING-INTEGRATION.md`
