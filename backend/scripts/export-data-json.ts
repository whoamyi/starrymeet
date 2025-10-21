import fs from 'fs';
import path from 'path';
import sequelize from '../src/config/database';
import { User, Celebrity, Booking, Payment, Review } from '../src/models';

async function exportDataToJSON() {
  console.log('🔄 Starting JSON data export...\n');

  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Create backup directory with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' +
                      new Date().toISOString().split('T')[1].split('.')[0].replace(/:/g, '');
    const backupDir = path.join(__dirname, '..', 'backups', `json_export_${timestamp}`);

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    console.log(`📁 Backup directory: ${backupDir}\n`);

    // Export Users
    console.log('📥 Exporting users...');
    const users = await User.findAll({ raw: true });
    fs.writeFileSync(
      path.join(backupDir, 'users.json'),
      JSON.stringify(users, null, 2)
    );
    console.log(`   ✓ Exported ${users.length} users\n`);

    // Export Celebrities
    console.log('📥 Exporting celebrities...');
    const celebrities = await Celebrity.findAll({ raw: true });
    fs.writeFileSync(
      path.join(backupDir, 'celebrities.json'),
      JSON.stringify(celebrities, null, 2)
    );
    console.log(`   ✓ Exported ${celebrities.length} celebrities\n`);

    // Export Bookings
    console.log('📥 Exporting bookings...');
    const bookings = await Booking.findAll({ raw: true });
    fs.writeFileSync(
      path.join(backupDir, 'bookings.json'),
      JSON.stringify(bookings, null, 2)
    );
    console.log(`   ✓ Exported ${bookings.length} bookings\n`);

    // Export Payments
    console.log('📥 Exporting payments...');
    const payments = await Payment.findAll({ raw: true });
    fs.writeFileSync(
      path.join(backupDir, 'payments.json'),
      JSON.stringify(payments, null, 2)
    );
    console.log(`   ✓ Exported ${payments.length} payments\n`);

    // Export Reviews
    console.log('📥 Exporting reviews...');
    const reviews = await Review.findAll({ raw: true });
    fs.writeFileSync(
      path.join(backupDir, 'reviews.json'),
      JSON.stringify(reviews, null, 2)
    );
    console.log(`   ✓ Exported ${reviews.length} reviews\n`);

    // Create backup metadata
    const metadata = {
      backup_date: new Date().toISOString(),
      database: process.env.DB_NAME || 'starrymeet_dev',
      counts: {
        users: users.length,
        celebrities: celebrities.length,
        bookings: bookings.length,
        payments: payments.length,
        reviews: reviews.length
      },
      total_records: users.length + celebrities.length + bookings.length + payments.length + reviews.length
    };

    fs.writeFileSync(
      path.join(backupDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    console.log('✅ JSON export completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   Total records: ${metadata.total_records}`);
    console.log(`   Location: ${backupDir}\n`);

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error exporting data:', error);
    await sequelize.close();
    process.exit(1);
  }
}

exportDataToJSON();
