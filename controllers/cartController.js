const { syncConnection } = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const getCartsItems = (req, res, next) => {
  const { user_id, selected_items_id } = req.body;
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
  const { user_id, book_id, quantity } = req.body;

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
