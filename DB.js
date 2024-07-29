import { Sequelize } from "sequelize";
import { config } from "dotenv";
config();

const sequelize = new Sequelize(
    DB_DATABASE,
    DB_USERNAME,
    DB_PASSWORD,
    {
        host: localhost,
        dialect: mysql
    }
);

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch(error){
    console.error('Unable to connect to the database:', error);
}