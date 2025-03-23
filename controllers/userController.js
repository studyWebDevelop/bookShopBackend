const { syncConnection } = require("../mariadb");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // 암호화
const { StatusCodes } = require("http-status-codes");

const join = (req, res, next) => {
  const { email, password } = req.body;

  // 비밀 번호 암호화
  const salt = crypto.randomBytes(10).toString("base64");
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  const sql = "INSERT INTO users(email, password, salt) VALUES (? , ?, ?)";

  syncConnection.query(sql, [email, hashedPassword, salt], (err) => {
    if (err) return next(err);

    res.status(StatusCodes.CREATED).json({ message: `${email}님 환영합니다!` });
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  syncConnection.query(sql, [email, password], (err, results) => {
    if (err) return next(err);

    const loginUser = results[0];

    if (!loginUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "회원 정보가 없습니다." });
    }

    const hashedPassword = crypto
      .pbkdf2Sync(password, loginUser.salt, 10000, 10, "sha512")
      .toString("base64");

    if (loginUser.password === hashedPassword) {
      const jwt_token = jwt.sign(
        { id: loginUser.id, email: loginUser.email },
        process.env.JWT_PK,
        {
          expiresIn: "1m",
        }
      );

      res.cookie("token", jwt_token, {
        httpOnly: true,
      });

      res.status(StatusCodes.ACCEPTED).json({ message: "로그인 성공!" });
    } else {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "비밀번호가 일치하지 않습니다." });
    }
  });
};

const requestPasswordReset = (req, res, next) => {
  const { email } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  syncConnection.query(sql, [email], (err, results) => {
    if (err) return next(err);

    const user = results[0];

    if (user == undefined) {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }

    res.status(StatusCodes.OK).json({ email: email });
  });
};

const passwordReset = (req, res, next) => {
  const { email, password } = req.body;

  const salt = crypto.randomBytes(10).toString("base64");
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  const sql = "UPDATE users SET password = ?, salt = ? WHERE email = ?";

  syncConnection.query(sql, [hashedPassword, salt, email], (err, results) => {
    if (err) return next(err);

    if (results.affectedRows == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "이메일에 관한 정보가 없습니다." });
    }

    res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { join, login, requestPasswordReset, passwordReset };
