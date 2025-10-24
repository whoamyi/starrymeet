/**
 * Insert Round 2 Celebrities and Auto-Classify
 *
 * This script:
 * 1. Reads the enhanced-young-celebrities-round2.json file
 * 2. Inserts them into the database with default values
 * 3. Automatically runs classification on the new entries
 */

import sequelize from '../../config/database';
import { QueryTypes } from 'sequelize';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface CelebrityCandidate {
  name: string;
  source: string;
  birthYear?: number;
  occupation?: string;
  country?: string;
  followers?: number;
  isDeceased?: boolean;
}

async function insertRound2Celebrities() {
  console.log('\n🚀 Inserting Round 2 Celebrities...\n');
  console.log('============================================================\n');

  try {
    // 1. Read the JSON file
    const jsonPath = path.join(__dirname, '../../../database/seeds/enhanced-young-celebrities-round2.json');

    if (!fs.existsSync(jsonPath)) {
      console.error('❌ No celebrity JSON file found!');
      console.log('   File expected: enhanced-young-celebrities-round2.json');
      process.exit(1);
    }

    console.log(`📁 Using file: ${path.basename(jsonPath)}\n`);

    const candidates: CelebrityCandidate[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(`📋 Loaded ${candidates.length} celebrity candidates\n`);

    // 2. Get default category (Public Figure)
    const defaultCategory = await sequelize.query(
      `SELECT id FROM categories WHERE slug = 'public-figure' LIMIT 1`,
      { type: QueryTypes.SELECT }
    );

    const categoryId = (defaultCategory[0] as any)?.id || null;

    if (!categoryId) {
      console.error('❌ Default category not found!');
      process.exit(1);
    }

    // 3. Insert celebrities in batches
    const batchSize = 50;
    let inserted = 0;
    let skipped = 0;

    console.log('💾 Inserting celebrities into database...\n');

    for (let i = 0; i < candidates.length; i += batchSize) {
      const batch = candidates.slice(i, i + batchSize);

      for (const candidate of batch) {
        try {
          // Generate slug
          const slug = candidate.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

          // Check if already exists
          const existing = await sequelize.query(
            `SELECT COUNT(*) as count FROM celebrities_new WHERE slug = :slug`,
            {
              replacements: { slug },
              type: QueryTypes.SELECT
            }
          );

          if ((existing[0] as any).count > 0) {
            skipped++;
            continue;
          }

          // Insert celebrity
          await sequelize.query(
            `INSERT INTO celebrities_new (
              id,
              name,
              slug,
              category_id,
              bio,
              country,
              verified,
              min_price,
              status,
              created_at,
              updated_at
            ) VALUES (
              gen_random_uuid(),
              :name,
              :slug,
              :categoryId,
              :bio,
              :country,
              false,
              5000,
              'active',
              NOW(),
              NOW()
            )`,
            {
              replacements: {
                name: candidate.name,
                slug: slug,
                categoryId: categoryId,
                bio: `${candidate.occupation || 'Celebrity'} known for their work in entertainment.`,
                country: candidate.country || null
              },
              type: QueryTypes.INSERT
            }
          );

          // Get the inserted celebrity ID
          const newCelebrity = await sequelize.query(
            `SELECT id FROM celebrities_new WHERE slug = :slug`,
            {
              replacements: { slug },
              type: QueryTypes.SELECT
            }
          );

          const celebId = (newCelebrity[0] as any)?.id;

          if (celebId) {
            // Insert default settings
            await sequelize.query(
              `INSERT INTO celebrity_settings (
                celebrity_id,
                tier,
                max_monthly_slots,
                allow_virtual,
                allow_physical,
                created_at,
                updated_at
              ) VALUES (
                :celebId,
                'D',
                10,
                true,
                true,
                NOW(),
                NOW()
              )`,
              {
                replacements: { celebId },
                type: QueryTypes.INSERT
              }
            );

            // Insert default pricing
            const defaultPricing = [
              { meeting_type: 'virtual', duration: 5, price_cents: 5000 },
              { meeting_type: 'virtual', duration: 15, price_cents: 10000 },
              { meeting_type: 'virtual', duration: 30, price_cents: 15000 },
              { meeting_type: 'physical', duration: 30, price_cents: 50000 },
              { meeting_type: 'physical', duration: 60, price_cents: 100000 }
            ];

            for (const pricing of defaultPricing) {
              await sequelize.query(
                `INSERT INTO celebrity_pricing (
                  celebrity_id,
                  meeting_type,
                  duration,
                  price_cents,
                  created_at,
                  updated_at
                ) VALUES (
                  :celebId,
                  :meetingType,
                  :duration,
                  :priceCents,
                  NOW(),
                  NOW()
                )`,
                {
                  replacements: {
                    celebId,
                    meetingType: pricing.meeting_type,
                    duration: pricing.duration,
                    priceCents: pricing.price_cents
                  },
                  type: QueryTypes.INSERT
                }
              );
            }
          }

          inserted++;

          if (inserted % 50 === 0) {
            console.log(`   Inserted: ${inserted}/${candidates.length}`);
          }

        } catch (error: any) {
          console.error(`   ⚠️  Failed to insert ${candidate.name}:`, error.message);
          skipped++;
        }
      }
    }

    console.log('\n============================================================');
    console.log('✅ ROUND 2 INSERTION COMPLETE!\n');
    console.log('📊 Summary:');
    console.log(`   Total candidates: ${candidates.length}`);
    console.log(`   Successfully inserted: ${inserted}`);
    console.log(`   Skipped: ${skipped}`);

    // 4. Now run classification on Round 2 celebrities
    console.log('\n🔄 Starting automatic classification for Round 2...\n');
    console.log('This will classify all newly inserted Round 2 celebrities.');
    console.log('The classification agent will:');
    console.log('  - Fetch Wikipedia data (bio, images, categories)');
    console.log('  - Detect profession and assign correct category');
    console.log('  - Determine tier (B/C/D) based on fame level');
    console.log('  - Set appropriate pricing');
    console.log('\n============================================================\n');

    // Close the database connection
    await sequelize.close();

    // Run classification agent with date filter for today
    console.log('Running: CLASSIFY_DATE_FILTER=2025-10-24 npm run classify:celebrities\n');
    execSync('CLASSIFY_DATE_FILTER=2025-10-24 npm run classify:celebrities', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '../../../')
    });

  } catch (error) {
    console.error('❌ Error during Round 2 insertion:', error);
    throw error;
  }
}

// Run insertion
insertRound2Celebrities().catch(console.error);
