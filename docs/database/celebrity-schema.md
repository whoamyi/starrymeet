# Celebrity Database Schema

Complete data structure for celebrity profiles in the StarryMeet database.

---

## Primary Table: `celebrities_new`

The main celebrity profile table containing core identity and business information.

| Column Name        | Data Type            | Nullable | Default                    | Description                                      |
|--------------------|----------------------|----------|----------------------------|--------------------------------------------------|
| `id`               | UUID                 | NO       | -                          | Primary key, unique identifier                   |
| `name`             | VARCHAR(255)         | NO       | -                          | Full name of the celebrity                       |
| `slug`             | VARCHAR(255)         | NO       | -                          | URL-friendly slug (e.g., "tom-cruise")           |
| `category_id`      | INTEGER              | YES      | NULL                       | Foreign key to categories table                  |
| `country`          | VARCHAR(100)         | YES      | NULL                       | Home country                                     |
| `bio`              | TEXT                 | YES      | NULL                       | Biography/description                            |
| `verified`         | BOOLEAN              | NO       | false                      | Verified celebrity status                        |
| `avatar_url`       | VARCHAR(500)         | YES      | NULL                       | Profile picture URL (Cloudinary)                 |
| `min_price`        | NUMERIC              | YES      | NULL                       | Minimum meeting price in dollars                 |
| `review_rate`      | NUMERIC              | YES      | NULL                       | Average review rating (0-5)                      |
| `review_count`     | INTEGER              | NO       | 0                          | Total number of reviews                          |
| `status`           | ENUM                 | NO       | 'active'                   | Status: active, paused, hidden                   |
| `social_followers` | BIGINT               | YES      | 0                          | Total social media followers                     |
| `monthly_listeners`| BIGINT               | YES      | 0                          | Monthly listeners (for musicians)                |
| `created_at`       | TIMESTAMPTZ          | NO       | NOW()                      | Record creation timestamp                        |
| `updated_at`       | TIMESTAMPTZ          | NO       | NOW()                      | Last update timestamp                            |

**Total Fields:** 16

---

## Related Table: `celebrity_settings`

Platform-specific settings and tier classification for each celebrity.

| Column Name             | Data Type    | Description                                          |
|-------------------------|--------------|------------------------------------------------------|
| `id`                    | INTEGER      | Primary key (auto-increment)                         |
| `celebrity_id`          | UUID         | Foreign key to celebrities_new.id                    |
| `tier`                  | ENUM         | Celebrity tier: S, A, B, C, D (fame-based)           |
| `max_monthly_slots`     | INTEGER      | Maximum meeting slots per month                      |
| `slot_scarcity_mode`    | ENUM         | Scarcity strategy for slot generation                |
| `timezone`              | VARCHAR      | Celebrity's timezone                                 |
| `allow_virtual`         | BOOLEAN      | Allow virtual meetings                               |
| `allow_physical`        | BOOLEAN      | Allow in-person meetings                             |
| `rotation_cooldown_days`| INTEGER      | Days before repeating city in rotation               |
| `created_at`            | TIMESTAMPTZ  | Record creation timestamp                            |
| `updated_at`            | TIMESTAMPTZ  | Last update timestamp                                |

**Total Fields:** 11

---

## Related Table: `celebrity_pricing`

Detailed pricing packages for different meeting types and durations.

| Column Name   | Data Type    | Description                                      |
|---------------|--------------|--------------------------------------------------|
| `id`          | INTEGER      | Primary key (auto-increment)                     |
| `celebrity_id`| UUID         | Foreign key to celebrities_new.id                |
| `meeting_type`| ENUM         | Type: 'virtual' or 'physical'                    |
| `duration`    | INTEGER      | Meeting duration in minutes (15, 30, 60)        |
| `price_cents` | INTEGER      | Price in cents                                   |
| `currency`    | VARCHAR      | Currency code (e.g., 'USD')                      |
| `is_active`   | BOOLEAN      | Whether this pricing is currently active         |
| `created_at`  | TIMESTAMPTZ  | Record creation timestamp                        |
| `updated_at`  | TIMESTAMPTZ  | Last update timestamp                            |

**Total Fields:** 9

---

## Related Table: `categories`

Celebrity profession/category classification.

| Column Name | Data Type    | Description                                      |
|-------------|--------------|--------------------------------------------------|
| `id`        | INTEGER      | Primary key (auto-increment)                     |
| `name`      | VARCHAR      | Category name (e.g., "Actor", "Singer")          |
| `slug`      | VARCHAR      | URL-friendly slug                                |
| `created_at`| TIMESTAMPTZ  | Record creation timestamp                        |
| `updated_at`| TIMESTAMPTZ  | Last update timestamp                            |

**Total Fields:** 5

---

## Complete Celebrity Profile Data Points

When querying a full celebrity profile (joining all tables), you have access to:

### **Identity & Basic Info** (6 fields)
- `id` - Unique identifier
- `name` - Full name
- `slug` - URL slug
- `country` - Home country
- `bio` - Biography
- `avatar_url` - Profile picture

### **Classification** (3 fields)
- `category_id` / `category` - Profession (Actor, Singer, etc.)
- `tier` - Fame level (S, A, B, C, D)
- `verified` - Verification status

### **Business/Stats** (6 fields)
- `min_price` - Starting price in dollars
- `review_rate` - Average rating
- `review_count` - Number of reviews
- `social_followers` - Social media following
- `monthly_listeners` - Music streaming stats
- `status` - Active/Paused/Hidden

### **Meeting Configuration** (7 fields)
- `allow_virtual` - Virtual meetings enabled
- `allow_physical` - In-person meetings enabled
- `max_monthly_slots` - Monthly availability cap
- `slot_scarcity_mode` - Availability strategy
- `timezone` - Operating timezone
- `rotation_cooldown_days` - City rotation settings
- Pricing packages (from `celebrity_pricing` table)

### **System Fields** (4 fields)
- `created_at` - Record creation
- `updated_at` - Last modification
- Status tracking
- Relationship IDs

---

## Total Data Points: **41+ fields**

**Core Profile:** 16 fields (celebrities_new)
**Settings:** 11 fields (celebrity_settings)
**Pricing:** 9 fields × N packages (celebrity_pricing)
**Category:** 5 fields (categories)

---

## Enum Types

### `enum_celebrities_new_status`
- `active` - Publicly visible
- `paused` - Temporarily unavailable
- `hidden` - Not shown (invalid/test data)

### `tier` (Celebrity Tier)
- `S` - Superstar ($500K+ standard meet)
- `A` - A-list ($100K-$500K)
- `B` - B-list ($20K-$100K)
- `C` - C-list ($5K-$20K)
- `D` - D-list (< $5K)

### `meeting_type`
- `virtual` - Online video meetings
- `physical` - In-person meetings

---

## Key Relationships

```
celebrities_new (1)
    ├─→ (N) celebrity_settings
    ├─→ (N) celebrity_pricing
    ├─→ (1) categories
    ├─→ (N) availability (slots)
    ├─→ (N) bookings
    └─→ (N) reviews
```

---

## Example Full Profile Query

```sql
SELECT
  -- Core identity
  c.id, c.name, c.slug, c.bio, c.avatar_url, c.country,

  -- Classification
  cat.name as category, c.verified, cs.tier,

  -- Stats
  c.min_price, c.review_rate, c.review_count,
  c.social_followers, c.monthly_listeners,

  -- Settings
  cs.allow_virtual, cs.allow_physical,
  cs.max_monthly_slots, cs.timezone,

  -- Status
  c.status, c.created_at, c.updated_at

FROM celebrities_new c
LEFT JOIN categories cat ON c.category_id = cat.id
LEFT JOIN celebrity_settings cs ON c.id = cs.celebrity_id
WHERE c.slug = 'tom-cruise'
  AND c.status = 'active';
```

This gives you the complete celebrity profile with all available data points.
