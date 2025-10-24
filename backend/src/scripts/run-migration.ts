/**
 * Simple migration runner
 */

import sequelize from '../config/database';
import * as availabilityMigration from '../migrations/create-availability-system';

async function runMigration() {
  try {
    console.log('🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Connected\n');

    console.log('🔄 Running availability system migration...');
    await availabilityMigration.up(sequelize.getQueryInterface());
    console.log('✅ Migration complete!\n');

    await sequelize.close();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    await sequelize.close();
    process.exit(1);
  }
}

runMigration();
