const { syncConnection } = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const getBooks = (req, res, next) => {
  const { category_id, newBooks, limit, currentPage } = req.query;

  let sql =
    "SELECT *, (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) as likes FROM books";
  let sqlValues = [];

  if (category_id && newBooks) {
    sql +=
      " LEFT JOIN category ON books.category_id = category.category_id WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    sqlValues.push(category_id);
  } else if (newBooks) {
    sql +=
      " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
  } else if (category_id) {
    sql +=
      " LEFT JOIN category ON books.category_id = category.category_id WHERE category_id = ?";
    sqlValues.push(category_id);
  }

  if (limit && currentPage) {
    sql += " LIMIT ? OFFSET ?";
    sqlValues.push(Number(limit), Number(currentPage - 1) * Number(limit));
  }

  syncConnection.query(sql, sqlValues, (err, results) => {
    if (err) return next(err);

    if (results.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "해당 카테고리의 도서가 없습니다." });
    }

    res.status(StatusCodes.OK).json(results);
  });
};

const getBookById = (req, res, next) => {
  const { id } = req.params;
  const { user_id } = req.body;

  const sql = `select *, 
    (select exists (select * from likes where user_id = ? and liked_book_id = books.id)) as liked,
    (select count(*) from likes where liked_book_id  = ?) as likes 
    from books LEFT JOIN category ON books.category_id = category.category_id WHERE books.id = ?;`;

  syncConnection.query(
    sql,
    [user_id, Number(id), Number(id)],
    (err, results) => {
      if (err) return next(err);

      if (results.length == 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "존재하지 않는 도서입니다." });
      }

      res.status(StatusCodes.OK).json(results[0]);
    }
  );
};

module.exports = { getBooks, getBookById };
