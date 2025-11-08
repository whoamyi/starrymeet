/**
 * Run Applications Migration Script
 *
 * This script runs the meeting applications migration to create
 * the meeting_applications table.
 */

import sequelize from '../config/database';
import { up } from '../migrations/create-meeting-applications';

async function runMigration() {
  try {
    console.log('📝 Starting meeting applications migration...\n');

    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    // Run migration
    await up(sequelize.getQueryInterface());

    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
