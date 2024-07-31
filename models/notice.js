import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// 채용공고(Notice)
class Notice extends Model {}

Notice.init(
    {
        notice_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false
        },
        award: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        skill: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'Notice',
        timestamps: false
    }
);

export default Notice;