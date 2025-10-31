import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PaymentMethodAttributes {
  id: string;
  user_id: string;
  type: 'card' | 'paypal' | 'bank';
  card_last4?: string;
  card_brand?: string;
  card_exp_month?: number;
  card_exp_year?: number;
  is_default: boolean;
  stripe_payment_method_id?: string;
  created_at?: Date;
}

interface PaymentMethodCreationAttributes extends Optional<PaymentMethodAttributes, 'id' | 'type' | 'is_default' | 'created_at'> {}

class PaymentMethod extends Model<PaymentMethodAttributes, PaymentMethodCreationAttributes> implements PaymentMethodAttributes {
  public id!: string;
  public user_id!: string;
  public type!: 'card' | 'paypal' | 'bank';
  public card_last4?: string;
  public card_brand?: string;
  public card_exp_month?: number;
  public card_exp_year?: number;
  public is_default!: boolean;
  public stripe_payment_method_id?: string;
  public readonly created_at!: Date;
}

PaymentMethod.init(
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
      onDelete: 'CASCADE'
    },
    type: {
      type: DataTypes.ENUM('card', 'paypal', 'bank'),
      defaultValue: 'card'
    },
    card_last4: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    card_brand: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    card_exp_month: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    card_exp_year: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    stripe_payment_method_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'payment_methods',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['user_id']
      }
    ]
  }
);

export default PaymentMethod;
