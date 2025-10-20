/**
 * Sync database with updated Celebrity model
 * Adds new columns: celebrity_code, subcategory, niche_category, response_time_hours
 */

import dotenv from 'dotenv';
import sequelize from '../config/database';
import '../models'; // Import all models

dotenv.config();

async function syncDatabase() {
  try {
    console.log('🔄 Syncing database with updated schema...');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Sync database (alter: true will add new columns without dropping tables)
    await sequelize.sync({ alter: true });
    console.log('✅ Database schema synchronized successfully!');

    console.log('\n📋 New Celebrity table columns added:');
    console.log('  - celebrity_code (unique identifier like FTV-HOL-0001)');
    console.log('  - subcategory (e.g., "Hollywood", "K-Pop")');
    console.log('  - niche_category (e.g., "A-List Stars", "Action Heroes")');
    console.log('  - response_time_hours (1-72 hours)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database sync failed:', error);
    process.exit(1);
  }
}

syncDatabase();
