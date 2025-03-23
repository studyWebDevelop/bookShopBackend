const mysql = require("mysql2");
const mysqlPromise = require("mysql2/promise");
require("dotenv").config();

const connectionObj = {
  host: process.env.DB_HOST,
  user: "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true,
};

// 비동기 연결
const asyncConnection = mysqlPromise.createPool(connectionObj);

// 동기 연결
const syncConnection = mysql.createConnection(connectionObj);

syncConnection.connect((err) => {
  if (err) {
    console.error("동기 MySQL 연결 실패:", err);
    return;
  }
  console.log("동기 MySQL 연결 성공");
});

module.exports = { asyncConnection, syncConnection };
