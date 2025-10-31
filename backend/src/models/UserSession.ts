import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UserSessionAttributes {
  id: string;
  user_id: string;
  session_token: string;
  expires_at: Date;
  created_at?: Date;
}

interface UserSessionCreationAttributes extends Optional<UserSessionAttributes, 'id' | 'created_at'> {}

class UserSession extends Model<UserSessionAttributes, UserSessionCreationAttributes> implements UserSessionAttributes {
  public id!: string;
  public user_id!: string;
  public session_token!: string;
  public expires_at!: Date;
  public readonly created_at!: Date;
}

UserSession.init(
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
    session_token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'user_sessions',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['session_token']
      },
      {
        fields: ['user_id']
      }
    ]
  }
);

export default UserSession;
