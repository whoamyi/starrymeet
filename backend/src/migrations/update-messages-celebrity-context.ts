/**
 * Migration: Update Messages Table for Celebrity Context
 *
 * Adds celebrity_id, is_from_admin, and admin_user_id fields to support
 * admin panel with celebrity-grouped messaging
 */

import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  console.log('📝 Updating messages table for celebrity context...\n');

  // Add celebrity_id column
  console.log('➕ Adding celebrity_id column...');
  await queryInterface.addColumn('messages', 'celebrity_id', {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'celebrities_new',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    comment: 'Celebrity profile this message is associated with'
  });

  // Add is_from_admin column
  console.log('➕ Adding is_from_admin column...');
  await queryInterface.addColumn('messages', 'is_from_admin', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'True if message was sent by admin acting as celebrity'
  });

  // Add admin_user_id column
  console.log('➕ Adding admin_user_id column...');
  await queryInterface.addColumn('messages', 'admin_user_id', {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    comment: 'Admin user who sent the message (if is_from_admin=true)'
  });

  // Add indexes for efficient queries
  console.log('📊 Adding indexes...');
  await queryInterface.addIndex('messages', ['celebrity_id'], {
    name: 'idx_messages_celebrity_id'
  });

  await queryInterface.addIndex('messages', ['celebrity_id', 'read_status'], {
    name: 'idx_messages_celebrity_read'
  });

  await queryInterface.addIndex('messages', ['is_from_admin'], {
    name: 'idx_messages_is_from_admin'
  });

  console.log('✅ Messages table updated successfully!\n');
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  console.log('🗑️  Rolling back messages table updates...\n');

  // Remove indexes
  await queryInterface.removeIndex('messages', 'idx_messages_celebrity_id');
  await queryInterface.removeIndex('messages', 'idx_messages_celebrity_read');
  await queryInterface.removeIndex('messages', 'idx_messages_is_from_admin');

  // Remove columns
  await queryInterface.removeColumn('messages', 'celebrity_id');
  await queryInterface.removeColumn('messages', 'is_from_admin');
  await queryInterface.removeColumn('messages', 'admin_user_id');

  console.log('✅ Rollback complete\n');
}
