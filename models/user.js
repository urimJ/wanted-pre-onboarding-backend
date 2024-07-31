import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// 사용자(구직자, User)
class User extends Model {}

User.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'User',
        timestamps: false
    }
);

export default User;