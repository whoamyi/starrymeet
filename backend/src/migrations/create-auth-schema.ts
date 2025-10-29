/**
 * Migration: Create Authentication System Schema
 *
 * Creates tables for user authentication and session management:
 * - users: Core user accounts
 * - sessions: Active session tokens
 * - user_profiles: Extended user information
 * - favorites: User's favorite celebrities
 */

import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  console.log('🔐 Creating authentication system schema...\n');

  // ============================================
  // 1. USERS TABLE
  // ============================================
  console.log('👤 Creating users table...');
  await queryInterface.createTable('users', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      comment: 'Unique user identifier'
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      comment: 'User email address'
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Bcrypt password hash'
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'User first name'
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'User last name'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Phone number'
    },
    avatar_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Profile picture URL'
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Email verification status'
    },
    verification_token: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Email verification token'
    },
    reset_token: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Password reset token'
    },
    reset_token_expires: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Password reset token expiration'
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Last login timestamp'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Account active status'
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

  // Add indexes
  await queryInterface.addIndex('users', ['email'], {
    name: 'idx_users_email',
    unique: true
  });

  await queryInterface.addIndex('users', ['verification_token'], {
    name: 'idx_users_verification_token'
  });

  await queryInterface.addIndex('users', ['reset_token'], {
    name: 'idx_users_reset_token'
  });

  console.log('✅ Users table created\n');

  // ============================================
  // 2. SESSIONS TABLE
  // ============================================
  console.log('🔑 Creating sessions table...');
  await queryInterface.createTable('sessions', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      comment: 'Unique session identifier'
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      comment: 'User who owns this session'
    },
    token: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
      comment: 'JWT session token'
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Token expiration date'
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: 'IP address of session creator'
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Browser user agent string'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });

  // Add indexes
  await queryInterface.addIndex('sessions', ['token'], {
    name: 'idx_sessions_token',
    unique: true
  });

  await queryInterface.addIndex('sessions', ['user_id'], {
    name: 'idx_sessions_user_id'
  });

  await queryInterface.addIndex('sessions', ['expires_at'], {
    name: 'idx_sessions_expires_at'
  });

  console.log('✅ Sessions table created\n');

  // ============================================
  // 3. USER_PROFILES TABLE
  // ============================================
  console.log('📋 Creating user_profiles table...');
  await queryInterface.createTable('user_profiles', {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      comment: 'User ID (primary key)'
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'User biography'
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'User location'
    },
    profession: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'User profession'
    },
    company: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Company name'
    },
    website: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Personal website URL'
    },
    instagram: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Instagram username'
    },
    linkedin: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'LinkedIn profile URL'
    },
    twitter: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Twitter/X username'
    },
    preferences: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'User preferences as JSON'
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

  console.log('✅ User_profiles table created\n');

  // ============================================
  // 4. FAVORITES TABLE
  // ============================================
  console.log('⭐ Creating favorites table...');
  await queryInterface.createTable('favorites', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      comment: 'Unique favorite identifier'
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      comment: 'User who favorited'
    },
    celebrity_id: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Celebrity that was favorited'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });

  // Add indexes
  await queryInterface.addIndex('favorites', ['user_id'], {
    name: 'idx_favorites_user_id'
  });

  await queryInterface.addIndex('favorites', ['celebrity_id'], {
    name: 'idx_favorites_celebrity_id'
  });

  // Unique constraint: user can only favorite a celebrity once
  await queryInterface.addIndex('favorites', ['user_id', 'celebrity_id'], {
    name: 'idx_favorites_unique',
    unique: true
  });

  console.log('✅ Favorites table created\n');

  console.log('🎉 Authentication system schema created successfully!\n');
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  console.log('🗑️  Rolling back authentication system schema...\n');

  await queryInterface.dropTable('favorites');
  await queryInterface.dropTable('user_profiles');
  await queryInterface.dropTable('sessions');
  await queryInterface.dropTable('users');

  console.log('✅ Rollback complete\n');
}
