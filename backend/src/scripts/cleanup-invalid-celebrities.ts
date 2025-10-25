/**
 * Cleanup Invalid Celebrity Entries
 * Removes non-celebrity Wikipedia articles that were incorrectly scraped
 */

import sequelize from '../config/database';
import { QueryTypes } from 'sequelize';

// Patterns that indicate non-celebrity entries
const INVALID_PATTERNS = [
  // Year/season patterns
  /^\d{4}[–-]\d{2}\s+in\s+/i,           // "2022–23 in skiing"
  /^\d{4}\s+in\s+/i,                     // "2024 in sports"

  // Encyclopedia/reference patterns
  /^Glossary\s+of\s+/i,                  // "Glossary of..."
  /^List\s+of\s+/i,                      // "List of..."
  /^Index\s+of\s+/i,                     // "Index of..."
  /^Timeline\s+of\s+/i,                  // "Timeline of..."
  /^History\s+of\s+/i,                   // "History of..."
  /^Outline\s+of\s+/i,                   // "Outline of..."
  /^Category:/i,                         // "Category:..."

  // Generic/non-person patterns
  /\(disambiguation\)/i,                 // "Name (disambiguation)"
  /\(band\s+lineup\)/i,                  // Band lineups, not individuals
  /^Deaths\s+in\s+\d{4}/i,              // "Deaths in 2024"
  /^Births\s+in\s+\d{4}/i,              // "Births in 2024"
];

// Additional name-based filters
const INVALID_KEYWORDS = [
  'glossary',
  'timeline',
  'history of',
  'list of',
  'index of',
  'outline of',
  'deaths in',
  'births in',
];

async function cleanupInvalidCelebrities() {
  console.log('🧹 Starting cleanup of invalid celebrity entries...\n');

  try {
    // Get all celebrity names
    const celebrities = await sequelize.query(
      `SELECT id, name FROM celebrities_new WHERE status = 'active'`,
      { type: QueryTypes.SELECT }
    ) as { id: string; name: string }[];

    console.log(`📊 Checking ${celebrities.length} active celebrities...\n`);

    const toDelete: { id: string; name: string; reason: string }[] = [];

    // Check each celebrity against patterns
    for (const celeb of celebrities) {
      // Check regex patterns
      for (const pattern of INVALID_PATTERNS) {
        if (pattern.test(celeb.name)) {
          toDelete.push({
            id: celeb.id,
            name: celeb.name,
            reason: `Matched pattern: ${pattern.source}`
          });
          break;
        }
      }

      // Check keyword patterns
      const lowerName = celeb.name.toLowerCase();
      for (const keyword of INVALID_KEYWORDS) {
        if (lowerName.includes(keyword)) {
          toDelete.push({
            id: celeb.id,
            name: celeb.name,
            reason: `Contains keyword: ${keyword}`
          });
          break;
        }
      }
    }

    console.log(`\n❌ Found ${toDelete.length} invalid entries:\n`);

    // Preview what will be deleted
    toDelete.slice(0, 20).forEach((item, i) => {
      console.log(`${i + 1}. "${item.name}" - ${item.reason}`);
    });

    if (toDelete.length > 20) {
      console.log(`... and ${toDelete.length - 20} more`);
    }

    // Confirm deletion
    console.log(`\n⚠️  About to mark ${toDelete.length} entries as hidden...`);

    // Mark as hidden instead of deleting
    const ids = toDelete.map(item => item.id);

    if (ids.length > 0) {
      // Process in batches to avoid query size limits
      const batchSize = 100;
      let updated = 0;

      for (let i = 0; i < ids.length; i += batchSize) {
        const batch = ids.slice(i, i + batchSize);

        await sequelize.query(
          `UPDATE celebrities_new
           SET status = 'hidden',
               updated_at = NOW()
           WHERE id = ANY($1::uuid[])`,
          {
            bind: [batch],
            type: QueryTypes.UPDATE
          }
        );

        updated += batch.length;
        console.log(`  Processed ${updated}/${ids.length}...`);
      }

      console.log(`\n✅ Successfully marked ${toDelete.length} invalid entries as hidden`);

      // Update count
      const countResult = await sequelize.query(
        `SELECT COUNT(*) as total FROM celebrities_new WHERE status = 'active'`,
        { type: QueryTypes.SELECT }
      ) as { total: number }[];

      console.log(`📊 Remaining active celebrities: ${countResult[0].total}`);
    } else {
      console.log('\n✅ No invalid entries found!');
    }

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run cleanup
cleanupInvalidCelebrities()
  .then(() => {
    console.log('\n✨ Cleanup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
