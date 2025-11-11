import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ConversationAttributes {
  id: string;
  user_id: string;
  celebrity_id: string;
  last_message_at?: Date;
  last_message_preview?: string;
  unread_count_admin: number;
  unread_count_user: number;
  status: 'active' | 'archived' | 'spam';
  created_at?: Date;
  updated_at?: Date;
}

interface ConversationCreationAttributes extends Optional<ConversationAttributes, 'id' | 'unread_count_admin' | 'unread_count_user' | 'status' | 'created_at' | 'updated_at'> {}

class Conversation extends Model<ConversationAttributes, ConversationCreationAttributes> implements ConversationAttributes {
  public id!: string;
  public user_id!: string;
  public celebrity_id!: string;
  public last_message_at?: Date;
  public last_message_preview?: string;
  public unread_count_admin!: number;
  public unread_count_user!: number;
  public status!: 'active' | 'archived' | 'spam';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Conversation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'User participating in the conversation'
    },
    celebrity_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'celebrities_new',
        key: 'id'
      },
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
      defaultValue: 0,
      comment: 'Number of unread messages from user (admin perspective)'
    },
    unread_count_user: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of unread messages from celebrity/admin (user perspective)'
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'archived', 'spam']]
      },
      comment: 'Conversation status for filtering/organization'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'conversations',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'celebrity_id'],
        name: 'unique_user_celebrity_conversation'
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['celebrity_id']
      },
      {
        fields: ['celebrity_id', 'status']
      },
      {
        fields: ['last_message_at']
      }
    ]
  }
);

export default Conversation;
