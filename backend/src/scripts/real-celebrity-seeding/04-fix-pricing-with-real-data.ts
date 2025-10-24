/**
 * Fix Pricing with Real API Data
 * 1. Adds metrics columns to database
 * 2. Reads enriched data from sample_profiles.jsonl
 * 3. Updates celebrities with real metrics
 * 4. Recalculates prices using proper algorithm
 */

import sequelize from '../../config/database';
import Celebrity from '../../models/Celebrity';
import { calculatePricing } from './services/pricing.service';
import * as fs from 'fs';
import * as path from 'path';

const SAMPLE_PROFILES_PATH = '/tmp/starrymeet_seeding/sample_profiles.jsonl';

interface EnrichedProfile {
  name: string;
  slug: string;
  social_followers?: number;
  monthly_listeners?: number;
  monthly_views?: number;
  box_office_total?: number;
  streaming_views?: number;
  awards_count?: number;
  [key: string]: any;
}

/**
 * Add metrics columns to celebrities table
 */
async function addMetricsColumns(): Promise<void> {
  console.log('🔧 Adding metrics columns to database...\n');

  const queries = [
    `ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS social_followers BIGINT DEFAULT NULL`,
    `ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS monthly_listeners BIGINT DEFAULT NULL`,
    `ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS monthly_views BIGINT DEFAULT NULL`,
    `ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS box_office_total BIGINT DEFAULT NULL`,
    `ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS streaming_views BIGINT DEFAULT NULL`,
    `ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS awards_count INTEGER DEFAULT 0`,
    `ALTER TABLE celebrities ADD COLUMN IF NOT EXISTS popularity_score DECIMAL(5,2) DEFAULT 0`
  ];

  for (const query of queries) {
    try {
      await sequelize.query(query);
    } catch (error: any) {
      // Column might already exist, that's ok
      if (!error.message.includes('already exists')) {
        console.error(`⚠️  Warning:`, error.message);
      }
    }
  }

  console.log('✅ Metrics columns added\n');
}

/**
 * Load enriched profiles from JSONL file
 */
function loadEnrichedProfiles(): Map<string, EnrichedProfile> {
  console.log(`📥 Loading enriched profiles from ${SAMPLE_PROFILES_PATH}...\n`);

  const profileMap = new Map<string, EnrichedProfile>();

  if (!fs.existsSync(SAMPLE_PROFILES_PATH)) {
    console.warn('⚠️  Sample profiles file not found, will use heuristic pricing\n');
    return profileMap;
  }

  const content = fs.readFileSync(SAMPLE_PROFILES_PATH, 'utf-8');
  const lines = content.trim().split('\n');

  for (const line of lines) {
    try {
      const profile: EnrichedProfile = JSON.parse(line);
      profileMap.set(profile.slug, profile);
    } catch (error) {
      // Skip invalid JSON lines
    }
  }

  console.log(`✅ Loaded ${profileMap.size} enriched profiles\n`);
  return profileMap;
}

/**
 * Update celebrity with metrics and recalculate price
 */
async function updateCelebrityPricing(celebrity: any, enrichedData?: EnrichedProfile): Promise<void> {
  // Build candidate object for pricing calculation
  const candidate: any = {
    social_followers: enrichedData?.social_followers || 0,
    monthly_listeners: enrichedData?.monthly_listeners || 0,
    monthly_views: enrichedData?.monthly_views || 0,
    box_office_total: enrichedData?.box_office_total || 0,
    streaming_views: enrichedData?.streaming_views || 0,
    awards_count: enrichedData?.awards_count || 0,
    country: celebrity.location?.split(',')[celebrity.location?.split(',').length - 1]?.trim(),
    city: celebrity.location?.split(',')[0]?.trim(),
    active_status: 'Active',
    professional_class: celebrity.subcategory
  };

  // Calculate pricing
  const pricing = calculatePricing(candidate);

  // Update database
  await celebrity.update({
    social_followers: candidate.social_followers || null,
    monthly_listeners: candidate.monthly_listeners || null,
    monthly_views: candidate.monthly_views || null,
    box_office_total: candidate.box_office_total || null,
    streaming_views: candidate.streaming_views || null,
    awards_count: candidate.awards_count || 0,
    popularity_score: pricing.popularity_score,
    standard_meet_price_cents: pricing.final_price_cents
  });
}

/**
 * Main function
 */
async function fixPricing(): Promise<void> {
  const startTime = new Date();

  console.log('🚀 Starting pricing fix with real API data...\n');
  console.log('='.repeat(60) + '\n');

  try {
    // Connect to database
    console.log('🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Add metrics columns
    await addMetricsColumns();

    // Load enriched profiles
    const enrichedProfiles = loadEnrichedProfiles();

    // Fetch all celebrities
    console.log('📥 Fetching celebrities from database...');
    const celebrities = await Celebrity.findAll();
    console.log(`✅ Found ${celebrities.length} celebrities\n`);

    // Update pricing
    console.log('💰 Recalculating prices with real metrics...\n');
    let updated = 0;
    let withMetrics = 0;
    const batchSize = 100;

    for (let i = 0; i < celebrities.length; i += batchSize) {
      const batch = celebrities.slice(i, i + batchSize);

      console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(celebrities.length / batchSize)}...`);

      for (const celebrity of batch) {
        const enrichedData = enrichedProfiles.get(celebrity.username);

        if (enrichedData) {
          withMetrics++;
        }

        await updateCelebrityPricing(celebrity, enrichedData);
        updated++;
      }

      console.log(`  ✅ Updated ${updated}/${celebrities.length} celebrities (${withMetrics} with metrics)`);
    }

    const endTime = new Date();
    const durationSeconds = (endTime.getTime() - startTime.getTime()) / 1000;

    console.log('\n' + '='.repeat(60));
    console.log('✅ PRICING FIX COMPLETE!');
    console.log('='.repeat(60));
    console.log(`⏱️  Duration: ${durationSeconds.toFixed(1)} seconds`);
    console.log(`📊 Total updated: ${updated} celebrities`);
    console.log(`📈 With API metrics: ${withMetrics} celebrities`);
    console.log(`🎲 Using heuristics: ${updated - withMetrics} celebrities`);
    console.log('='.repeat(60) + '\n');

    // Show price distribution
    console.log('💰 Top 20 most expensive celebrities:');
    const topCelebrities = await Celebrity.findAll({
      attributes: ['display_name', 'standard_meet_price_cents', 'popularity_score'],
      order: [['standard_meet_price_cents', 'DESC']],
      limit: 20
    });

    topCelebrities.forEach((celeb, idx) => {
      const price = (celeb.standard_meet_price_cents || 0) / 100;
      const score = (celeb as any).popularity_score || 0;
      console.log(`  ${idx + 1}. ${celeb.display_name}: $${price.toLocaleString()} (score: ${score})`);
    });

    // Show price range stats
    console.log('\n📊 Price distribution:');
    const stats = await sequelize.query(`
      SELECT
        MIN(standard_meet_price_cents) / 100 as min_price,
        MAX(standard_meet_price_cents) / 100 as max_price,
        AVG(standard_meet_price_cents) / 100 as avg_price,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY standard_meet_price_cents) / 100 as median_price
      FROM celebrities
      WHERE standard_meet_price_cents > 0
    `, { type: 'SELECT' });

    const priceStats = stats[0] as any;
    console.log(`  Min: $${Number(priceStats.min_price).toLocaleString()}`);
    console.log(`  Max: $${Number(priceStats.max_price).toLocaleString()}`);
    console.log(`  Avg: $${Number(priceStats.avg_price).toLocaleString()}`);
    console.log(`  Median: $${Number(priceStats.median_price).toLocaleString()}`);

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run if executed directly
if (require.main === module) {
  fixPricing();
}

export default fixPricing;
