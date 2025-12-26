import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { hashPassword } from '../utils/password';

export interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt'> { }

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public readonly createdAt!: Date;

    // Associations
    static associate(models: any) {
        User.hasMany(models.LoginHistory, {
            foreignKey: 'userId',
            as: 'loginHistories',
        });
    }

    /**
     * Convert to JSON without password
     */
    toJSON(): object {
        const values = { ...this.get() } as any;
        delete values.password;
        return values;
    }
}

export const initUserModel = (sequelize: Sequelize) => {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                field: 'created_at',
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            tableName: 'users',
            timestamps: true,
            updatedAt: false,
            hooks: {
                beforeCreate: async (user: User) => {
                    if (user.password) {
                        user.password = await hashPassword(user.password);
                    }
                },
                beforeUpdate: async (user: User) => {
                    if (user.changed('password')) {
                        user.password = await hashPassword(user.password);
                    }
                },
            },
        }
    );
};
