/**
 * Migration: Create Availability System
 * Creates tables for celebrity availability slots and city cooldown tracking
 */

import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Create availability table
  await queryInterface.createTable('availability', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    celebrity_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'celebrities',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    meeting_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'virtual or physical'
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Meeting duration in minutes (15, 30, or 60)'
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    timezone: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'UTC'
    },
    slots_remaining: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Number of bookings available for this slot'
    },
    price_cents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Price for this specific slot in cents'
    },
    tier: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: 'Celebrity tier (S, A, B, C, D)'
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'active',
      comment: 'active, booked, expired, cancelled'
    },
    rotation_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Identifier for the rotation cycle this slot belongs to'
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
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'When this availability slot expires'
    }
  });

  // Create cooldown table
  await queryInterface.createTable('city_cooldown', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    celebrity_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'celebrities',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cooldown_start: {
      type: DataTypes.DATE,
      allowNull: false
    },
    cooldown_end: {
      type: DataTypes.DATE,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });

  // Add indexes for performance
  await queryInterface.addIndex('availability', ['celebrity_id', 'date'], {
    name: 'idx_availability_celebrity_date'
  });

  await queryInterface.addIndex('availability', ['city', 'country', 'date'], {
    name: 'idx_availability_city_date'
  });

  await queryInterface.addIndex('availability', ['status', 'expires_at'], {
    name: 'idx_availability_status_expiry'
  });

  await queryInterface.addIndex('city_cooldown', ['celebrity_id', 'cooldown_end'], {
    name: 'idx_cooldown_celebrity_end'
  });

  // Add unique constraint to prevent duplicate slots
  await queryInterface.addConstraint('availability', {
    fields: ['celebrity_id', 'date', 'time', 'meeting_type'],
    type: 'unique',
    name: 'unique_celebrity_datetime_type'
  });

  // Add unique constraint on city cooldown
  await queryInterface.addConstraint('city_cooldown', {
    fields: ['celebrity_id', 'city', 'country'],
    type: 'unique',
    name: 'unique_celebrity_city_cooldown'
  });

  console.log('✅ Created availability system tables');
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('city_cooldown');
  await queryInterface.dropTable('availability');

  console.log('✅ Dropped availability system tables');
}
