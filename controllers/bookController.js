const con = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const getBooks = (req, res, next) => {
  const { category_id } = req.query;
  const sql = category_id
    ? "SELECT * FROM books WHERE category_id = ?"
    : "SELECT * FROM books";

  con.query(sql, [category_id], (err, results) => {
    if (err) return next(err);

    if (results.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "해당 카테고리의 도서가 없습니다." });
    }

    res.status(StatusCodes.OK).json(results);
  });
};

const getBookById = (req, res) => {
  const { id } = Number(req.params);
  const sql = "SELECT * FROM books WHERE id = ?";

  con.query(sql, [id], (err, results) => {
    if (err) return next(err);

    if (results.length == 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "존재하지 않는 도서입니다." });
    }

    res.status(StatusCodes.OK).json(results[0]);
  });
};

module.exports = { getBooks, getBookById };
