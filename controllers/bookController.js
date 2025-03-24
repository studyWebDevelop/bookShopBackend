const { syncConnection } = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { decodeJwt } = require("../utils/decodeJwt");

const getBooks = (req, res, next) => {
  let allBooksResponse = {};
  const { category_id, newBooks, limit, currentPage } = req.query;

  const pageLimit = Number(limit) || 10;
  const pageCurrent = Number(currentPage) > 0 ? Number(currentPage) : 1;

  let sql =
    "SELECT SQL_CALC_FOUND_ROWS *, (SELECT COUNT(*) FROM likes WHERE liked_book_id = books.id) as likes FROM books";
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

  if (pageLimit && pageCurrent) {
    const offset = (pageCurrent - 1) * pageLimit;
    sql += " LIMIT ? OFFSET ?";
    sqlValues.push(pageLimit, offset >= 0 ? offset : 0);
  }

  syncConnection.query(sql, sqlValues, (err, results) => {
    if (err) return next(err);

    if (results.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "해당 카테고리의 도서가 없습니다." });
    }

    let paginationSql = "SELECT found_rows()";
    syncConnection.query(paginationSql, (err, paginationResults) => {
      if (err) return next(err);

      let pagination = {};
      pagination.totalCount = paginationResults[0]["found_rows()"];
      pagination.currentPage = Number(currentPage);

      allBooksResponse.books = results;
      allBooksResponse.pagination = pagination;

      res.status(StatusCodes.OK).json(allBooksResponse);
    });
  });
};

const getBookById = (req, res, next) => {
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

  if (!authorization) {
    const { id } = req.params;

    let sqlValues = [];
    let sql = "";

    sql = `select *,
             (select count(*) from likes where liked_book_id  = ?) as likes 
             from books LEFT JOIN category ON books.category_id = category.category_id WHERE books.id = ?;`;

    sqlValues.push(Number(id), Number(id));

    syncConnection.query(sql, sqlValues, (err, results) => {
      if (err) return next(err);

      if (results.length == 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "존재하지 않는 도서입니다." });
      }

      res.status(StatusCodes.OK).json(results[0]);
    });

    return;
  }

  const { id } = req.params;
  const userId = authorization.id;

  let sqlValues = [];
  let sql = "";

  sql = `select *, 
           (select exists (select * from likes where user_id = ? and liked_book_id = books.id)) as liked,
           (select count(*) from likes where liked_book_id  = ?) as likes 
           from books LEFT JOIN category ON books.category_id = category.category_id WHERE books.id = ?;`;

  sqlValues.push(Number(userId), Number(id), Number(id));

  syncConnection.query(sql, sqlValues, (err, results) => {
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
