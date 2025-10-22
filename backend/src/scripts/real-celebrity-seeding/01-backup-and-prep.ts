/**
 * Step 1: Backup & Preparation Script
 * - Backup staging database
 * - Export existing celebrities to CSV
 * - Truncate celebrity-related tables
 * - Verify clean slate
 */

import sequelize from '../../config/database';
import Celebrity from '../../models/Celebrity';
import { QueryTypes } from 'sequelize';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Output directory for backups and exports
const OUTPUT_DIR = '/tmp/starrymeet_seeding';

/**
 * Ensure output directory exists
 */
function ensureOutputDir(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created output directory: ${OUTPUT_DIR}`);
  }
}

/**
 * Create database backup using pg_dump
 */
async function backupDatabase(): Promise<void> {
  console.log('\n🗄️  Step 1: Creating database backup...');

  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || '5432';
  const dbName = process.env.DB_NAME || 'neondb';
  const dbUser = process.env.DB_USER || 'postgres';
  const dbPassword = process.env.DB_PASSWORD || '';

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(OUTPUT_DIR, `backup_pre_wipe_staging_${timestamp}.dump`);

  // Set PGPASSWORD environment variable for pg_dump
  const env = { ...process.env, PGPASSWORD: dbPassword };

  try {
    const command = `pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -F c -f ${backupFile}`;

    console.log(`📦 Backing up to: ${backupFile}`);
    console.log(`🔗 Database: ${dbHost}:${dbPort}/${dbName}`);

    await execAsync(command, { env, maxBuffer: 1024 * 1024 * 100 }); // 100MB buffer

    const stats = fs.statSync(backupFile);
    console.log(`✅ Backup complete! Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📍 Location: ${backupFile}`);
  } catch (error: any) {
    console.error(`❌ Backup failed: ${error.message}`);
    throw error;
  }
}

/**
 * Export existing celebrities to CSV
 */
async function exportExistingCelebrities(): Promise<void> {
  console.log('\n📤 Step 2: Exporting existing celebrities to CSV...');

  try {
    const celebrities = await Celebrity.findAll({
      attributes: [
        'id',
        'username',
        'display_name',
        'celebrity_code',
        'category',
        'subcategory',
        'niche_category',
        'bio',
        'location',
        'avatar_url',
        'cover_photo_url',
        'quick_meet_price_cents',
        'standard_meet_price_cents',
        'premium_meet_price_cents',
        'response_time_hours',
        'average_rating',
        'total_reviews',
        'total_bookings',
        'is_verified',
        'is_active',
        'is_featured',
        'created_at',
        'updated_at'
      ]
    });

    console.log(`📊 Found ${celebrities.length} existing celebrities`);

    if (celebrities.length === 0) {
      console.log('ℹ️  No existing celebrities to export');
      return;
    }

    // Convert to CSV
    const headers = [
      'id', 'username', 'display_name', 'celebrity_code', 'category', 'subcategory',
      'niche_category', 'bio', 'location', 'avatar_url', 'cover_photo_url',
      'quick_meet_price_cents', 'standard_meet_price_cents', 'premium_meet_price_cents',
      'response_time_hours', 'average_rating', 'total_reviews', 'total_bookings',
      'is_verified', 'is_active', 'is_featured', 'created_at', 'updated_at'
    ];

    const csvRows = [headers.join(',')];

    celebrities.forEach(celeb => {
      const row = headers.map(header => {
        const value = (celeb as any)[header];

        // Escape quotes and wrap in quotes if contains comma or newline
        if (value === null || value === undefined) return '';

        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const csvPath = path.join(OUTPUT_DIR, 'celebrities_existing_staging.csv');

    fs.writeFileSync(csvPath, csvContent, 'utf8');

    console.log(`✅ Exported ${celebrities.length} celebrities to CSV`);
    console.log(`📍 Location: ${csvPath}`);

  } catch (error: any) {
    console.error(`❌ Export failed: ${error.message}`);
    throw error;
  }
}

/**
 * Truncate celebrity-related tables
 */
async function truncateTables(): Promise<void> {
  console.log('\n🗑️  Step 3: Truncating celebrity-related tables...');

  try {
    // Disable foreign key checks temporarily
    await sequelize.query('SET session_replication_role = replica;', { type: QueryTypes.RAW });

    // Truncate tables
    const tablesToTruncate = [
      'celebrities',
      'bookings',
      'reviews',
      'payments'
    ];

    for (const table of tablesToTruncate) {
      console.log(`  🗑️  Truncating ${table}...`);
      await sequelize.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE;`, { type: QueryTypes.RAW });
    }

    // Re-enable foreign key checks
    await sequelize.query('SET session_replication_role = origin;', { type: QueryTypes.RAW });

    console.log('✅ Tables truncated successfully');

  } catch (error: any) {
    console.error(`❌ Truncation failed: ${error.message}`);
    throw error;
  }
}

/**
 * Verify clean slate
 */
async function verifyCleanSlate(): Promise<void> {
  console.log('\n✅ Step 4: Verifying clean slate...');

  try {
    const count = await Celebrity.count();

    if (count === 0) {
      console.log('✅ Verification passed: celebrities table is empty');
    } else {
      console.error(`❌ Verification failed: Found ${count} celebrities (expected 0)`);
      throw new Error('Table not properly truncated');
    }

    // Log verification result
    const logPath = path.join(OUTPUT_DIR, 'truncation_log.txt');
    const logContent = `Truncation completed at: ${new Date().toISOString()}\nCelebrity count: ${count}\n`;
    fs.appendFileSync(logPath, logContent);

  } catch (error: any) {
    console.error(`❌ Verification failed: ${error.message}`);
    throw error;
  }
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  console.log('🚀 Starting Backup & Preparation Process...');
  console.log('⚠️  WARNING: This will backup and then WIPE ALL CELEBRITY DATA from staging!\n');

  // Ensure we're not in production
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ SAFETY CHECK FAILED: Cannot run in production environment!');
    console.error('   Set NODE_ENV to "staging" or "development"');
    process.exit(1);
  }

  try {
    // Create output directory
    ensureOutputDir();

    // Connect to database
    console.log('\n🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Execute steps
    await backupDatabase();
    await exportExistingCelebrities();

    // Ask for confirmation before truncating
    console.log('\n⚠️  WARNING: About to truncate all celebrity-related tables!');
    console.log('   Press Ctrl+C now to cancel, or wait 5 seconds to continue...');

    await new Promise(resolve => setTimeout(resolve, 5000));

    await truncateTables();
    await verifyCleanSlate();

    console.log('\n🎉 Backup & Preparation Complete!');
    console.log(`📁 All outputs saved to: ${OUTPUT_DIR}`);
    console.log('\n✅ Next Step: Run the celebrity seeding script');

  } catch (error: any) {
    console.error('\n❌ Process failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { backupDatabase, exportExistingCelebrities, truncateTables, verifyCleanSlate };
