const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

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

module.exports = { validationErrors, errorMiddleware };
