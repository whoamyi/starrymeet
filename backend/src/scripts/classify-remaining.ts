/**
 * Classify Remaining Celebrities
 * Only processes celebrities without tier in celebrity_settings
 */

import sequelize from '../config/database';
import { QueryTypes } from 'sequelize';

async function main() {
  try {
    console.log('🔍 Finding unclassified celebrities...');

    // Get count of unclassified
    const [{ count }] = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM celebrities_new c
      LEFT JOIN celebrity_settings cs ON c.id = cs.celebrity_id
      WHERE c.status = 'active' AND cs.tier IS NULL
    `, { type: QueryTypes.SELECT }) as any;

    console.log(`📊 Found ${count} unclassified celebrities\n`);

    if (count === 0) {
      console.log('✅ All celebrities are already classified!');
      process.exit(0);
    }

    // Get the unclassified celebrity names to set DATE_FILTER
    const unclassified = await sequelize.query(`
      SELECT c.created_at
      FROM celebrities_new c
      LEFT JOIN celebrity_settings cs ON c.id = cs.celebrity_id
      WHERE c.status = 'active' AND cs.tier IS NULL
      ORDER BY c.created_at ASC
      LIMIT 1
    `, { type: QueryTypes.SELECT }) as any;

    const oldestUnclassified = unclassified[0]?.created_at;

    if (oldestUnclassified) {
      const dateFilter = new Date(oldestUnclassified).toISOString().split('T')[0];
      console.log(`📅 Using DATE_FILTER: ${dateFilter}`);
      console.log('🚀 Starting classification agent...\n');

      // Import and run the classification agent
      const classificationAgent = require('./classification-agent').default;

      // Set environment variable for date filter
      process.env.CLASSIFY_DATE_FILTER = dateFilter;

      await classificationAgent();
    } else {
      console.log('❌ Could not determine date filter');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export default main;
