const mysql = require("mysql2/promise");
require("dotenv").config();

// MySQL 연결 생성

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true,
});

module.exports = connection;
