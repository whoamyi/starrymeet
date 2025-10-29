/**
 * Run Auth Migration Script
 *
 * This script runs the authentication system migration to create
 * the users, sessions, user_profiles, and favorites tables.
 */

import sequelize from '../config/database';
import { up } from '../migrations/create-auth-schema';

async function runMigration() {
  try {
    console.log('🔐 Starting authentication system migration...\n');

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
