const { asyncConnection } = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const postOrders = async (req, res, next) => {
  try {
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

    const userId = authorization.id;

    const { items, delivery, totalQuantity, totalPrice, bookTitle } = req.body;

    let sql =
      "INSERT INTO delivery(address, receiver, contact) VALUES(?, ?, ?);";

    const [delivery_result] = await asyncConnection.query(sql, [
      delivery.address,
      delivery.receiver,
      delivery.contact,
    ]);

    let delivery_id = delivery_result.insertId;

    sql = `INSERT INTO orders(book_title, total_quantity, total_price, user_id, delivery_id)
           VALUES(?, ?, ?, ?, ?);`;

    const [order_result] = await asyncConnection.query(sql, [
      bookTitle,
      totalQuantity,
      totalPrice,
      userId,
      delivery_id,
    ]);

    let order_id = order_result.insertId;

    sql = "INSERT INTO orderedBook(order_id, book_id, quantity) VALUES ?";

    let sqlValues = items.map((book_id, quantity) => [
      order_id,
      book_id,
      quantity,
    ]);

    await asyncConnection.query(sql, [sqlValues]);

    let results = await deleteCartItems(con, items);

    res.status(StatusCodes.OK).json(results);
  } catch (err) {
    next(err);
  }
};

const deleteCartItems = async (con, items) => {
  let sql = "delete from cartItems where id in (?)";

  return asyncConnection.query(sql, [items]);
};

const getOrders = async (req, res, next) => {
  let sql = `select orders.id, created_at, address, receiver, contact, book_title, total_quantity, total_price from orders 
             left join delivery on orders.delivery_id = delivery.id;`;

  const [row, fields] = await asyncConnection.query(sql);

  res.status(StatusCodes.OK).json(row);
};

const getOrderDetail = async (req, res, next) => {
  const { id } = req.params;

  let sql = `select book_id, title, author, price, quantity from orderedBook
             left join books on orderedBook.book_id = books.id where order_id = ?;`;

  const [row, fields] = await asyncConnection.query(sql, [id]);

  res.status(StatusCodes.OK).json(row);
};

module.exports = {
  getOrders,
  postOrders,
  getOrderDetail,
};
