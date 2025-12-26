import { Sequelize, DataTypes, Model, Optional } from 'sequelize';


interface LoginHistoryAttributes {
  id: number;
  userId: number;
  createdAt: Date;
}

interface LoginHistoryCreationAttributes extends Optional<LoginHistoryAttributes, 'id'> { }

export class LoginHistory extends Model<LoginHistoryAttributes, LoginHistoryCreationAttributes>
  implements LoginHistoryAttributes {

  public id!: number;
  public userId!: number;
  public createdAt!: Date;

  // Define associations
  static associate(models: any) {
    // Belongs to User (One-to-many relationship)
    LoginHistory.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',  // Alias for the association
    });
  }
}

// Initialize the model with Sequelize
export const initLoginHistoryModel = (sequelize: Sequelize) => {
  LoginHistory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: false,
        defaultValue: DataTypes.NOW,  // Automatically set to current time on creation
      },
    },
    {
      sequelize,
      tableName: 'login_history',
      timestamps: true,  // Automatically adds createdAt and updatedAt fields
      updatedAt: false,  // Disable automatic update of `updatedAt` column
    }
  );
};
