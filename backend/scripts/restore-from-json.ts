import fs from 'fs';
import path from 'path';
import sequelize from '../src/config/database';
import { User, Celebrity, Booking, Payment, Review } from '../src/models';

async function restoreFromJSON(backupDir: string) {
  console.log('🔄 Starting JSON data restore...\n');

  if (!fs.existsSync(backupDir)) {
    console.error(`❌ Backup directory not found: ${backupDir}`);
    process.exit(1);
  }

  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Read metadata
    const metadataPath = path.join(backupDir, 'metadata.json');
    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
      console.log('📊 Backup metadata:');
      console.log(`   Date: ${metadata.backup_date}`);
      console.log(`   Source DB: ${metadata.database}`);
      console.log(`   Total records: ${metadata.total_records}\n`);
    }

    // Restore Users
    const usersPath = path.join(backupDir, 'users.json');
    if (fs.existsSync(usersPath)) {
      console.log('📥 Restoring users...');
      const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
      if (users.length > 0) {
        await User.bulkCreate(users, { ignoreDuplicates: true });
        console.log(`   ✓ Restored ${users.length} users\n`);
      } else {
        console.log('   ⊘ No users to restore\n');
      }
    }

    // Restore Celebrities
    const celebritiesPath = path.join(backupDir, 'celebrities.json');
    if (fs.existsSync(celebritiesPath)) {
      console.log('📥 Restoring celebrities...');
      const celebrities = JSON.parse(fs.readFileSync(celebritiesPath, 'utf-8'));
      if (celebrities.length > 0) {
        await Celebrity.bulkCreate(celebrities, { ignoreDuplicates: true });
        console.log(`   ✓ Restored ${celebrities.length} celebrities\n`);
      } else {
        console.log('   ⊘ No celebrities to restore\n');
      }
    }

    // Restore Bookings
    const bookingsPath = path.join(backupDir, 'bookings.json');
    if (fs.existsSync(bookingsPath)) {
      console.log('📥 Restoring bookings...');
      const bookings = JSON.parse(fs.readFileSync(bookingsPath, 'utf-8'));
      if (bookings.length > 0) {
        await Booking.bulkCreate(bookings, { ignoreDuplicates: true });
        console.log(`   ✓ Restored ${bookings.length} bookings\n`);
      } else {
        console.log('   ⊘ No bookings to restore\n');
      }
    }

    // Restore Payments
    const paymentsPath = path.join(backupDir, 'payments.json');
    if (fs.existsSync(paymentsPath)) {
      console.log('📥 Restoring payments...');
      const payments = JSON.parse(fs.readFileSync(paymentsPath, 'utf-8'));
      if (payments.length > 0) {
        await Payment.bulkCreate(payments, { ignoreDuplicates: true });
        console.log(`   ✓ Restored ${payments.length} payments\n`);
      } else {
        console.log('   ⊘ No payments to restore\n');
      }
    }

    // Restore Reviews
    const reviewsPath = path.join(backupDir, 'reviews.json');
    if (fs.existsSync(reviewsPath)) {
      console.log('📥 Restoring reviews...');
      const reviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf-8'));
      if (reviews.length > 0) {
        await Review.bulkCreate(reviews, { ignoreDuplicates: true });
        console.log(`   ✓ Restored ${reviews.length} reviews\n`);
      } else {
        console.log('   ⊘ No reviews to restore\n');
      }
    }

    console.log('✅ JSON restore completed successfully!\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error restoring data:', error);
    await sequelize.close();
    process.exit(1);
  }
}

// Get backup directory from command line argument
const backupDir = process.argv[2];

if (!backupDir) {
  console.error('❌ Please provide backup directory path');
  console.log('Usage: npm run restore-json <backup-directory>');
  console.log('Example: npm run restore-json backups/json_export_2025-01-21_10-15-30');
  process.exit(1);
}

restoreFromJSON(backupDir);
