require('dotenv').config();
const mysql = require("mysql2");

const con = mysql.createPool({
    database: process.env.database,
    user: process.env.username,
    host: process.env.host,
    password: process.env.password,
    ssl: false
});

module.exports = con;