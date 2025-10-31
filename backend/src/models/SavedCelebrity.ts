import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SavedCelebrityAttributes {
  id: string;
  user_id: string;
  celebrity_id: string;
  created_at?: Date;
}

interface SavedCelebrityCreationAttributes extends Optional<SavedCelebrityAttributes, 'id' | 'created_at'> {}

class SavedCelebrity extends Model<SavedCelebrityAttributes, SavedCelebrityCreationAttributes> implements SavedCelebrityAttributes {
  public id!: string;
  public user_id!: string;
  public celebrity_id!: string;
  public readonly created_at!: Date;
}

SavedCelebrity.init(
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
    celebrity_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'celebrities_new',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'saved_celebrities',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'celebrity_id'],
        name: 'unique_save'
      },
      {
        fields: ['user_id']
      }
    ]
  }
);

export default SavedCelebrity;
