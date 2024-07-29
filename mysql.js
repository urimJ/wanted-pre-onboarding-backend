import mysql from 'mysql2';
import { config } from 'dotenv';
config();

const con = mysql.createConnection({
    host    : process.env.DB_HOST,
    user    : process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

con.connect();

//connection.end();

export default con;
