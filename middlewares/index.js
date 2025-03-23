const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { decodeJwt } = require("../utils/decodeJwt");

const validationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  next();
};

const errorMiddleware = (err, req, res, next) => {
  console.error(err);
  res
    .status(StatusCodes.BAD_REQUEST)
    .json({ message: "서버 오류가 발생했습니다." });
};

const authMiddleware = (authorization) => {
  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "로그인 세션이 만료되었습니다. 다시 로그인 해주세요.",
    });
  }

  if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "잘못된 형식의 토큰입니다.",
    });
  }

  next();
};

module.exports = { validationErrors, errorMiddleware, authMiddleware };
