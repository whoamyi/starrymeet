# Celebrity Seeding Quick Start

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install:
- `axios` - HTTP client for API calls
- `cloudinary` - Image upload and management

### 2. Configure Environment Variables

Add to `backend/.env`:

```bash
# ============================================
# STAGING DATABASE (REQUIRED)
# ============================================
NODE_ENV=staging
DATABASE_URL=postgresql://user:password@host:port/database

# OR individual connection params:
DB_HOST=your-staging-host.com
DB_PORT=5432
DB_NAME=starrymeet_staging
DB_USER=postgres
DB_PASSWORD=your_password

# ============================================
# API KEYS (REQUIRED)
# ============================================

# TMDB (The Movie Database) - FREE
# Get your key at: https://www.themoviedb.org/settings/api
TMDB_API_KEY=your_tmdb_api_key_here

# Spotify - FREE
# Create app at: https://developer.spotify.com/dashboard
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# YouTube Data API v3 - FREE
# Get key at: https://console.cloud.google.com/apis/credentials
YOUTUBE_API_KEY=your_youtube_api_key

# ============================================
# CLOUDINARY (ALREADY CONFIGURED)
# ============================================
# These are already set in config.ts:
# Cloud name: dd0ou581d
# API Key: 331969854289545
# API Secret: irAFHME5wEYftKj0aN849RaL3Hk
```

### 3. Run the Seeding Process

#### Step 1: Backup & Prepare (REQUIRED)

**⚠️ WARNING: This will WIPE all celebrity data from staging!**

```bash
npm run seed:backup
```

- Creates database backup
- Exports existing data to CSV
- Truncates tables (after 5-second confirmation)
- Verifies clean slate

**Output**: `/tmp/starrymeet_seeding/backup_pre_wipe_staging_[timestamp].dump`

#### Step 2: Seed Celebrities (Main Process)

```bash
npm run seed:celebrities
```

- Fetches 12,500+ real celebrities from Wikidata
- Enriches with TMDB, Spotify, YouTube
- Uploads images to Cloudinary
- Calculates pricing
- Imports to database
- Generates reports

**Expected runtime**: 2-4 hours
**Output**: `/tmp/starrymeet_seeding/` (all CSVs, JSONL, reports)

### 4. Review Results

```bash
# View summary report
cat /tmp/starrymeet_seeding/summary_report.json

# Check successful imports
head -20 /tmp/starrymeet_seeding/imports_success.csv

# Check failures
cat /tmp/starrymeet_seeding/imports_failed.csv

# Review top 500 expensive (need manual price verification)
head -20 /tmp/starrymeet_seeding/top_500_pending_price_review.csv
```

## 🎯 Expected Results

After successful seeding, you should have:

✅ **~12,500 celebrities** in staging database
✅ **Tier distribution**:
- Exclusive: ~500
- Elite: ~2,000
- High: ~3,000
- Mid: ~4,000
- Emerging: ~3,000

✅ **Geographic diversity**: ≥30% non-US profiles
✅ **Images**: All uploaded to Cloudinary (hero + thumbnail)
✅ **Pricing**: Calculated with popularity scores
✅ **Safety**: All filters applied (no minors, deceased, heads of state)

## 🔧 Troubleshooting

### "Cannot find module 'axios'" or "Cannot find module 'cloudinary'"

```bash
cd backend
npm install axios cloudinary
```

### "Database connection failed"

Check your `.env` file:
```bash
# Test connection
psql -h $DB_HOST -U $DB_USER -d $DB_NAME
```

Make sure `NODE_ENV` is NOT set to `production`.

### "TMDB API key invalid"

1. Go to https://www.themoviedb.org/settings/api
2. Sign up (free)
3. Request API key (instant approval)
4. Copy "API Read Access Token (v4 auth)"
5. Add to `.env` as `TMDB_API_KEY`

### "Spotify authentication failed"

1. Go to https://developer.spotify.com/dashboard
2. Create new app
3. Copy Client ID and Client Secret
4. Add both to `.env`

### "YouTube quota exceeded"

YouTube API has daily quota limits. If exceeded:
- Wait 24 hours for reset
- Or: Create new Google Cloud project with separate quota

### "Cloudinary upload failed"

Check your limits (free tier):
- Max 10 MB per image ✓
- 25 total credits/month
- 500 Admin API calls/hour

If limits exceeded, system will automatically use placeholder gradients.

## 📊 Monitoring Progress

The seeding script provides real-time console output:

```
🌍 Starting Wikidata celebrity fetch (target: 12500)...

📂 Fetching Actor (Q33999)...
  ✓ Fetched 100 Actors so far...
  ✓ Fetched 200 Actors so far...
✅ Total Actors fetched: 1,234

🔄 Enriching: Tom Hanks...
  ✅ TMDB: 82.5 popularity, 67 known works
  💰 Price: $45,000 (Elite)
  📸 Images uploaded to Cloudinary
✅ Enrichment complete for Tom Hanks

💾 Inserting 12,234 celebrities into database...
  📦 Batch 1: Inserting 250 celebrities...
  ✅ Batch complete: 250/12,234 inserted so far
```

## 🎉 Next Steps

After seeding is complete:

1. **Review Top 500**: Verify pricing for high-value celebrities
2. **QA Sample**: Check `/tmp/starrymeet_seeding/sample_profiles.jsonl`
3. **Verify Database**: Run test queries on staging
4. **Manual Review**: Check flagged controversial figures
5. **Production Plan**: Only after thorough QA and approval

## 📞 Support

For issues or questions:
- Check `README.md` for detailed documentation
- Review `/tmp/starrymeet_seeding/imports_failed.csv` for specific errors
- Contact development team

---

**Remember**: This is STAGING ONLY. Manual QA required before production deployment.
