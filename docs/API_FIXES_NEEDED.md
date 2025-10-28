# API Fixes Needed

## 1. Browse Cards - Show Availability Location Instead of Personal Location

**Issue**: Cards currently show celebrity's personal location (country) instead of where they have available slots.

**Current Behavior**:
- Card shows `celeb.location` or `celeb.country` (e.g., "South Korea" for BTS members)

**Expected Behavior**:
- Card should show the location where the celebrity has available slots (e.g., "Paris", "Virtual")

**SQL Query Fix**:
```sql
SELECT
    c.id,
    c.name,
    c.slug,
    c.country as personal_location,
    (
        SELECT a.city
        FROM availability a
        WHERE a.celebrity_id = c.id
        AND a.status = 'active'
        AND a.slots_remaining > 0
        ORDER BY a.date
        LIMIT 1
    ) as slot_location,
    (
        SELECT SUM(a.slots_remaining)
        FROM availability a
        WHERE a.celebrity_id = c.id
        AND a.status = 'active'
    ) as total_slots
FROM celebrities_new c
WHERE c.status = 'active';
```

**API Endpoint to Update**:
- `/api/celebrities` (or wherever browse page fetches celebrity list)

**Frontend Expects**:
- `celeb.slot_location` - First available slot location
- `celeb.total_slots` - Sum of all available slots across all meetings

**Card Display**:
```javascript
const location = celeb.slot_location || 'No availability';
const availableTickets = celeb.total_slots || 0;
```

---

## 2. Cards Not Loading Slots Count

**Issue**: Cards show "🎟️ 0" because API doesn't return slot data.

**Fix**: Include `total_slots` in API response as shown in query above.

---

## Implementation Priority

1. **HIGH**: Add `slot_location` and `total_slots` to celebrity list API
2. **MEDIUM**: Update browse.html to use `celeb.slot_location` instead of `celeb.location`
3. **LOW**: Add caching for slot counts to improve performance

---

## Test Query Results

Example output:
```
name                      | personal_location | slot_location | total_slots
--------------------------|-------------------|---------------|-------------
Zendaya                   | United States     | Monaco        | 6
Lisa (Lalisa Manobal)     | South Korea       | Virtual       | 3
Bad Bunny                 | Puerto Rico       | Virtual       | 7
```
