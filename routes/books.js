const express = require("express");
const router = express.Router();

router.use(express.json());

// 도서 전체 조회
router.post("/", (req, res) => {
  res.send("도서 전체 조회");
});

// 도서 개별 조회
router.post("/:id", (req, res) => {
  res.send("도서 개별 조회");
});

// 카테고리별 도서목록 조회
router.post("/", (req, res) => {
  res.send("카테고리별 도서목록 조회");
});

module.exports = router;
