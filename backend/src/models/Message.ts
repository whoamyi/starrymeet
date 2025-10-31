import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MessageAttributes {
  id: string;
  from_user_id: string;
  to_user_id?: string;
  booking_id?: string;
  subject?: string;
  message: string;
  read_status: boolean;
  created_at?: Date;
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id' | 'read_status' | 'created_at'> {}

class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  public id!: string;
  public from_user_id!: string;
  public to_user_id?: string;
  public booking_id?: string;
  public subject?: string;
  public message!: string;
  public read_status!: boolean;
  public readonly created_at!: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    from_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    to_user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    booking_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'bookings',
        key: 'id'
      }
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    read_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'messages',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['from_user_id']
      },
      {
        fields: ['to_user_id']
      },
      {
        fields: ['read_status']
      }
    ]
  }
);

export default Message;
