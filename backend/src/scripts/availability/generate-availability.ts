/**
 * Batch Availability Generation Script
 * Generates availability slots for all celebrities in tier-based batches
 */

import sequelize from '../../config/database';
import { QueryTypes } from 'sequelize';
import { AvailabilityService } from '../../services/availability/availability.service';
import { TIER_CONFIG, BATCH_CONFIG } from '../../services/availability/config';
import { CelebrityProfile, CelebrityTier, BatchGenerationResult, GenerationResult } from '../../services/availability/types';

/**
 * Fetch celebrities by tier
 */
async function fetchCelebritiesByTier(tier: CelebrityTier): Promise<CelebrityProfile[]> {
  // Determine price range for tier
  const priceRanges: Record<CelebrityTier, { min: number; max: number | null }> = {
    S: { min: 50000000, max: null },
    A: { min: 10000000, max: 49999999 },
    B: { min: 2000000, max: 9999999 },
    C: { min: 500000, max: 1999999 },
    D: { min: 0, max: 499999 }
  };

  const range = priceRanges[tier];
  const maxCondition = range.max ? `AND standard_meet_price_cents <= ${range.max}` : '';

  const celebrities = await sequelize.query(`
    SELECT
      id, username, display_name, location,
      standard_meet_price_cents,
      quick_meet_price_cents,
      premium_meet_price_cents,
      virtual_quick_meet_price_cents,
      virtual_standard_meet_price_cents,
      virtual_premium_meet_price_cents
    FROM celebrities
    WHERE standard_meet_price_cents >= ${range.min} ${maxCondition}
      AND is_active = true
    ORDER BY standard_meet_price_cents DESC
  `, { type: QueryTypes.SELECT }) as CelebrityProfile[];

  return celebrities.map(c => ({ ...c, tier }));
}

/**
 * Process a single batch of celebrities
 */
async function processBatch(
  celebrities: CelebrityProfile[],
  tier: CelebrityTier
): Promise<GenerationResult[]> {
  const results: GenerationResult[] = [];

  for (const celebrity of celebrities) {
    try {
      // Generate physical slots first
      const physicalResult = await AvailabilityService.generateSlotsForCelebrity(
        celebrity,
        'physical',
        tier
      );
      results.push(physicalResult);

      // Then generate virtual slots
      const virtualResult = await AvailabilityService.generateSlotsForCelebrity(
        celebrity,
        'virtual',
        tier
      );
      results.push(virtualResult);

      console.log(`  ✅ ${celebrity.display_name}: ${physicalResult.slots_generated} physical, ${virtualResult.slots_generated} virtual`);

    } catch (error: any) {
      console.error(`  ❌ Failed for ${celebrity.display_name}:`, error.message);
    }
  }

  return results;
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main generation function
 */
async function generateAvailability(): Promise<void> {
  const startTime = new Date();
  console.log('🚀 Starting availability generation...\n');
  console.log('='.repeat(70) + '\n');

  const batchResults: BatchGenerationResult = {
    total_celebrities_processed: 0,
    total_slots_generated: 0,
    total_slots_skipped: 0,
    results_by_tier: {
      S: [],
      A: [],
      B: [],
      C: [],
      D: []
    },
    duration_seconds: 0,
    errors: []
  };

  try {
    // Connect to database
    console.log('🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Clean up expired slots and cooldowns first
    console.log('🧹 Cleaning up expired data...');
    const expiredSlots = await AvailabilityService.expireOldSlots();
    const expiredCooldowns = await AvailabilityService.cleanupExpiredCooldowns();
    console.log(`✅ Expired ${expiredSlots} slots, removed ${expiredCooldowns} cooldowns\n`);

    // Process each tier (S -> A -> B -> C -> D)
    const tiers: CelebrityTier[] = ['S', 'A', 'B', 'C', 'D'];

    for (const tier of tiers) {
      console.log(`\n${'='.repeat(70)}`);
      console.log(`🎯 Processing Tier ${tier} (${TIER_CONFIG[tier].description})`);
      console.log('='.repeat(70) + '\n');

      // Fetch celebrities for this tier
      const celebrities = await fetchCelebritiesByTier(tier);
      console.log(`📥 Found ${celebrities.length} celebrities in tier ${tier}\n`);

      if (celebrities.length === 0) {
        continue;
      }

      // Process in batches
      const batchSize = BATCH_CONFIG.celebritiesPerBatch;
      const totalBatches = Math.ceil(celebrities.length / batchSize);

      for (let i = 0; i < celebrities.length; i += batchSize) {
        const batch = celebrities.slice(i, i + batchSize);
        const batchNum = Math.floor(i / batchSize) + 1;

        console.log(`📦 Processing batch ${batchNum}/${totalBatches} (${batch.length} celebrities)...\n`);

        const batchResults_tier = await processBatch(batch, tier);
        batchResults.results_by_tier[tier].push(...batchResults_tier);

        // Update totals
        batchResults.total_celebrities_processed += batch.length;
        batchResults.total_slots_generated += batchResults_tier.reduce((sum, r) => sum + r.slots_generated, 0);
        batchResults.total_slots_skipped += batchResults_tier.reduce((sum, r) => sum + r.slots_skipped, 0);

        console.log(`\n  ✅ Batch ${batchNum}/${totalBatches} complete`);
        console.log(`  📊 Generated: ${batchResults_tier.reduce((sum, r) => sum + r.slots_generated, 0)} slots\n`);

        // Delay between batches to avoid DB overload
        if (i + batchSize < celebrities.length) {
          await sleep(BATCH_CONFIG.delayBetweenBatchesMs);
        }
      }

      console.log(`\n✅ Tier ${tier} complete!`);
      console.log(`📊 Total slots: ${batchResults.results_by_tier[tier].reduce((sum, r) => sum + r.slots_generated, 0)}\n`);
    }

    // Calculate duration
    const endTime = new Date();
    batchResults.duration_seconds = (endTime.getTime() - startTime.getTime()) / 1000;

    // Print final summary
    console.log('\n' + '='.repeat(70));
    console.log('✅ AVAILABILITY GENERATION COMPLETE!');
    console.log('='.repeat(70) + '\n');

    console.log(`⏱️  Duration: ${batchResults.duration_seconds.toFixed(1)} seconds`);
    console.log(`👥 Celebrities processed: ${batchResults.total_celebrities_processed}`);
    console.log(`📅 Total slots generated: ${batchResults.total_slots_generated}`);
    console.log(`⏭️  Slots skipped (exclusivity): ${batchResults.total_slots_skipped}`);

    console.log('\n📊 Breakdown by tier:\n');
    for (const tier of tiers) {
      const tierResults = batchResults.results_by_tier[tier];
      const totalSlots = tierResults.reduce((sum, r) => sum + r.slots_generated, 0);
      const totalCelebs = tierResults.filter(r => r.meeting_type === 'physical').length;

      if (totalCelebs > 0) {
        console.log(`  Tier ${tier}: ${totalCelebs} celebrities, ${totalSlots} slots`);
      }
    }

    console.log('\n' + '='.repeat(70) + '\n');

    // Show sample availability
    console.log('🎲 Sample availability slots:\n');
    const samples = await sequelize.query(`
      SELECT
        c.display_name,
        a.meeting_type,
        a.duration,
        a.city,
        a.country,
        a.date,
        a.time,
        a.price_cents / 100 as price,
        a.tier
      FROM availability a
      JOIN celebrities c ON a.celebrity_id = c.id
      WHERE a.status = 'active'
      ORDER BY a.price_cents DESC
      LIMIT 10
    `, { type: 'SELECT' });

    (samples as any[]).forEach((slot, idx) => {
      console.log(`  ${idx + 1}. ${slot.display_name} (${slot.tier}) - ${slot.meeting_type} ${slot.duration}min`);
      console.log(`     📍 ${slot.city}, ${slot.country} on ${slot.date} at ${slot.time}`);
      console.log(`     💰 $${Number(slot.price).toLocaleString()}\n`);
    });

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    batchResults.errors.push(error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run if executed directly
if (require.main === module) {
  generateAvailability();
}

export default generateAvailability;
