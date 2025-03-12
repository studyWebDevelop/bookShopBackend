const express = require("express");
const router = express.Router();
const { validationErrors, errorMiddleware } = require("../middlewares/index");
const { body } = require("express-validator");
const {
  join,
  login,
  requestPasswordReset,
  passwordReset,
} = require("../controllers/userController");

router.use(express.json());

const loginSignupValidation = [
  [
    body("email").notEmpty().isString().withMessage("문자를 입력해주세요."),
    body("password").notEmpty().isString().withMessage("문자를 입력해주세요."),
  ],
  validationErrors,
];

// 회원가입
router.post("/join", loginSignupValidation, join);

// 로그인
router.post("/login", loginSignupValidation, login);

// 비밀번호 초기화 요청
router.post("/reset", requestPasswordReset);

// 비밀번호 초기화
router.put("/reset", passwordReset);

router.use(errorMiddleware);

module.exports = router;
