const jwt = require("jsonwebtoken");
const { syncConnection } = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const { decodeJwt } = require("../utils/decodeJwt");

const postLike = (req, res, next) => {
  const book_id = req.params.id;

  const user_id = decodeJwt(req, res).id;

  let sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?);";

  syncConnection.query(sql, [user_id, book_id], (err, results) => {
    if (err) return next(err);

    return res.status(StatusCodes.OK).json(results);
  });
};

const deleteLike = (req, res, next) => {
  const book_id = req.params.id;

  const user_id = decodeJwt(req, res).id;

  let sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?;";

  syncConnection.query(sql, [user_id, book_id], (err, results) => {
    if (err) return next(err);

    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = {
  postLike,
  deleteLike,
};
