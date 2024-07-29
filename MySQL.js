import mysql from 'mysql';
import { config } from 'dotenv';
config();

const connection = mysql.createConnection({
    host    : process.env.DB_HOST,
    user    : process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect();

//connection.end();

export default connection;