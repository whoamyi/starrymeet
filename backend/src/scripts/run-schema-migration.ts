/**
 * Schema Migration Runner
 */

import sequelize from '../config/database';
import * as schemaMigration from '../migrations/create-normalized-schema';

async function runMigration() {
  try {
    console.log('🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Connected\n');

    console.log('🏗️  Creating normalized schema...');
    await schemaMigration.up(sequelize.getQueryInterface());
    console.log('\n✅ Schema creation complete!\n');

    await sequelize.close();
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Schema migration failed:', error.message);
    console.error(error.stack);
    await sequelize.close();
    process.exit(1);
  }
}

runMigration();
