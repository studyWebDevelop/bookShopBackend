const con = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const getAllCategories = (req, res) => {
  const sql = "SELECT * FROM category";

  con.query(sql, (err, results) => {
    if (err) return next(err);

    res.status(StatusCodes.OK).json(results);
  });
};

module.exports = {
  getAllCategories,
};
