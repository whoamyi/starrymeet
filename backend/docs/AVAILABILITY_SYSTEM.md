# Celebrity Availability System

## Overview

The Celebrity Availability System is a sophisticated, tier-based algorithm that automatically generates and manages availability slots for 7,600+ celebrities across the StarryMeet platform.

## Key Features

- **Tier-based slot allocation** (S, A, B, C, D tiers)
- **Home country exclusion** - celebrities never appear in their home country
- **City pool rotation** with 3-6 month cooldowns
- **Physical vs Virtual separation** with no time collisions
- **Randomized dates/times** within realistic business hours
- **Automatic expiration** and cleanup
- **Batch processing** to prevent database overload

## Architecture

### Database Tables

#### `availability`
Stores all availability slots for celebrities.

```sql
- id: Primary key
- celebrity_id: FK to celebrities
- meeting_type: 'virtual' or 'physical'
- duration: 15, 30, or 60 minutes
- city: Meeting city
- country: Meeting country
- date: Meeting date
- time: Meeting time
- timezone: City timezone
- slots_remaining: Booking capacity
- price_cents: Price in cents
- tier: Celebrity tier (S/A/B/C/D)
- status: active, booked, expired, cancelled
- rotation_id: Rotation cycle identifier
- expires_at: Expiration timestamp
```

#### `city_cooldown`
Tracks which cities are in cooldown for each celebrity.

```sql
- id: Primary key
- celebrity_id: FK to celebrities
- city: City name
- country: Country name
- cooldown_start: Start date
- cooldown_end: End date (3-6 months)
```

## Tier Configuration

| Tier | Virtual Slots/Month | Physical Slots/Month | Description |
|------|--------------------|--------------------|-------------|
| **S** | 1-3 | 0-1 | Ultra exclusive ($500k+) |
| **A** | 3-7 | 1-2 | High tier ($100k-$500k) |
| **B** | 6-12 | 1-3 | Notable ($20k-$100k) |
| **C** | 10-18 | 2-4 | Popular ($5k-$20k) |
| **D** | 15-25 | 3-6 | Accessible (<$5k) |

## Duration Distribution

- **15 min**: 45% (Quick meetings)
- **30 min**: 40% (Standard meetings)
- **60 min**: 15% (Premium meetings)

## Rotation Configuration

### Physical Meetings
- **Days per rotation**: 7-14 days out
- **Hours**: 10am - 9pm
- **Cities per rotation**: 1-3 cities

### Virtual Meetings
- **Days per rotation**: 3-7 days out
- **Hours**: 6am - 11pm
- **Cities per rotation**: 1-3 cities

## City Pool

- **Total cities**: 60+ global destinations
- **Countries excluded**: Celebrity's home country
- **Cooldown**: 3-6 months after use
- **Regions covered**:
  - North America (9 cities)
  - Europe (20 cities)
  - Asia-Pacific (13 cities)
  - Middle East (3 cities)
  - Latin America (6 cities)
  - Africa (4 cities)

## Usage

### Generate Availability

```bash
npm run availability:generate
```

This runs the batch generation process:
1. Processes celebrities by tier (S → A → B → C → D)
2. Generates physical slots first, then virtual
3. Respects tier caps and cooldowns
4. Prevents time collisions
5. Applies exclusivity (unassigned probability)

### Cleanup Expired Slots

```bash
npm run availability:cleanup
```

Automated cleanup:
- Expires past slots
- Removes expired cooldowns
- Archives old data (30+ days)

### Cron Job Setup

For automated daily cleanup:

```bash
# Add to crontab
0 2 * * * cd /path/to/backend && npm run availability:cleanup
```

For weekly availability generation:

```bash
# Run every Monday at 3am
0 3 * * 1 cd /path/to/backend && npm run availability:generate
```

## Algorithm Flow

1. **Tier Selection**: Process S-tier first (most exclusive)
2. **Celebrity Loop**: For each celebrity in tier
3. **Slot Calculation**: Determine slots based on tier config
4. **Exclusivity**: Apply unassigned probability
5. **City Selection**: Choose 1-3 cities from available pool
6. **Slot Generation**: For each slot:
   - Select random duration (weighted)
   - Select random date (within rotation window)
   - Select random time (within business hours)
   - Check for collisions
   - Calculate price based on duration + meeting type
   - Generate expiration date
7. **Database Insert**: Batch insert all slots
8. **Cooldown**: Mark used cities for 3-6 month cooldown

## Sustainability Features

- **Batch processing**: 50 celebrities per batch with 1s delay
- **Collision prevention**: Checks existing slots before insertion
- **Cooldown rotation**: Cities cycle to maintain freshness
- **Automatic expiration**: Old slots auto-expire
- **Database optimization**: Indexes on frequently queried fields
- **Archive system**: Old data moved to keep tables performant

## Pricing

Prices are pulled from celebrity's pre-set pricing tiers:

### Virtual Meetings
- Quick (15min): `virtual_quick_meet_price_cents`
- Standard (30min): `virtual_standard_meet_price_cents`
- Premium (60min): `virtual_premium_meet_price_cents`

### Physical Meetings
- Quick (15min): `quick_meet_price_cents`
- Standard (30min): `standard_meet_price_cents`
- Premium (60min): `premium_meet_price_cents`

## Example Output

```
✅ AVAILABILITY GENERATION COMPLETE!
======================================================================
⏱️  Duration: 245.3 seconds
👥 Celebrities processed: 7612
📅 Total slots generated: 45,824
⏭️  Slots skipped (exclusivity): 12,456

📊 Breakdown by tier:
  Tier S: 17 celebrities, 38 slots
  Tier A: 58 celebrities, 312 slots
  Tier B: 1104 celebrities, 8,832 slots
  Tier C: 1340 celebrities, 16,080 slots
  Tier D: 5093 celebrities, 20,562 slots
```

## API Integration

The availability system integrates with the booking API:

```typescript
// Get available slots for a celebrity
GET /api/celebrities/:id/availability
  ?meeting_type=physical
  &start_date=2025-10-25
  &end_date=2025-11-01

// Response
{
  "slots": [
    {
      "id": 123,
      "date": "2025-10-27",
      "time": "14:30:00",
      "duration": 30,
      "city": "Paris",
      "country": "France",
      "timezone": "Europe/Paris",
      "price": 12500,
      "slots_remaining": 1
    }
  ]
}
```

## Monitoring

Check system statistics:

```bash
npm run availability:cleanup
```

Output includes:
- Active slots count
- Expired slots count
- Booked slots count
- Active cooldowns count

## Troubleshooting

**No slots generated for a celebrity?**
- Check tier assignment (may be too high/low for pricing)
- Verify home country is set correctly
- Check if all cities are in cooldown

**Time collisions occurring?**
- Collision detection runs automatically
- Slots are skipped if collision detected
- Check database for duplicate entries

**Performance issues?**
- Increase batch delay in config (default: 1000ms)
- Reduce batch size (default: 50)
- Archive old expired slots more frequently

## Configuration

All configuration in `/src/services/availability/config.ts`:

- `TIER_CONFIG`: Tier slot caps
- `DURATION_WEIGHTS`: Duration distribution
- `ROTATION_CONFIG`: Time windows
- `COOLDOWN_CONFIG`: Cooldown duration
- `GLOBAL_CITY_POOL`: Available cities
- `UNASSIGNED_PROBABILITY`: Exclusivity factor
- `BATCH_CONFIG`: Processing parameters
