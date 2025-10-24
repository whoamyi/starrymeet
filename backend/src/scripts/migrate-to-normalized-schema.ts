/**
 * Data Migration Script: Old Schema → New Normalized Schema
 *
 * Transfers 7,612 celebrities from old monolithic table to new normalized structure
 */

import sequelize from '../config/database';

async function migrateData() {
  const transaction = await sequelize.transaction();

  try {
    console.log('🔄 Starting data migration from old schema to new...\n');
    console.log('=' .repeat(60));

    // ============================================
    // STEP 1: Seed default categories
    // ============================================
    console.log('\n📁 STEP 1: Seeding categories...');

    const categories = [
      { name: 'Actor', parent_category: 'Entertainer', slug: 'actor' },
      { name: 'Singer', parent_category: 'Entertainer', slug: 'singer' },
      { name: 'Musician', parent_category: 'Entertainer', slug: 'musician' },
      { name: 'Rapper', parent_category: 'Entertainer', slug: 'rapper' },
      { name: 'Comedian', parent_category: 'Entertainer', slug: 'comedian' },
      { name: 'Film Director', parent_category: 'Entertainer', slug: 'film-director' },
      { name: 'Producer', parent_category: 'Entertainer', slug: 'producer' },
      { name: 'Model', parent_category: 'Entertainer', slug: 'model' },
      { name: 'Dancer', parent_category: 'Entertainer', slug: 'dancer' },

      { name: 'Soccer Player', parent_category: 'Athlete', slug: 'soccer-player' },
      { name: 'Basketball Player', parent_category: 'Athlete', slug: 'basketball-player' },
      { name: 'Tennis Player', parent_category: 'Athlete', slug: 'tennis-player' },
      { name: 'American Football Player', parent_category: 'Athlete', slug: 'american-football-player' },
      { name: 'Baseball Player', parent_category: 'Athlete', slug: 'baseball-player' },
      { name: 'Boxer', parent_category: 'Athlete', slug: 'boxer' },
      { name: 'MMA Fighter', parent_category: 'Athlete', slug: 'mma-fighter' },
      { name: 'Golfer', parent_category: 'Athlete', slug: 'golfer' },
      { name: 'Racing Driver', parent_category: 'Athlete', slug: 'racing-driver' },

      { name: 'YouTuber', parent_category: 'Creator', slug: 'youtuber' },
      { name: 'Social Media Influencer', parent_category: 'Creator', slug: 'influencer' },
      { name: 'Content Creator', parent_category: 'Creator', slug: 'content-creator' },
      { name: 'Podcaster', parent_category: 'Creator', slug: 'podcaster' },
      { name: 'Photographer', parent_category: 'Creator', slug: 'photographer' },

      { name: 'Entrepreneur', parent_category: 'Business', slug: 'entrepreneur' },
      { name: 'Author', parent_category: 'Business', slug: 'author' },
      { name: 'Chef', parent_category: 'Business', slug: 'chef' },
      { name: 'Journalist', parent_category: 'Business', slug: 'journalist' },

      { name: 'Politician', parent_category: 'PublicFigure', slug: 'politician' },
      { name: 'TV Host', parent_category: 'PublicFigure', slug: 'tv-host' },
      { name: 'Public Figure', parent_category: 'PublicFigure', slug: 'public-figure' },

      { name: 'Other', parent_category: 'Other', slug: 'other' }
    ];

    await sequelize.query(`
      INSERT INTO categories (name, parent_category, slug, created_at, updated_at)
      VALUES ${categories.map(c =>
        `('${c.name}', '${c.parent_category}', '${c.slug}', NOW(), NOW())`
      ).join(', ')}
      ON CONFLICT (slug) DO NOTHING
    `, { transaction });

    console.log(`✅ Seeded ${categories.length} categories`);

    // ============================================
    // STEP 2: Seed global cities
    // ============================================
    console.log('\n🌍 STEP 2: Seeding global cities...');

    const cities = [
      { name: 'New York', country: 'United States', timezone: 'America/New_York', region: 'North America' },
      { name: 'Los Angeles', country: 'United States', timezone: 'America/Los_Angeles', region: 'North America' },
      { name: 'London', country: 'United Kingdom', timezone: 'Europe/London', region: 'Europe' },
      { name: 'Paris', country: 'France', timezone: 'Europe/Paris', region: 'Europe' },
      { name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', region: 'Asia' },
      { name: 'Dubai', country: 'United Arab Emirates', timezone: 'Asia/Dubai', region: 'Middle East' },
      { name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', region: 'Asia' },
      { name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', region: 'Oceania' },
      { name: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong', region: 'Asia' },
      { name: 'Toronto', country: 'Canada', timezone: 'America/Toronto', region: 'North America' },
      { name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', region: 'Europe' },
      { name: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid', region: 'Europe' },
      { name: 'Rome', country: 'Italy', timezone: 'Europe/Rome', region: 'Europe' },
      { name: 'Miami', country: 'United States', timezone: 'America/New_York', region: 'North America' },
      { name: 'Las Vegas', country: 'United States', timezone: 'America/Los_Angeles', region: 'North America' }
    ];

    await sequelize.query(`
      INSERT INTO cities (name, country, timezone, region, is_active, created_at, updated_at)
      VALUES ${cities.map(c =>
        `('${c.name}', '${c.country}', '${c.timezone}', '${c.region}', true, NOW(), NOW())`
      ).join(', ')}
    `, { transaction });

    console.log(`✅ Seeded ${cities.length} global cities`);

    // ============================================
    // STEP 3: Migrate celebrities
    // ============================================
    console.log('\n⭐ STEP 3: Migrating celebrities...');

    // Get "Other" category ID as default
    const [otherCategoryResult]: any = await sequelize.query(
      `SELECT id FROM categories WHERE slug = 'other' LIMIT 1`,
      { transaction }
    );
    const otherCategoryId = otherCategoryResult[0]?.id;

    // Transfer all celebrities from old table to new
    await sequelize.query(`
      INSERT INTO celebrities_new (
        id, name, slug, category_id, country, bio, verified, avatar_url,
        min_price, review_rate, review_count, status, created_at, updated_at
      )
      SELECT
        id,
        display_name as name,
        username as slug,
        ${otherCategoryId} as category_id,  -- Default to "Other" for now
        CASE
          WHEN location LIKE '%, %' THEN TRIM(SUBSTRING(location FROM POSITION(',' IN location) + 1))
          ELSE location
        END as country,
        CASE WHEN bio = 'Other' THEN NULL ELSE bio END as bio,
        is_verified as verified,
        avatar_url,
        LEAST(
          COALESCE(virtual_quick_meet_price_cents, 999999999),
          COALESCE(virtual_standard_meet_price_cents, 999999999),
          COALESCE(virtual_premium_meet_price_cents, 999999999),
          COALESCE(quick_meet_price_cents, 999999999),
          COALESCE(standard_meet_price_cents, 999999999),
          COALESCE(premium_meet_price_cents, 999999999)
        ) / 100.0 as min_price,
        average_rating as review_rate,
        total_reviews as review_count,
        'active' as status,
        created_at,
        updated_at
      FROM celebrities
    `, { transaction });

    const [celebCountResult]: any = await sequelize.query(
      `SELECT COUNT(*) as count FROM celebrities_new`,
      { transaction }
    );
    console.log(`✅ Migrated ${celebCountResult[0].count} celebrities`);

    // ============================================
    // STEP 4: Create celebrity_settings
    // ============================================
    console.log('\n⚙️  STEP 4: Creating celebrity_settings...');

    await sequelize.query(`
      INSERT INTO celebrity_settings (
        celebrity_id, tier, max_monthly_slots, slot_scarcity_mode,
        timezone, allow_virtual, allow_physical, rotation_cooldown_days,
        created_at, updated_at
      )
      SELECT
        id as celebrity_id,
        'D' as tier,  -- Default tier, will enrich later
        10 as max_monthly_slots,
        'medium' as slot_scarcity_mode,
        'America/New_York' as timezone,
        true as allow_virtual,
        true as allow_physical,
        90 as rotation_cooldown_days,
        NOW() as created_at,
        NOW() as updated_at
      FROM celebrities_new
    `, { transaction });

    console.log(`✅ Created settings for all celebrities`);

    // ============================================
    // STEP 5: Migrate pricing
    // ============================================
    console.log('\n💰 STEP 5: Migrating pricing...');

    // Virtual pricing
    await sequelize.query(`
      INSERT INTO celebrity_pricing (
        celebrity_id, meeting_type, duration, price_cents, currency, is_active, created_at, updated_at
      )
      SELECT id, 'virtual'::enum_celebrity_pricing_meeting_type, 15, virtual_quick_meet_price_cents, 'USD', true, NOW(), NOW()
      FROM celebrities WHERE virtual_quick_meet_price_cents > 0
      UNION ALL
      SELECT id, 'virtual'::enum_celebrity_pricing_meeting_type, 30, virtual_standard_meet_price_cents, 'USD', true, NOW(), NOW()
      FROM celebrities WHERE virtual_standard_meet_price_cents > 0
      UNION ALL
      SELECT id, 'virtual'::enum_celebrity_pricing_meeting_type, 60, virtual_premium_meet_price_cents, 'USD', true, NOW(), NOW()
      FROM celebrities WHERE virtual_premium_meet_price_cents > 0
    `, { transaction });

    // Physical pricing
    await sequelize.query(`
      INSERT INTO celebrity_pricing (
        celebrity_id, meeting_type, duration, price_cents, currency, is_active, created_at, updated_at
      )
      SELECT id, 'physical'::enum_celebrity_pricing_meeting_type, 15, quick_meet_price_cents, 'USD', true, NOW(), NOW()
      FROM celebrities WHERE quick_meet_price_cents > 0
      UNION ALL
      SELECT id, 'physical'::enum_celebrity_pricing_meeting_type, 30, standard_meet_price_cents, 'USD', true, NOW(), NOW()
      FROM celebrities WHERE standard_meet_price_cents > 0
      UNION ALL
      SELECT id, 'physical'::enum_celebrity_pricing_meeting_type, 60, premium_meet_price_cents, 'USD', true, NOW(), NOW()
      FROM celebrities WHERE premium_meet_price_cents > 0
    `, { transaction });

    const [pricingCountResult]: any = await sequelize.query(
      `SELECT COUNT(*) as count FROM celebrity_pricing`,
      { transaction }
    );
    console.log(`✅ Created ${pricingCountResult[0].count} pricing records`);

    // ============================================
    // STEP 6: Create reviews summary
    // ============================================
    console.log('\n⭐ STEP 6: Creating celebrity_reviews...');

    await sequelize.query(`
      INSERT INTO celebrity_reviews (
        celebrity_id, review_rate_average, review_count, review_snippet, created_at, updated_at
      )
      SELECT
        id as celebrity_id,
        average_rating as review_rate_average,
        total_reviews as review_count,
        NULL as review_snippet,
        NOW() as created_at,
        NOW() as updated_at
      FROM celebrities
    `, { transaction });

    console.log(`✅ Created review summaries for all celebrities`);

    // ============================================
    // STEP 7: Create media records
    // ============================================
    console.log('\n📸 STEP 7: Creating celebrity_media...');

    await sequelize.query(`
      INSERT INTO celebrity_media (
        celebrity_id, media_type, url, thumbnail_url, display_order, is_primary, created_at, updated_at
      )
      SELECT
        id as celebrity_id,
        'avatar'::enum_celebrity_media_media_type as media_type,
        avatar_url as url,
        avatar_url as thumbnail_url,
        1 as display_order,
        true as is_primary,
        NOW() as created_at,
        NOW() as updated_at
      FROM celebrities
      WHERE avatar_url IS NOT NULL
    `, { transaction });

    const [mediaCountResult]: any = await sequelize.query(
      `SELECT COUNT(*) as count FROM celebrity_media`,
      { transaction }
    );
    console.log(`✅ Created ${mediaCountResult[0].count} media records`);

    // ============================================
    // COMMIT TRANSACTION
    // ============================================
    await transaction.commit();

    console.log('\n' + '='.repeat(60));
    console.log('🎉 MIGRATION COMPLETE!');
    console.log('='.repeat(60));
    console.log('\n📊 Summary:');
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Cities: ${cities.length}`);
    console.log(`   Celebrities: ${celebCountResult[0].count}`);
    console.log(`   Pricing records: ${pricingCountResult[0].count}`);
    console.log(`   Media records: ${mediaCountResult[0].count}`);
    console.log('\n✅ Old data preserved in "celebrities" table');
    console.log('✅ New data in normalized tables (celebrities_new, etc.)');
    console.log('\n📝 Next steps:');
    console.log('   1. Run enrichment to fix categories, bios, images, tiers');
    console.log('   2. Verify data integrity');
    console.log('   3. Rename celebrities_new → celebrities (drop old)');
    console.log('');

  } catch (error: any) {
    await transaction.rollback();
    console.error('\n❌ Migration failed:', error.message);
    console.error(error.stack);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run migration
if (require.main === module) {
  migrateData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default migrateData;
