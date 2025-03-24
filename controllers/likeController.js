const jwt = require("jsonwebtoken");
const { syncConnection } = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const { decodeJwt } = require("../utils/decodeJwt");

const postLike = (req, res, next) => {
  const book_id = req.params.id;

  const authorization = decodeJwt(req);

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

  const userId = authorization.id;

  let sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?);";

  syncConnection.query(sql, [userId, book_id], (err, results) => {
    if (err) return next(err);

    return res.status(StatusCodes.OK).json(results);
  });
};

const deleteLike = (req, res, next) => {
  const book_id = req.params.id;

  const authorization = decodeJwt(req);

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

  const userId = authorization.id;

  let sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?;";

  syncConnection.query(sql, [userId, book_id], (err, results) => {
    if (err) return next(err);

    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = {
  postLike,
  deleteLike,
};
