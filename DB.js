import { Sequelize, Model, DataTypes } from 'sequelize';
import { config } from 'dotenv';
config();

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
    }
);

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch(error){
    console.error('Unable to connect to the database:', error);
}

// 개체

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

// 사용자(User)
class User extends Model {}
User.init(
    {
    user_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        }
    }
    ,
    {
        sequelize,
        modelName: 'User',
        timestamps: false
    }
);

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
    }
    ,
    {
        sequelize,
        modelName: 'Notice',
        timestamps: false
    }
)


// 릴레이션

// 회사 : 채용공고 = 일대다
Corp.hasMany(Notice);
Notice.belongsTo(Corp);

// 사용자 : 채용공고 = 일대일
User.belongsTo(Notice,
    {
        foreignKey: 'notice_id'
    }
);

await sequelize.sync({force: true});
console.log('All models were synchronized successfully.');

//sequelize.close();