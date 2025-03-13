const express = require("express");
const router = express.Router();
const { getAllCategories } = require("../controllers/categoryController");
const { errorMiddleware } = require("../middlewares");

router.use(express.json());

// 카테고리 전체목록 조회
router.get("/", getAllCategories);

router.use(errorMiddleware);

module.exports = router;
