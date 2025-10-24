# StarryMeet Classification System Architecture

## Overview
Complete celebrity classification, pricing, and availability system following docs/class_agent.txt specifications.

## System Components

### 1. Classification Agent (`src/scripts/classification-agent.ts`)
**Purpose**: Classify celebrities and generate tier-based pricing
**Inputs**: Celebrity database records
**Outputs**: Updated celebrities with tier, category, bio, images, pricing, settings

**Operations**:
1. Fetch Wikipedia/TMDB/Spotify data
2. Assign tier (S/A/B/C/D) using comparison logic (NOT follower counts)
3. Assign category/profession
4. Generate bio
5. Upload images to Cloudinary
6. **Generate tier-based pricing** (6 packages: 3 durations × 2 types)
7. **Update celebrity settings** (verified, max_monthly_slots)
8. **Fix NULL countries** (default: "United States")

### 2. Availability Generator (`src/services/availability/generator.service.ts`)
**Purpose**: Generate availability slots with rotation and cooldown
**Inputs**: Classified celebrities with tiers
**Outputs**: Availability slots in database

**Operations**:
1. Build city/country pools (exclude home country)
2. Generate rotation cycles per tier
3. Assign slots with scarcity
4. Implement cooldown management
5. Randomize dates/times
6. Ensure physical/virtual separation

## Tier-Based Pricing Configuration

### Understanding the Price Ranges

**IMPORTANT**: The price ranges below represent the TOTAL allowed price window for BOTH physical and virtual meetings.

**Pricing Logic**:
1. Physical meetings are MORE expensive (base/higher price)
2. Virtual meetings are 20-40% LESS than physical
3. When setting prices:
   - Option A: Pick physical price in range → virtual = physical × (0.6 to 0.8)
   - Option B: Pick virtual price in range → physical = virtual / (0.6 to 0.8)

**Example** (S-tier, 60min):
- Physical = $1M → Virtual = $600K to $800K (20-40% less)
- OR Virtual = $500K → Physical = $625K to $833K (inverse calculation)

### Price Ranges by Tier

| Tier | Total Price Range (Physical & Virtual) | Typical Net Worth |
|------|----------------------------------------|-------------------|
| S    | $100K–$2M                             | $200M+            |
| A    | $20K–$500K                            | $30M–$200M        |
| B    | $5K–$50K                              | $5M–$30M          |
| C    | $1K–$10K                              | $1M–$5M           |
| D    | $100–$2K                              | < $1M             |

### Duration Multipliers

Duration multipliers apply to the BASE price (15min = 1.0x):
- **15min**: 1.0x (base price)
- **30min**: 1.8x
- **60min**: 3.0x

### Pricing Calculation Example

**S-Tier Celebrity Example**:
1. Pick base 15min physical price: $200K (within $100K-$2M range)
2. Calculate physical prices:
   - 15min physical: $200K × 1.0 = $200K
   - 30min physical: $200K × 1.8 = $360K
   - 60min physical: $200K × 3.0 = $600K
3. Calculate virtual prices (30% discount):
   - 15min virtual: $200K × 0.7 = $140K
   - 30min virtual: $360K × 0.7 = $252K
   - 60min virtual: $600K × 0.7 = $420K

**All 6 prices stay within $100K-$2M range** ✅

### Net Worth Validation Rule

From docs/class_agent.txt:
- Meeting price must not exceed **1% of estimated net worth**
- If price violates realism → lower to believable tier
- Fame overrides raw money in rare cases (cultural icons)

## Availability Slots Configuration

### Slots per Month (from docs/class_agent.txt Section 4)

| Tier | Physical Slots/Month | Virtual Slots/Month | Rotation Cycle |
|------|---------------------|---------------------|----------------|
| S    | 0-1                 | 1-2                 | 8-12 weeks     |
| A    | 1-2                 | 1-4                 | 6-8 weeks      |
| B    | 1-3                 | 2-6                 | 4-6 weeks      |
| C    | 1-4                 | 3-8                 | 3-5 weeks      |
| D    | 1-5                 | 5-10                | 2-4 weeks      |

### Max Monthly Slots (for celebrity_settings)

| Tier | Max Monthly Slots |
|------|------------------|
| S    | 2-4              |
| A    | 4-8              |
| B    | 8-15             |
| C    | 15-25            |
| D    | 20-40            |

### Slot Duration Weights

From docs/class_agent.txt Section 2:
- **15min**: 45% of slots
- **30min**: 40% of slots
- **60min**: 15% of slots

## Database Schema

### celebrity_pricing
```sql
CREATE TABLE celebrity_pricing (
  id SERIAL PRIMARY KEY,
  celebrity_id UUID REFERENCES celebrities_new(id),
  meeting_type VARCHAR(20), -- 'virtual' or 'physical'
  duration INT, -- 15, 30, or 60 minutes
  price_cents BIGINT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(celebrity_id, meeting_type, duration)
);
```

### celebrity_settings
```sql
CREATE TABLE celebrity_settings (
  celebrity_id UUID PRIMARY KEY,
  tier VARCHAR(1), -- S, A, B, C, D
  max_monthly_slots INT,
  allow_virtual BOOLEAN,
  allow_physical BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### availability (for future availability generator)
```sql
CREATE TABLE availability (
  id SERIAL PRIMARY KEY,
  celebrity_id UUID,
  meeting_type VARCHAR(20),
  duration INT,
  city VARCHAR(255),
  country VARCHAR(255),
  date DATE,
  time TIME,
  timezone VARCHAR(50),
  slots_remaining INT,
  price_cents BIGINT,
  tier VARCHAR(10),
  status VARCHAR(20) DEFAULT 'active',
  UNIQUE(celebrity_id, city, date, meeting_type)
);
```

### cooldown (for future availability generator)
```sql
CREATE TABLE cooldown (
  celebrity_id UUID,
  city VARCHAR(255),
  country VARCHAR(255),
  cooldown_end DATE,
  PRIMARY KEY(celebrity_id, city)
);
```

## Implementation Plan

### Phase 1: Enhanced Classification Agent ✅
1. Keep existing classification logic (tier, category, bio, images)
2. Add tier-based pricing generation:
   - Delete old pricing
   - Pick base price within tier range
   - Calculate 3 durations for physical (15/30/60min)
   - Calculate 3 durations for virtual (20-40% less)
   - Ensure all 6 prices within tier range
3. Update celebrity settings:
   - Set verified = true
   - Set max_monthly_slots based on tier
   - Keep allow_virtual = true, allow_physical = true
4. Fix NULL countries (default: "United States")

### Phase 2: Availability Generator (Separate Service)
1. City/country pool builder (exclude home country, 36-72 cities)
2. Rotation cycle manager (tier-based cycles)
3. Slot generator with randomization
4. Cooldown tracker (3-6 months per city)
5. Batch processing by tier
6. Physical/virtual collision prevention

## Usage

### Run Classification
```bash
# Classify all celebrities
npm run classify:celebrities

# Classify only new celebrities (date filter)
npm run classify:new-only

# Classify specific sample
SAMPLE_SIZE=100 npm run classify:celebrities
```

### Run Availability Generation (Phase 2)
```bash
# Generate availability for all celebrities
npm run availability:generate

# Generate for specific tier
TIER=S npm run availability:generate

# Cleanup expired slots
npm run availability:cleanup
```

## Key Rules (from docs/class_agent.txt)

### Fame Classification Rules
1. **Use comparison, NOT follower counts**
2. Compare to known celebrities:
   - "Comparable to Beyoncé or Messi" → S Tier
   - "Comparable to 50 Cent, Jason Statham" → A Tier
   - "Comparable to Idris Elba, Wiz Khalifa" → B Tier
   - "National TV star" → C Tier
   - "Local musician/influencer" → D Tier
3. **If uncertain, assign higher tier** and mark for review

### Pricing Rules
1. **Physical meetings 20-40% MORE expensive than virtual**
2. Price must be within tier's total range ($100K-$2M for S-tier)
3. Never exceed 1% of celebrity's estimated net worth
4. Duration multipliers: 15min (1.0x), 30min (1.8x), 60min (3.0x)

### Availability Rules
1. **Home-country avoidance**: Never available in celebrity's home country
2. **Scarcity**: Higher tiers = fewer slots
3. **Rotation**: Cities rotate with 3-6 month cooldown
4. **Collision prevention**: Physical and virtual never overlap per celebrity
5. **Randomization**: Unassigned probability maintains exclusivity

### Validation Rules
1. **Never downgrade legacy names below Tier B**
2. **Never assign Tier D to any figure with global awards**
3. **Always justify tier** with short reason
4. **Do not use followers/streams as fame evidence**

## Files Modified/Created

### Phase 1 (Pricing + Settings)
1. ✅ `src/scripts/classification-agent.ts` - Enhanced with pricing + settings
2. ✅ `docs/backend/classification_system_architecture.md` - This file

### Phase 2 (Availability - Separate Implementation)
3. 🔄 `src/services/availability/generator.service.ts` - NEW
4. 🔄 `src/services/availability/cleanup.service.ts` - NEW
5. 🔄 `src/scripts/availability/generate-availability.ts` - NEW

## Complete Workflow

```
1. Seed celebrities → Insert to database
2. Run classification agent → Assign tier, category, bio, images, pricing, settings
3. Run availability generator → Create rotation slots with cooldown
4. Frontend displays → Available celebrities with pricing and slot booking
```

## Pricing Implementation Details

### Algorithm for 6-Package Pricing

```typescript
// 1. Determine tier range
const tierRange = TIER_PRICE_RANGES[tier]; // e.g., { min: 10000000, max: 200000000 } for S

// 2. Pick base physical price for 15min (random within range)
const basePhysical15min = randomInRange(tierRange.min, tierRange.max);

// 3. Calculate physical prices for all durations
const physical15 = basePhysical15min;
const physical30 = Math.floor(basePhysical15min * 1.8);
const physical60 = Math.floor(basePhysical15min * 3.0);

// 4. Calculate virtual prices (20-40% discount, random)
const virtualDiscount = randomInRange(0.6, 0.8); // 20-40% discount
const virtual15 = Math.floor(physical15 * virtualDiscount);
const virtual30 = Math.floor(physical30 * virtualDiscount);
const virtual60 = Math.floor(physical60 * virtualDiscount);

// 5. Validate all 6 prices are within tier range
// If any price exceeds max, scale down proportionally
```

### Price Range Constants (in cents)

```typescript
const TIER_PRICE_RANGES = {
  S: { min: 10000000,  max: 200000000 },  // $100K - $2M
  A: { min: 2000000,   max: 50000000 },   // $20K - $500K
  B: { min: 500000,    max: 5000000 },    // $5K - $50K
  C: { min: 100000,    max: 1000000 },    // $1K - $10K
  D: { min: 10000,     max: 200000 }      // $100 - $2K
};
```
