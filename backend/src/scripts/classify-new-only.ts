/**
 * Classify ONLY newly inserted celebrities (from today)
 *
 * This script only processes celebrities inserted today that need classification.
 * It updates:
 * - Bio (from Wikipedia)
 * - Avatar/image (from Wikipedia/Cloudinary)
 * - Category/profession
 * - Tier (S/A/B/C/D based on fame logic)
 * - Pricing (based on tier)
 */

import sequelize from '../config/database';
import { QueryTypes } from 'sequelize';
import { execSync } from 'child_process';

async function classifyNewCelebrities() {
  try {
    console.log('\n🎯 Classifying ONLY New Celebrities (inserted today)...\n');
    console.log('============================================================\n');

    // Count new celebrities that need classification
    const newCelebrities = await sequelize.query(
      `SELECT COUNT(*) as count FROM celebrities_new
       WHERE created_at > '2025-10-23'::date
       AND (bio IS NULL OR bio = '' OR avatar_url IS NULL OR avatar_url = '')`,
      { type: QueryTypes.SELECT }
    );

    const count = (newCelebrities[0] as any).count;
    console.log(`📊 Found ${count} new celebrities needing classification\n`);

    if (count === 0) {
      console.log('✅ All new celebrities already classified!');
      await sequelize.close();
      return;
    }

    // Close database connection before running classification
    await sequelize.close();

    // Run classification with date filter
    console.log('🚀 Starting classification agent with date filter...\n');

    // Set environment variable to filter by date
    process.env.CLASSIFY_DATE_FILTER = '2025-10-23';

    execSync('npm run classify:celebrities', {
      stdio: 'inherit',
      env: { ...process.env, CLASSIFY_DATE_FILTER: '2025-10-23' }
    });

    console.log('\n✅ Classification complete!\n');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

classifyNewCelebrities().catch(console.error);
