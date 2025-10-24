/**
 * Migration: Create Normalized Celebrity Database Schema
 *
 * This creates a clean relational structure with proper separation of concerns:
 * - celebrities: Core identity only
 * - celebrity_settings: Backend logic (tier, scarcity)
 * - celebrity_pricing: Multi-duration pricing
 * - celebrity_location_pool: Rotating city logic
 * - celebrity_availability: Generated slots
 * - celebrity_reviews: Social proof
 * - celebrity_media: Photos/videos
 * - categories: Profession tags
 * - cities: Global city list
 */

import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  console.log('🏗️  Creating normalized celebrity database schema...\n');

  // ============================================
  // 1. CATEGORIES TABLE
  // ============================================
  console.log('📁 Creating categories table...');
  await queryInterface.createTable('categories', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'e.g., Actor, Musician, Athlete, etc.'
    },
    parent_category: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'e.g., Entertainer, Athlete, Creator, Business, PublicFigure'
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });
  console.log('✅ Categories table created\n');

  // ============================================
  // 2. CITIES TABLE
  // ============================================
  console.log('🌍 Creating cities table...');
  await queryInterface.createTable('cities', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'e.g., New York, London, Tokyo'
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Normalized country name'
    },
    timezone: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'e.g., America/New_York'
    },
    region: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'e.g., North America, Europe, Asia'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });

  await queryInterface.addIndex('cities', ['country'], {
    name: 'idx_cities_country'
  });

  console.log('✅ Cities table created\n');

  // ============================================
  // 3. CELEBRITIES TABLE (Core Identity)
  // ============================================
  console.log('⭐ Creating celebrities_new table...');
  await queryInterface.createTable('celebrities_new', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Full celebrity name'
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      comment: 'URL-friendly slug for profile'
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Origin country (normalized)'
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Short biography'
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Verified badge'
    },
    avatar_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Main profile photo'
    },
    min_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Lowest meeting price in USD'
    },
    review_rate: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      comment: 'Average rating (e.g., 4.7)'
    },
    review_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Total number of reviews'
    },
    status: {
      type: DataTypes.ENUM('active', 'paused', 'hidden'),
      allowNull: false,
      defaultValue: 'active'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });

  await queryInterface.addIndex('celebrities_new', ['slug'], {
    name: 'idx_celebrities_new_slug',
    unique: true
  });

  await queryInterface.addIndex('celebrities_new', ['category_id'], {
    name: 'idx_celebrities_new_category'
  });

  await queryInterface.addIndex('celebrities_new', ['status'], {
    name: 'idx_celebrities_new_status'
  });

  console.log('✅ Celebrities_new table created\n');

  // ============================================
  // 4. CELEBRITY_SETTINGS TABLE
  // ============================================
  console.log('⚙️  Creating celebrity_settings table...');
  await queryInterface.createTable('celebrity_settings', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    celebrity_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'celebrities_new',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    tier: {
      type: DataTypes.ENUM('S', 'A', 'B', 'C', 'D'),
      allowNull: false,
      defaultValue: 'D',
      comment: 'Fame tier: S=mega, A=elite, B=high, C=mid, D=emerging'
    },
    max_monthly_slots: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      comment: 'Maximum slots per month'
    },
    slot_scarcity_mode: {
      type: DataTypes.ENUM('ultra', 'low', 'medium', 'high'),
      allowNull: false,
      defaultValue: 'medium',
      comment: 'Controls slot availability probability'
    },
    timezone: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Celebrity timezone for scheduling'
    },
    allow_virtual: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    allow_physical: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    rotation_cooldown_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 90,
      comment: 'Days before city can be reused'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });

  await queryInterface.addIndex('celebrity_settings', ['celebrity_id'], {
    name: 'idx_celebrity_settings_celebrity',
    unique: true
  });

  await queryInterface.addIndex('celebrity_settings', ['tier'], {
    name: 'idx_celebrity_settings_tier'
  });

  console.log('✅ Celebrity_settings table created\n');

  // ============================================
  // 5. CELEBRITY_PRICING TABLE
  // ============================================
  console.log('💰 Creating celebrity_pricing table...');
  await queryInterface.createTable('celebrity_pricing', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    celebrity_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'celebrities_new',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    meeting_type: {
      type: DataTypes.ENUM('virtual', 'physical'),
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Duration in minutes: 15, 30, 60'
    },
    price_cents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Price in cents (USD)'
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });

  await queryInterface.addIndex('celebrity_pricing', ['celebrity_id', 'meeting_type', 'duration'], {
    name: 'idx_celebrity_pricing_lookup',
    unique: true
  });

  console.log('✅ Celebrity_pricing table created\n');

  // ============================================
  // 6. CELEBRITY_LOCATION_POOL TABLE
  // ============================================
  console.log('📍 Creating celebrity_location_pool table...');
  await queryInterface.createTable('celebrity_location_pool', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    celebrity_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'celebrities_new',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cities',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    priority_weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Higher = more likely to be selected'
    },
    last_used: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Last time this city was used for this celebrity'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });

  await queryInterface.addIndex('celebrity_location_pool', ['celebrity_id', 'city_id'], {
    name: 'idx_location_pool_celebrity_city',
    unique: true
  });

  console.log('✅ Celebrity_location_pool table created\n');

  // ============================================
  // 7. CELEBRITY_REVIEWS TABLE
  // ============================================
  console.log('⭐ Creating celebrity_reviews table...');
  await queryInterface.createTable('celebrity_reviews', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    celebrity_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'celebrities_new',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    review_rate_average: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      comment: 'Average rating (e.g., 4.7)'
    },
    review_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    review_snippet: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Featured review or summary'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });

  console.log('✅ Celebrity_reviews table created\n');

  // ============================================
  // 8. CELEBRITY_MEDIA TABLE
  // ============================================
  console.log('📸 Creating celebrity_media table...');
  await queryInterface.createTable('celebrity_media', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    celebrity_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'celebrities_new',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    media_type: {
      type: DataTypes.ENUM('avatar', 'hero', 'gallery', 'video'),
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    thumbnail_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });

  await queryInterface.addIndex('celebrity_media', ['celebrity_id', 'media_type'], {
    name: 'idx_celebrity_media_lookup'
  });

  console.log('✅ Celebrity_media table created\n');

  console.log('🎉 All new tables created successfully!\n');
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  console.log('🗑️  Rolling back normalized schema...\n');

  await queryInterface.dropTable('celebrity_media');
  await queryInterface.dropTable('celebrity_reviews');
  await queryInterface.dropTable('celebrity_location_pool');
  await queryInterface.dropTable('celebrity_pricing');
  await queryInterface.dropTable('celebrity_settings');
  await queryInterface.dropTable('celebrities_new');
  await queryInterface.dropTable('cities');
  await queryInterface.dropTable('categories');

  console.log('✅ Rollback complete\n');
}
