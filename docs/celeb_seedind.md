
Title: Populate StarryMeet staging with 12–15k real, living celebrity profiles — physical-first meetings, Postgres + Cloudinary. Staging-only. Produce CSVs, JSONL, and summary report.
0 — GLOBAL CONSTRAINTS
STAGING ONLY — do not touch production. Pause after staging import.
Use Postgres at STAGING_DATABASE_URL.
Images: download official/press images, upload to Cloudinary. Store Cloudinary URLs only.
Living people only — exclude anyone with recorded death (Wikidata P570). If unsure, exclude.
No hallucinated people. If a source lacks a fact, set field null.
Legal Safety Filters: 
Exclude minors (<18), heads of state, sanctioned individuals, senior religious leaders.
Flag controversial figures for manual review.
Purpose: physical meetings primary; virtual secondary. Include meeting_options.
Bios short & commercial — max 140 chars, 1–2 lines.
Log every API call, errors, retries; produce CSVs/JSONL outputs.
Use only: Wikidata, TMDB, IMDb, MusicBrainz, Spotify, YouTube, Transfermarkt, official artist/team pages, verified press kits.
1 — PREP & SAFETY
Backup staging DB → backup_pre_wipe_staging.dump.
Export existing celebrities → /tmp/celebrities_existing_staging.csv.
Truncate all celebrity-related tables. Confirm SELECT count(*) FROM celebrities; returns 0. Log results.
2 — TARGET MIX
Tier Exclusive (A+): 500
Tier Elite (A): 2,000
Tier High (B): 3,000
Tier Mid (C): 4,000
Tier Emerging (D): 3,000
Total ~12,500.
Ensure ≥30% non-US profiles (Africa, Asia, LATAM, Middle East, Europe).
3 — TAXONOMY & SEEDING
Universal Categories: Entertainer, Athlete, Creator, Business, PublicFigure, Professional, Artist, Spiritual, Other.
Professional Classes: Actor, Musician, YouTuber, Author, etc.
Industries & Mediums: primary + array.
Genres, Fame Context, Region/Subregion/Country/Languages.
Active Status: Active / Retired / Legend / Upcoming / Posthumous.
Tags, Affiliations, Metrics, Booking Options.
Seed candidates from Wikidata using occupation-based SPARQL (FILTER NOT EXISTS { ?person wdt:P570 ?death }).
4 — ENRICHMENT PIPELINE
For each candidate:
Resolve IDs: Wikidata QID, IMDb, TMDB, MusicBrainz, Spotify, YouTube, Transfermarkt.
Fetch structured facts: occupations, birthDate, country, awards, notable works.
Fetch media/credits; download images.
Generate short_bio, known_for, populate taxonomy.
Compute popularity_score (normalized metrics + weights).
Compute base_price and price_tier (see Pricing below).
Assign meeting_options and bookable flag.
Batch insert Postgres (size 250). On failure → /tmp/imports_failed.csv.
Retry errors with exponential backoff; log all retries.
5 — PRICING ALGORITHM
Normalize metrics: log-scale social_followers, monthly_listeners/views, box_office, streaming_views, awards, google_trends, media_mentions.
Weighted sum → popularity_score 0–100.
Base price mapping: 
≥95 → Exclusive $100k
90–94 → Ultra Elite $50k
80–89 → Elite $25k
70–79 → A-Lister $10k
55–69 → B-Lister $4k
40–54 → C-Lister $1k
25–39 → Rising $400
<25 → Emerging $100
Apply modifiers: rarity_factor, demand_factor, market_multiplier, meeting_complexity.
Round to nearest $50. Store cents.
Top 500 profiles → flag pending_review_for_price.
6 — LEGAL & SAFETY
Exclude minors, heads of state, sanctioned individuals, senior religious leaders.
Controversial or high-risk → flag for review.
Posthumous → not bookable.
Images must be TMDB/press/official. Placeholder gradient if none.
7 — IMAGE LOGIC
Hero: 1600px max, WebP, quality 75.
Thumb: 400px, WebP.
Cloudinary path: starrymeet/{region}/{slug}/hero.webp & /thumb.webp.
Store image_sources (URL + license).
Generate neutral placeholder if no official image.
8 — BOOKING RULES
Fields: meet_duration (30/60/90), meeting_options, travel_policy, nda_required, security_requirements, cancellation_policy.
Default: refundable >72h, else no refund. Travel typically buyer-paid.
9 — DEDUPE & IDENTITY RESOLUTION
Merge if same QID or IMDb ID.
Fuzzy match name+birth_year+country (0.88 threshold).
Flag merge_candidate → /tmp/merge_candidates.csv.
Audit log merged_from.
🔟 SEARCH & SEO
Index fields: name, slug, short_bio, professional_title, category_tree, known_for, country, languages, popularity_score, price_cents, bookable.
SEO fields: seo_title, seo_description, canonical_url.
Sitemap: top 5k first.
11 — OUTPUTS
/tmp/imports_success.csv
/tmp/imports_failed.csv
/tmp/merge_candidates.csv
/tmp/top_500_pending_price_review.csv
summary_report.json (tier, region, price distribution, top 100 expensive, API stats)
sample_profiles.jsonl (200 random full-profile JSONL for QA)
API/log logs for retries/errors.
12 — RUNTIME & PROCESS
Parallel enrichment workers. Respect API rate limits.
Idempotent inserts; skip duplicates.
Retry errors 3 times; log failures.
13 — FINAL STAGING WORKFLOW
Backup staging → backup_pre_wipe_staging.dump.
Export /tmp/celebrities_existing_staging.csv.
Truncate staging tables.
Import enriched candidates.
Dedupe & sanity checks.
Produce outputs.
Pause for human QA — do not touch production.
Manual approval required for production push.
14 — STRICT NOs
No invented names.
No minors, heads of state, sanctioned individuals.
No Wikipedia dumps in bios >2 lines.
Only verified official images.

Cloudinary infos:
- API credentials configured in backend/.env (not tracked in git)
- Free tier limits:
  - Upload API: Unlimited hourly requests
  - Admin API: 500 hourly requests
  - Max image file size: 10 MB
  - Max video file size: 100 MB
  - Max online manipulation: 100 MB
  - Max raw file size: 10 MB
  - Max image megapixels: 25 MP
  - Max total megapixels in all frames: 50 MP

External API Keys:
- All API keys configured in backend/.env (not tracked in git)
- TMDB (The Movie Database): Get free key at https://www.themoviedb.org/settings/api
- Google/YouTube API: Get free key at https://console.cloud.google.com/apis/credentials
- Spotify: Get free credentials at https://developer.spotify.com/dashboard
- See backend/.env.example for configuration template