import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PaymentAttributes {
  id: string;
  booking_id: string;
  stripe_payment_intent_id?: string;
  stripe_charge_id?: string;
  amount_cents: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded';
  payment_method_type?: string;
  card_brand?: string;
  last4?: string;
  refund_amount_cents: number;
  refund_reason?: string;
  stripe_refund_id?: string;
  created_at?: Date;
  updated_at?: Date;
  paid_at?: Date;
  refunded_at?: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'currency' | 'status' | 'refund_amount_cents' | 'created_at' | 'updated_at'> {}

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: string;
  public booking_id!: string;
  public stripe_payment_intent_id?: string;
  public stripe_charge_id?: string;
  public amount_cents!: number;
  public currency!: string;
  public status!: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded';
  public payment_method_type?: string;
  public card_brand?: string;
  public last4?: string;
  public refund_amount_cents!: number;
  public refund_reason?: string;
  public stripe_refund_id?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public paid_at?: Date;
  public refunded_at?: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    booking_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'bookings',
        key: 'id'
      }
    },
    stripe_payment_intent_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true
    },
    stripe_charge_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    amount_cents: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'usd'
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'processing', 'succeeded', 'failed', 'refunded']]
      }
    },
    payment_method_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    card_brand: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    last4: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    refund_amount_cents: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    refund_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    stripe_refund_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refunded_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'payments',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default Payment;
