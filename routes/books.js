const express = require("express");
const router = express.Router();
const { getBookById, getBooks } = require("../controllers/bookController");
const { errorMiddleware } = require("../middlewares");

router.use(express.json());

// 카테고리별 도서목록 조회
// 도서 전체 조회
router.get("/", getBooks);

// 도서 개별 조회
router.get("/:id", getBookById);

router.use(errorMiddleware);

module.exports = router;
