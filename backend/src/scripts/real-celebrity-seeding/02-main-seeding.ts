/**
 * Main Celebrity Seeding Script
 * Orchestrates the entire seeding process:
 * 1. Fetch candidates from Wikidata
 * 2. Enrich with external APIs
 * 3. Apply safety filters
 * 4. Deduplicate
 * 5. Calculate pricing
 * 6. Upload images
 * 7. Import to database
 * 8. Generate reports
 */

import sequelize from '../../config/database';
import Celebrity from '../../models/Celebrity';
import { fetchAllCelebrities, enrichWikidataEntity } from './services/wikidata.service';
import { enrichCandidatesWithRetry } from './services/enrichment.service';
import { checkDuplicate } from './services/deduplication.service';
import { generateAllOutputs } from './services/output.service';
import { CelebrityCandidate } from './types';
import { TARGET_DISTRIBUTION, TOTAL_TARGET, PROCESSING_CONFIG } from './config';

/**
 * API call statistics
 */
const apiStats = {
  wikidataCalls: 0,
  tmdbCalls: 0,
  imdbCalls: 0,
  musicbrainzCalls: 0,
  spotifyCalls: 0,
  youtubeCalls: 0,
  cloudinaryCalls: 0,
  totalErrors: 0,
  totalRetries: 0
};

/**
 * Insert candidates into database in batches
 */
async function insertCandidatesInBatches(
  candidates: CelebrityCandidate[]
): Promise<{
  successful: number;
  failed: Array<{ candidate: CelebrityCandidate; error: string }>;
}> {
  console.log(`\n💾 Inserting ${candidates.length} celebrities into database...`);

  let successful = 0;
  const failed: Array<{ candidate: CelebrityCandidate; error: string }> = [];

  // Process in batches
  for (let i = 0; i < candidates.length; i += PROCESSING_CONFIG.batchSize) {
    const batch = candidates.slice(i, i + PROCESSING_CONFIG.batchSize);

    console.log(`  📦 Batch ${Math.floor(i / PROCESSING_CONFIG.batchSize) + 1}: Inserting ${batch.length} celebrities...`);

    for (const candidate of batch) {
      try {
        await Celebrity.create({
          username: candidate.slug,
          display_name: candidate.name,
          celebrity_code: `${candidate.universal_category}-${candidate.slug}`.toUpperCase(),
          category: candidate.universal_category,
          subcategory: candidate.professional_class,
          niche_category: candidate.genres?.join(', ') || candidate.professional_class,
          bio: candidate.short_bio,
          location: candidate.location || `${candidate.city || ''}, ${candidate.country || ''}`.trim(),
          avatar_url: candidate.thumbnail_url,
          cover_photo_url: candidate.hero_image_url,
          quick_meet_price_cents: undefined, // Not applicable for this seeding
          standard_meet_price_cents: candidate.base_price_cents,
          premium_meet_price_cents: undefined, // Not applicable for this seeding
          response_time_hours: 24,
          average_rating: 0,
          total_reviews: 0,
          total_bookings: 0,
          is_verified: candidate.is_verified,
          is_active: candidate.is_active,
          is_featured: candidate.is_featured
        });

        successful++;

      } catch (error: any) {
        failed.push({
          candidate,
          error: error.message
        });
        console.error(`    ❌ Failed to insert ${candidate.name}:`, error.message);
      }
    }

    console.log(`  ✅ Batch complete: ${successful}/${candidates.length} inserted so far`);

    // Small delay between batches to avoid overwhelming database
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n✅ Database import complete!`);
  console.log(`   Successful: ${successful}`);
  console.log(`   Failed: ${failed.length}`);

  return { successful, failed };
}

/**
 * Main seeding function
 */
async function main(): Promise<void> {
  const startTime = new Date();

  console.log('🚀 Starting Real Celebrity Seeding Process...');
  console.log(`⏰ Start time: ${startTime.toISOString()}`);
  console.log(`🎯 Target: ${TOTAL_TARGET.toLocaleString()} celebrities\n`);

  // Safety check
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ SAFETY CHECK FAILED: Cannot run in production environment!');
    console.error('   Set NODE_ENV to "staging" or "development"');
    process.exit(1);
  }

  try {
    // Connect to database
    console.log('🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    // ============================================
    // STEP 1: Fetch candidates from Wikidata
    // ============================================

    console.log('=' + '='.repeat(60));
    console.log('STEP 1: Fetching celebrities from Wikidata');
    console.log('=' + '='.repeat(60) + '\n');

    const wikidataEntities = await fetchAllCelebrities(TOTAL_TARGET);
    apiStats.wikidataCalls = wikidataEntities.length;

    console.log(`\n✅ Fetched ${wikidataEntities.length} candidates from Wikidata\n`);

    // ============================================
    // STEP 2: Enrich candidates with external APIs
    // ============================================

    console.log('=' + '='.repeat(60));
    console.log('STEP 2: Enriching candidates with external APIs');
    console.log('=' + '='.repeat(60) + '\n');

    const { successful: enrichedCandidates, failed: failedEnrichments } =
      await enrichCandidatesWithRetry(wikidataEntities, PROCESSING_CONFIG.maxRetries);

    console.log(`\n✅ Enrichment complete!`);
    console.log(`   Successful: ${enrichedCandidates.length}`);
    console.log(`   Failed: ${failedEnrichments.length}\n`);

    // ============================================
    // STEP 3: Deduplicate candidates
    // ============================================

    console.log('=' + '='.repeat(60));
    console.log('STEP 3: Deduplicating candidates');
    console.log('=' + '='.repeat(60) + '\n');

    const uniqueCandidates: CelebrityCandidate[] = [];
    const duplicates: CelebrityCandidate[] = [];

    for (const candidate of enrichedCandidates) {
      const dupCheck = checkDuplicate(candidate, uniqueCandidates);

      if (dupCheck.isDuplicate) {
        console.log(`  ⚠️  Duplicate detected: ${candidate.name} (${dupCheck.matchReason})`);
        duplicates.push(candidate);
      } else {
        uniqueCandidates.push(candidate);
      }
    }

    console.log(`\n✅ Deduplication complete!`);
    console.log(`   Unique: ${uniqueCandidates.length}`);
    console.log(`   Duplicates removed: ${duplicates.length}\n`);

    // ============================================
    // STEP 4: Insert into database
    // ============================================

    console.log('=' + '='.repeat(60));
    console.log('STEP 4: Importing to database');
    console.log('=' + '='.repeat(60) + '\n');

    const { successful: insertedCount, failed: insertionFailures } =
      await insertCandidatesInBatches(uniqueCandidates);

    console.log(`\n✅ Database import complete!`);
    console.log(`   Inserted: ${insertedCount}`);
    console.log(`   Failed: ${insertionFailures.length}\n`);

    // ============================================
    // STEP 5: Generate outputs and reports
    // ============================================

    console.log('=' + '='.repeat(60));
    console.log('STEP 5: Generating outputs and reports');
    console.log('=' + '='.repeat(60) + '\n');

    const endTime = new Date();

    // Combine all failures
    const allFailures = [
      ...failedEnrichments.map(f => ({ entity: f.entity, errors: f.errors })),
      ...insertionFailures.map(f => ({ entity: { name: f.candidate.name }, errors: [f.error] }))
    ];

    generateAllOutputs(
      uniqueCandidates,
      allFailures,
      apiStats,
      startTime,
      endTime
    );

    // ============================================
    // FINAL SUMMARY
    // ============================================

    console.log('\n' + '='.repeat(60));
    console.log('🎉 SEEDING COMPLETE!');
    console.log('='.repeat(60));
    console.log(`⏰ Start: ${startTime.toISOString()}`);
    console.log(`⏰ End: ${endTime.toISOString()}`);
    console.log(`⏱️  Duration: ${((endTime.getTime() - startTime.getTime()) / 1000 / 60).toFixed(2)} minutes`);
    console.log(`\n📊 Final Statistics:`);
    console.log(`   Total fetched: ${wikidataEntities.length}`);
    console.log(`   Successfully enriched: ${enrichedCandidates.length}`);
    console.log(`   Unique celebrities: ${uniqueCandidates.length}`);
    console.log(`   Inserted into database: ${insertedCount}`);
    console.log(`   Total failures: ${allFailures.length}`);
    console.log(`\n📁 All outputs saved to: /tmp/starrymeet_seeding/`);
    console.log('='.repeat(60) + '\n');

    console.log('⚠️  IMPORTANT: This is STAGING DATA ONLY!');
    console.log('   Please review the outputs before considering production deployment.');
    console.log('   Manual QA required before production push.\n');

  } catch (error: any) {
    console.error('\n❌ FATAL ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export default main;
