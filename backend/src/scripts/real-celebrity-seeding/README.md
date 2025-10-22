# Real Celebrity Seeding System

Comprehensive celebrity database seeding system that fetches **real, living celebrities** from verified sources (Wikidata, TMDB, Spotify, YouTube) and populates the StarryMeet staging database with enriched profiles.

## 🎯 Overview

This system implements the complete workflow specified in `/docs/celeb_seedind.md`:

- **12,500+ real celebrities** from verified sources
- **Living people only** (filters out deceased individuals)
- **Physical-first meetings** with complete booking metadata
- **Multi-source enrichment**: Wikidata → TMDB → Spotify → YouTube → Cloudinary
- **Intelligent pricing** based on popularity metrics
- **Safety filters** for minors, heads of state, sanctioned individuals
- **Deduplication** via external ID matching and fuzzy matching
- **Comprehensive outputs**: CSVs, JSONL samples, summary reports

## 📋 Target Distribution

| Tier | Count | Price Range |
|------|-------|-------------|
| Exclusive (A+) | 500 | $100k+ |
| Elite (A) | 2,000 | $25k-$100k |
| High (B) | 3,000 | $4k-$25k |
| Mid (C) | 4,000 | $1k-$4k |
| Emerging (D) | 3,000 | $100-$1k |
| **Total** | **12,500** | |

## 🔧 Prerequisites

1. **Environment Variables** (add to `.env`):
```bash
# Database (STAGING ONLY!)
DATABASE_URL=postgresql://user:pass@host:port/database

# API Keys
TMDB_API_KEY=your_tmdb_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
YOUTUBE_API_KEY=your_youtube_key

# Cloudinary (already configured)
CLOUDINARY_CLOUD_NAME=dd0ou581d
CLOUDINARY_API_KEY=331969854289545
CLOUDINARY_API_SECRET=irAFHME5wEYftKj0aN849RaL3Hk
```

2. **PostgreSQL tools** (for backup):
```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client

# Windows
# Download from https://www.postgresql.org/download/windows/
```

3. **Node.js dependencies**:
```bash
cd backend
npm install
```

## 🚀 Usage

### Step 1: Backup & Preparation

**⚠️ WARNING: This will TRUNCATE all celebrity data from staging!**

```bash
cd backend
npm run seed:backup
```

This script will:
1. ✅ Backup staging database to `/tmp/starrymeet_seeding/backup_pre_wipe_staging_[timestamp].dump`
2. ✅ Export existing celebrities to `/tmp/starrymeet_seeding/celebrities_existing_staging.csv`
3. ⚠️ **TRUNCATE** all celebrity-related tables (with 5-second confirmation)
4. ✅ Verify clean slate (count = 0)

### Step 2: Main Seeding

```bash
npm run seed:celebrities
```

This script will:
1. 🌍 Fetch 12,500+ celebrities from Wikidata
2. 🔄 Enrich with TMDB, Spotify, YouTube
3. 📸 Upload images to Cloudinary
4. 💰 Calculate pricing and popularity scores
5. 🛡️ Apply safety filters
6. 🔍 Deduplicate candidates
7. 💾 Insert into staging database
8. 📊 Generate comprehensive reports

**Expected runtime**: 2-4 hours (depends on API rate limits)

### Step 3: Review Outputs

All outputs are saved to `/tmp/starrymeet_seeding/`:

```bash
ls -lh /tmp/starrymeet_seeding/

# Expected files:
# - backup_pre_wipe_staging_[timestamp].dump
# - celebrities_existing_staging.csv
# - imports_success.csv
# - imports_failed.csv
# - top_500_pending_price_review.csv
# - sample_profiles.jsonl
# - summary_report.json
# - truncation_log.txt
```

## 📊 Output Files

### 1. `imports_success.csv`
CSV of all successfully imported celebrities:
- slug, name, category, professional_class
- country, region, price, tier
- popularity_score, verification status
- external IDs (Wikidata, TMDB, Spotify, YouTube)

### 2. `imports_failed.csv`
CSV of failed imports with error messages:
- name, wikidata_qid, errors

### 3. `top_500_pending_price_review.csv`
Top 500 most expensive celebrities flagged for manual review:
- High-value profiles (>$25k) that need pricing verification

### 4. `sample_profiles.jsonl`
200 random full-profile samples in JSONL format:
- For quality assurance and testing
- Complete celebrity objects with all fields

### 5. `summary_report.json`
Comprehensive JSON report:
```json
{
  "timestamp": "2025-10-22T...",
  "totalProcessed": 12500,
  "totalImported": 12234,
  "totalFailed": 266,
  "tierDistribution": { "Exclusive": 489, "Elite": 1987, ... },
  "regionDistribution": { "North America": 7234, "Europe": 3021, ... },
  "priceStats": {
    "average": 8234.56,
    "median": 2500,
    "min": 100,
    "max": 250000,
    "top100Expensive": [...]
  },
  "apiStats": { "wikidataCalls": 12500, "tmdbCalls": 6234, ... },
  "processingTime": { "durationMinutes": 187.45 }
}
```

## 🛡️ Safety Filters

The system automatically excludes:

- ❌ **Minors** (age < 18)
- ❌ **Deceased individuals** (Wikidata P570 property)
- ❌ **Heads of state** (current presidents, prime ministers)
- ❌ **Sanctioned individuals** (OFAC lists)
- ❌ **Senior religious leaders** (pope, cardinals, etc.)
- ⚠️ **Controversial figures** (flagged for manual review)

## 🔄 Deduplication

The system prevents duplicates via:

1. **External ID matching** (definitive):
   - Same Wikidata QID → merge
   - Same IMDb ID → merge
   - Same TMDB ID → merge
   - Same Spotify ID → merge
   - Same YouTube Channel ID → merge

2. **Fuzzy matching** (threshold 0.88):
   - Name similarity + birth year + country
   - Levenshtein distance algorithm

3. **Merge candidates** (0.75-0.87 similarity):
   - Flagged for manual review
   - Written to `merge_candidates.csv`

## 💰 Pricing Algorithm

### Popularity Score Calculation (0-100)

```
score =
  (socialFollowers × 0.25) +
  (monthlyListeners × 0.20) +
  (monthlyViews × 0.15) +
  (boxOffice × 0.15) +
  (streamingViews × 0.10) +
  (awards × 0.05) +
  (googleTrends × 0.05) +
  (mediaMentions × 0.05)
```

All metrics normalized via log-scale to 0-100.

### Base Price Tiers

| Score | Tier | Base Price |
|-------|------|------------|
| 95+ | Exclusive | $100,000 |
| 90-94 | Ultra-Elite | $50,000 |
| 80-89 | Elite | $25,000 |
| 70-79 | A-Lister | $10,000 |
| 55-69 | B-Lister | $4,000 |
| 40-54 | C-Lister | $1,000 |
| 25-39 | Rising | $400 |
| 0-24 | Emerging | $100 |

### Price Modifiers

```
finalPrice = basePrice × rarity × demand × market × complexity
```

- **Rarity Factor** (1.0-2.0): Rare professions, multi-skilled
- **Demand Factor** (1.0-2.0): Active status, social engagement
- **Market Multiplier** (1.0-1.5): Geographic location
- **Meeting Complexity** (1.0-1.5): Security, NDA, travel requirements

All prices rounded to nearest $50.

## 📸 Image Management

### Cloudinary Configuration

- **Cloud name**: `dd0ou581d`
- **Upload limit**: 10 MB per image
- **Format**: WebP (best compression for web)

### Image Processing

1. **Hero Image**:
   - Max width: 1600px
   - Format: WebP
   - Quality: 75%
   - Path: `starrymeet/{region}/{slug}/hero.webp`

2. **Thumbnail**:
   - Max width: 400px
   - Format: WebP
   - Quality: 80%
   - Path: `starrymeet/{region}/{slug}/thumb.webp`

3. **Fallback**:
   - Generates neutral gradient placeholder if no image available
   - Deterministic colors based on celebrity name (MD5 hash)

## 🔧 Troubleshooting

### Rate Limits Exceeded

Each API service has built-in rate limiting:

- Wikidata: 5 req/s
- TMDB: 40 req/s
- Spotify: 10 req/s
- YouTube: 100 req/s
- MusicBrainz: 1 req/s

If you hit limits, the script will automatically retry with exponential backoff (max 3 retries).

### Database Connection Issues

Ensure you're connecting to **STAGING** database:

```bash
# Check environment
echo $NODE_ENV  # Should be "staging" or "development", NOT "production"

# Test connection
psql -h your-staging-host -U your-user -d your-staging-db
```

### Cloudinary Upload Failures

Check limits:
- Max 10 MB per image (free tier)
- Unlimited uploads per hour
- 500 Admin API requests per hour

Fallback: System generates placeholder gradients automatically.

## 🚨 Important Notes

1. **STAGING ONLY**: This script will NOT work in production (safety check prevents it)
2. **Manual QA Required**: Review all outputs before considering production deployment
3. **Top 500 Review**: High-value profiles (>$25k) require manual price verification
4. **No Hallucinations**: All data comes from verified sources (no invented names)
5. **Living People Only**: Deceased individuals are automatically filtered out
6. **30% Non-US**: System ensures ≥30% international profiles

## 📚 Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    01-backup-and-prep.ts                     │
│  Backup DB → Export CSV → Truncate Tables → Verify Clean    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    02-main-seeding.ts                        │
│                    (Main Orchestrator)                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
         ┌──────────────────────────────────────┐
         │   services/wikidata.service.ts       │
         │   Fetch living celebrities via       │
         │   SPARQL (FILTER NOT EXISTS P570)    │
         └──────────────────────────────────────┘
                              ↓
         ┌──────────────────────────────────────┐
         │   services/enrichment.service.ts     │
         │   Orchestrate multi-API enrichment   │
         └──────────────────────────────────────┘
              ↓          ↓          ↓         ↓
        ┌──────┐   ┌──────┐   ┌────────┐  ┌────────┐
        │ TMDB │   │Spotify│   │YouTube │  │Cloudinary│
        └──────┘   └──────┘   └────────┘  └────────┘
                              ↓
         ┌──────────────────────────────────────┐
         │   services/pricing.service.ts        │
         │   Calculate popularity & pricing     │
         └──────────────────────────────────────┘
                              ↓
         ┌──────────────────────────────────────┐
         │   services/safety.service.ts         │
         │   Apply legal & safety filters       │
         └──────────────────────────────────────┘
                              ↓
         ┌──────────────────────────────────────┐
         │   services/deduplication.service.ts  │
         │   Check duplicates & merge           │
         └──────────────────────────────────────┘
                              ↓
         ┌──────────────────────────────────────┐
         │   Database Import (Batch 250)        │
         │   Insert into celebrities table      │
         └──────────────────────────────────────┘
                              ↓
         ┌──────────────────────────────────────┐
         │   services/output.service.ts         │
         │   Generate CSVs, JSONL, Reports      │
         └──────────────────────────────────────┘
```

## 📝 License

Internal use only - StarryMeet Platform

---

**For questions or issues, contact the development team.**
