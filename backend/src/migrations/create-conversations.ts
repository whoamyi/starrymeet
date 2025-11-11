/**
 * Migration: Create Conversations Table
 *
 * Creates a table to track conversations between users and celebrity profiles
 * for efficient grouping and unread count tracking
 */

import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  console.log('📝 Creating conversations table...\n');

  await queryInterface.createTable('conversations', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      comment: 'Unique conversation identifier'
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
      comment: 'User participating in the conversation'
    },
    celebrity_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'celebrities_new',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      comment: 'Celebrity profile this conversation is about'
    },
    last_message_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Timestamp of the last message in this conversation'
    },
    last_message_preview: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Preview of the last message (first 150 chars)'
    },
    unread_count_admin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of unread messages from user (admin perspective)'
    },
    unread_count_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of unread messages from celebrity/admin (user perspective)'
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'active',
      comment: 'Conversation status (active, archived, spam)'
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

  // Add indexes for efficient queries
  console.log('📊 Adding indexes...');

  await queryInterface.addIndex('conversations', ['user_id', 'celebrity_id'], {
    name: 'unique_user_celebrity_conversation',
    unique: true
  });

  await queryInterface.addIndex('conversations', ['user_id'], {
    name: 'idx_conversations_user_id'
  });

  await queryInterface.addIndex('conversations', ['celebrity_id'], {
    name: 'idx_conversations_celebrity_id'
  });

  await queryInterface.addIndex('conversations', ['celebrity_id', 'status'], {
    name: 'idx_conversations_celebrity_status'
  });

  await queryInterface.addIndex('conversations', ['last_message_at'], {
    name: 'idx_conversations_last_message'
  });

  console.log('✅ Conversations table created successfully!\n');
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  console.log('🗑️  Rolling back conversations table...\n');

  await queryInterface.dropTable('conversations');

  console.log('✅ Rollback complete\n');
}
