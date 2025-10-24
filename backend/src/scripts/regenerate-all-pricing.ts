/**
 * Regenerate ALL Pricing for Classified Celebrities
 *
 * Fixes pricing anomalies and ensures each celebrity has exactly 6 packages:
 * - 3 virtual packages (15min, 30min, 60min)
 * - 3 physical packages (15min, 30min, 60min)
 *
 * Uses the same tier-based pricing logic from classification-agent.ts
 */

import sequelize from '../config/database';
import { QueryTypes } from 'sequelize';

// ============================================
// PRICING CONFIGURATION (from classification-agent.ts)
// ============================================

const TIER_PRICE_RANGES = {
  S: { min: 10000000,  max: 200000000 },  // $100K - $2M
  A: { min: 2000000,   max: 50000000 },   // $20K - $500K
  B: { min: 500000,    max: 5000000 },    // $5K - $50K
  C: { min: 100000,    max: 1000000 },    // $1K - $10K
  D: { min: 10000,     max: 200000 }      // $100 - $2K
};

const DURATION_MULTIPLIERS = {
  15: 1.0,   // Base price
  30: 1.8,   // 80% more
  60: 3.0    // 3x base price
};

function randomFloatInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generate 6-package tier-based pricing
 */
function generateTierPricing(tier: 'S' | 'A' | 'B' | 'C' | 'D'): Array<{
  meeting_type: 'virtual' | 'physical';
  duration: number;
  price_cents: number;
}> {
  const range = TIER_PRICE_RANGES[tier];

  // Pick base physical price for 15min (start lower in range to allow room for 60min)
  const rangeSize = range.max - range.min;
  const base15Physical = range.min + Math.floor(rangeSize * randomFloatInRange(0.3, 0.6));

  // Calculate physical prices for all durations
  const physical15 = base15Physical;
  const physical30 = Math.floor(base15Physical * DURATION_MULTIPLIERS[30]);
  const physical60 = Math.floor(base15Physical * DURATION_MULTIPLIERS[60]);

  // Calculate virtual prices (20-40% discount = multiply by 0.6-0.8)
  const virtualDiscount = randomFloatInRange(0.6, 0.8);
  const virtual15 = Math.floor(physical15 * virtualDiscount);
  const virtual30 = Math.floor(physical30 * virtualDiscount);
  const virtual60 = Math.floor(physical60 * virtualDiscount);

  // Check if physical60 exceeds max (highest price)
  let scaleFactor = 1.0;
  if (physical60 > range.max) {
    scaleFactor = range.max / physical60;
  }

  // Apply scale factor if needed
  const pricing = [
    { meeting_type: 'virtual' as const, duration: 15, price_cents: Math.floor(virtual15 * scaleFactor) },
    { meeting_type: 'virtual' as const, duration: 30, price_cents: Math.floor(virtual30 * scaleFactor) },
    { meeting_type: 'virtual' as const, duration: 60, price_cents: Math.floor(virtual60 * scaleFactor) },
    { meeting_type: 'physical' as const, duration: 15, price_cents: Math.floor(physical15 * scaleFactor) },
    { meeting_type: 'physical' as const, duration: 30, price_cents: Math.floor(physical30 * scaleFactor) },
    { meeting_type: 'physical' as const, duration: 60, price_cents: Math.floor(physical60 * scaleFactor) }
  ];

  return pricing;
}

async function regenerateAllPricing() {
  const startTime = new Date();

  console.log('\n🚀 Starting COMPLETE Pricing Regeneration...\n');
  console.log('='.repeat(60));

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Step 1: Delete ALL existing pricing
    console.log('🗑️  Deleting all existing pricing...');
    const deleteResult = await sequelize.query(
      `DELETE FROM celebrity_pricing`,
      { type: QueryTypes.DELETE }
    );
    console.log(`✅ Deleted all pricing records\n`);

    // Step 2: Get all classified celebrities with their tiers
    console.log('📥 Fetching classified celebrities...');
    const celebrities = await sequelize.query(
      `SELECT c.id, c.name, cs.tier
       FROM celebrities_new c
       JOIN celebrity_settings cs ON c.id = cs.celebrity_id
       WHERE cs.tier IS NOT NULL
       ORDER BY cs.tier, c.name`,
      { type: QueryTypes.SELECT }
    ) as Array<{ id: string; name: string; tier: 'S' | 'A' | 'B' | 'C' | 'D' }>;

    console.log(`✅ Found ${celebrities.length} classified celebrities\n`);

    // Step 3: Process by tier in batches
    const tiers = ['S', 'A', 'B', 'C', 'D'] as const;
    let totalProcessed = 0;
    let totalPackagesCreated = 0;

    for (const tier of tiers) {
      const tierCelebs = celebrities.filter(c => c.tier === tier);

      if (tierCelebs.length === 0) continue;

      console.log(`\n${'='.repeat(60)}`);
      console.log(`📦 Processing Tier ${tier} (${tierCelebs.length} celebrities)`);
      console.log(`${'='.repeat(60)}\n`);

      const batchSize = 50;
      for (let i = 0; i < tierCelebs.length; i += batchSize) {
        const batch = tierCelebs.slice(i, i + batchSize);

        console.log(`  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(tierCelebs.length / batchSize)} (${batch.length} celebrities)...`);

        // Build bulk insert values
        const allPackages: string[] = [];

        for (const celeb of batch) {
          // Generate 6 packages
          const pricing = generateTierPricing(celeb.tier);

          // Validate: must be exactly 6 packages
          if (pricing.length !== 6) {
            console.error(`  ⚠️  ERROR: ${celeb.name} has ${pricing.length} packages instead of 6!`);
            continue;
          }

          // Add all 6 packages to bulk insert
          for (const pkg of pricing) {
            allPackages.push(
              `('${celeb.id}', '${pkg.meeting_type}', ${pkg.duration}, ${pkg.price_cents}, 'USD', true, NOW(), NOW())`
            );
            totalPackagesCreated++;
          }

          totalProcessed++;
        }

        // Bulk insert all packages for this batch
        if (allPackages.length > 0) {
          await sequelize.query(
            `INSERT INTO celebrity_pricing (
              celebrity_id, meeting_type, duration, price_cents, currency, is_active, created_at, updated_at
            ) VALUES ${allPackages.join(', ')}`,
            { type: QueryTypes.INSERT }
          );
        }

        console.log(`    ✅ Processed ${Math.min(i + batchSize, tierCelebs.length)}/${tierCelebs.length}`);
      }
    }

    const endTime = new Date();
    const durationSeconds = (endTime.getTime() - startTime.getTime()) / 1000;

    console.log('\n' + '='.repeat(60));
    console.log('🎉 PRICING REGENERATION COMPLETE!');
    console.log('='.repeat(60));
    console.log(`⏱️  Duration: ${durationSeconds.toFixed(1)} seconds`);
    console.log(`📊 Celebrities processed: ${totalProcessed}`);
    console.log(`📦 Total packages created: ${totalPackagesCreated}`);
    console.log(`📈 Packages per celebrity: ${(totalPackagesCreated / totalProcessed).toFixed(1)}`);
    console.log('='.repeat(60));

    // Verification
    console.log('\n🔍 Verification:\n');

    // Check for anomalies
    const anomalies = await sequelize.query(
      `SELECT celebrity_id, meeting_type, duration, COUNT(*) as count
       FROM celebrity_pricing
       GROUP BY celebrity_id, meeting_type, duration
       HAVING COUNT(*) > 1`,
      { type: QueryTypes.SELECT }
    );

    if ((anomalies as any[]).length > 0) {
      console.log(`⚠️  Found ${(anomalies as any[]).length} duplicate packages`);
    } else {
      console.log('✅ No duplicate packages');
    }

    // Check for celebrities with wrong package count
    const wrongCount = await sequelize.query(
      `SELECT celebrity_id, COUNT(*) as package_count
       FROM celebrity_pricing
       GROUP BY celebrity_id
       HAVING COUNT(*) != 6`,
      { type: QueryTypes.SELECT }
    );

    if ((wrongCount as any[]).length > 0) {
      console.log(`⚠️  Found ${(wrongCount as any[]).length} celebrities with wrong package count`);
    } else {
      console.log('✅ All celebrities have exactly 6 packages');
    }

    // Check for prices outside tier ranges
    const outOfRange = await sequelize.query(
      `SELECT cs.tier, COUNT(DISTINCT cp.celebrity_id) as count
       FROM celebrity_pricing cp
       JOIN celebrity_settings cs ON cp.celebrity_id = cs.celebrity_id
       WHERE (cs.tier = 'S' AND cp.price_cents > 200000000)
          OR (cs.tier = 'A' AND cp.price_cents > 50000000)
          OR (cs.tier = 'B' AND cp.price_cents > 5000000)
          OR (cs.tier = 'C' AND cp.price_cents > 1000000)
          OR (cs.tier = 'D' AND cp.price_cents > 200000)
       GROUP BY cs.tier`,
      { type: QueryTypes.SELECT }
    );

    if ((outOfRange as any[]).length > 0) {
      console.log('⚠️  Celebrities with prices outside tier ranges:');
      (outOfRange as any[]).forEach(row => {
        console.log(`    Tier ${row.tier}: ${row.count} celebrities`);
      });
    } else {
      console.log('✅ All prices within tier ranges');
    }

    // Show distribution by tier
    console.log('\n📊 Final Pricing Distribution:\n');
    const distribution = await sequelize.query(
      `SELECT cs.tier, cp.meeting_type, cp.duration,
              MIN(cp.price_cents/100.0) as min_price,
              MAX(cp.price_cents/100.0) as max_price,
              AVG(cp.price_cents/100.0)::numeric(10,2) as avg_price
       FROM celebrity_pricing cp
       JOIN celebrity_settings cs ON cp.celebrity_id = cs.celebrity_id
       GROUP BY cs.tier, cp.meeting_type, cp.duration
       ORDER BY cs.tier, cp.meeting_type DESC, cp.duration`,
      { type: QueryTypes.SELECT }
    );

    console.log('Tier | Type     | Duration | Min        | Max        | Avg');
    console.log('-'.repeat(70));
    (distribution as any[]).forEach(row => {
      console.log(
        `${row.tier.padEnd(4)} | ${row.meeting_type.padEnd(8)} | ${String(row.duration).padEnd(8)} | $${Number(row.min_price).toLocaleString().padEnd(9)} | $${Number(row.max_price).toLocaleString().padEnd(9)} | $${Number(row.avg_price).toLocaleString()}`
      );
    });

    console.log('\n✅ All done!\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  regenerateAllPricing();
}

export default regenerateAllPricing;
