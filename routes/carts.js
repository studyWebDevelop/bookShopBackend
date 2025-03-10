const express = require("express");
const router = express.Router();

router.use(express.json());

// 장바구니 조회
// router.get("/carts", (req, res) => {
//   res.send("장바구니 조회");
// });

// 장바구니에서 선택한 주문예상 상품 조회
router.get("/", (req, res) => {
  res.send("장바구니 조회");
});

// 장바구니 추가
router.post("/", (req, res) => {
  res.send("장바구니 추가");
});

// 장바구니 삭제
router.delete("/:id", (req, res) => {
  res.send("장바구니 도서 삭제");
});

module.exports = router;
