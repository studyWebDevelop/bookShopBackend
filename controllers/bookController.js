const con = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const getBooks = (req, res, next) => {
  const { category_id, newBooks } = req.query;

  let sql = "SELECT * FROM books";

  if (category_id && newBooks) {
    sql +=
      " LEFT JOIN category ON books.category_id = category.id WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW();";
  } else if (newBooks) {
    sql +=
      " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW();";
  } else if (category_id) {
    sql +=
      " LEFT JOIN category ON books.category_id = category.id WHERE category_id = ?";
  }

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
  const sql = " WHERE id = ?";

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
