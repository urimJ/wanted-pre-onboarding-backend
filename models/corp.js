import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// 회사(Corp)
class Corp extends Model {}

Corp.init(
    {
        corp_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        area: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'Corp',
        timestamps: false
    }
);

export default Corp;