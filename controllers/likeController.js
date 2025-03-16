const con = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const postLike = (req, res, next) => {
  const { user_id } = req.body;
  const { id } = req.params;

  let sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?);";

  con.query(sql, [user_id, id], (err, results) => {
    if (err) return next(err);

    return res.status(StatusCodes.OK).json(results);
  });
};

const deleteLike = (req, res, next) => {
  const { user_id } = req.body;
  const { id } = req.params;

  let sql = "DELETE FROM likes where liked_book_id = ? AND user_id = ?;";

  con.query(sql, [user_id, id], (err, results) => {
    if (err) return next(err);

    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = {
  postLike,
  deleteLike,
};
