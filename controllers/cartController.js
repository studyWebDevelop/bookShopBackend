const { syncConnection } = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const { decodeJwt } = require("../utils/decodeJwt");

const jwt = require("jsonwebtoken");

const getCartsItems = (req, res, next) => {
  const { selected_items_id } = req.body;
  const authorization = decodeJwt(req, res);

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

  const user_id = authorization.id;

  console.log("userId", user_id);
  const sqlValues = [user_id];

  let sql = `select cartItems.id, book_id, title, summary, quantity, price from 
             cartItems left join books on books.id = cartItems.book_id where user_id = ?`;

  if (selected_items_id) {
    sql += ` AND cartItems.id in (?)`;
    sqlValues.push(selected_items_id);
  }

  syncConnection.query(sql, sqlValues, (err, results) => {
    if (err) return next(err);

    res.status(StatusCodes.OK).json(results);
  });
};

const addCartItems = (req, res, next) => {
  const user_id = decodeJwt(req, res).id;
  const { book_id, quantity } = req.body;

  let sql =
    "insert into cartItems(book_id, quantity, user_id) values (?, ?, ?)";
  syncConnection.query(
    sql,
    [Number(book_id), Number(quantity), Number(user_id)],
    (err, results) => {
      if (err) return next(err);

      res.status(StatusCodes.OK).json(results);
    }
  );
};

const deleteCartItems = (req, res, next) => {
  const { id } = req.params;

  let sql = "delete from cartItems where id = ?";
  syncConnection.query(sql, [id], (error, results) => {
    if (error) return next(error);

    res.status(StatusCodes.OK).json(results);
  });
};

module.exports = {
  getCartsItems,
  addCartItems,
  deleteCartItems,
};
