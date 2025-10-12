import dotenv from 'dotenv';
import sequelize from './config/database';
import { seedCelebrities } from './seeders/celebrities.seed';
import './models'; // Import models to ensure they're loaded

dotenv.config();

async function runSeeds() {
  try {
    console.log('🚀 Starting database seeding...');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized');

    // Run seeders
    await seedCelebrities();

    console.log('🎉 All seeds completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeeds();
