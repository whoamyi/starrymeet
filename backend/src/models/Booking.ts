import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface BookingAttributes {
  id: string;
  booking_number: string;
  user_id?: string;
  celebrity_id: string;
  status: 'pending' | 'payment_processing' | 'confirmed' | 'completed' | 'cancelled' | 'refunded';
  meeting_type: 'quick' | 'standard' | 'premium';
  booking_date: Date;
  time_slot: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  special_requests?: string;
  subtotal_cents: number;
  platform_fee_cents: number;
  tax_cents: number;
  total_cents: number;
  created_at?: Date;
  updated_at?: Date;
  confirmed_at?: Date;
  completed_at?: Date;
  cancelled_at?: Date;
}

interface BookingCreationAttributes extends Optional<BookingAttributes, 'id' | 'status' | 'created_at' | 'updated_at'> {}

class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
  public id!: string;
  public booking_number!: string;
  public user_id?: string;
  public celebrity_id!: string;
  public status!: 'pending' | 'payment_processing' | 'confirmed' | 'completed' | 'cancelled' | 'refunded';
  public meeting_type!: 'quick' | 'standard' | 'premium';
  public booking_date!: Date;
  public time_slot!: string;
  public contact_name!: string;
  public contact_email!: string;
  public contact_phone?: string;
  public special_requests?: string;
  public subtotal_cents!: number;
  public platform_fee_cents!: number;
  public tax_cents!: number;
  public total_cents!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public confirmed_at?: Date;
  public completed_at?: Date;
  public cancelled_at?: Date;

  static generateBookingNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `BK-${year}-${random}`;
  }
}

Booking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    booking_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    celebrity_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'celebrities',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'payment_processing', 'confirmed', 'completed', 'cancelled', 'refunded']]
      }
    },
    meeting_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['quick', 'standard', 'premium']]
      }
    },
    booking_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time_slot: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    contact_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    contact_email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    special_requests: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    subtotal_cents: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    platform_fee_cents: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tax_cents: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_cents: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    confirmed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'bookings',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default Booking;
