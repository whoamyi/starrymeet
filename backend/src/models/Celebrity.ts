import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CelebrityAttributes {
  id: string;
  user_id?: string;
  username: string;
  display_name: string;
  celebrity_code?: string;
  category: string;
  subcategory?: string;
  niche_category?: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
  cover_photo_url?: string;
  quick_meet_price_cents?: number;
  standard_meet_price_cents?: number;
  premium_meet_price_cents?: number;
  response_time_hours?: number;
  average_rating: number;
  total_reviews: number;
  total_bookings: number;
  is_verified: boolean;
  is_active: boolean;
  is_featured: boolean;
  stripe_account_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface CelebrityCreationAttributes extends Optional<CelebrityAttributes, 'id' | 'average_rating' | 'total_reviews' | 'total_bookings' | 'is_verified' | 'is_active' | 'is_featured' | 'created_at' | 'updated_at'> {}

class Celebrity extends Model<CelebrityAttributes, CelebrityCreationAttributes> implements CelebrityAttributes {
  public id!: string;
  public user_id?: string;
  public username!: string;
  public display_name!: string;
  public celebrity_code?: string;
  public category!: string;
  public subcategory?: string;
  public niche_category?: string;
  public bio?: string;
  public location?: string;
  public avatar_url?: string;
  public cover_photo_url?: string;
  public quick_meet_price_cents?: number;
  public standard_meet_price_cents?: number;
  public premium_meet_price_cents?: number;
  public response_time_hours?: number;
  public average_rating!: number;
  public total_reviews!: number;
  public total_bookings!: number;
  public is_verified!: boolean;
  public is_active!: boolean;
  public is_featured!: boolean;
  public stripe_account_id?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Celebrity.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    display_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    celebrity_code: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    subcategory: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    niche_category: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    avatar_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cover_photo_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    quick_meet_price_cents: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    standard_meet_price_cents: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    premium_meet_price_cents: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    response_time_hours: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 24
    },
    average_rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.00
    },
    total_reviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    total_bookings: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    stripe_account_id: {
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
    }
  },
  {
    sequelize,
    tableName: 'celebrities_new',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default Celebrity;
