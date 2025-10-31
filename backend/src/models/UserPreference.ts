import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UserPreferenceAttributes {
  id: string;
  user_id: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  marketing_emails: boolean;
  currency: string;
  timezone: string;
  language: string;
  created_at?: Date;
  updated_at?: Date;
}

interface UserPreferenceCreationAttributes extends Optional<UserPreferenceAttributes, 'id' | 'email_notifications' | 'sms_notifications' | 'marketing_emails' | 'currency' | 'timezone' | 'language' | 'created_at' | 'updated_at'> {}

class UserPreference extends Model<UserPreferenceAttributes, UserPreferenceCreationAttributes> implements UserPreferenceAttributes {
  public id!: string;
  public user_id!: string;
  public email_notifications!: boolean;
  public sms_notifications!: boolean;
  public marketing_emails!: boolean;
  public currency!: string;
  public timezone!: string;
  public language!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

UserPreference.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    email_notifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    sms_notifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    marketing_emails: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD'
    },
    timezone: {
      type: DataTypes.STRING(50),
      defaultValue: 'UTC'
    },
    language: {
      type: DataTypes.STRING(10),
      defaultValue: 'en'
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
    tableName: 'user_preferences',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default UserPreference;
