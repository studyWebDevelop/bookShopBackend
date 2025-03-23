const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const decodeJwt = (req, res) => {
  try {
    const token = req.headers["authorization"];
    if (!token) return null;

    return jwt.verify(token, process.env.JWT_PK);
  } catch (error) {
    console.log(error.name);
    console.log(error.message);

    return error;
  }
};

module.exports = { decodeJwt };
