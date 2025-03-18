const express = require("express");
const { errorMiddleware } = require("../middlewares");
const router = express.Router();
const {
  getCartsItems,
  addCartItems,
  deleteCartItems,
} = require("../controllers/cartController");

router.use(express.json());

// 장바구니에서 선택한 주문예상 상품 조회
router.get("/", getCartsItems);

// 장바구니 추가
router.post("/", addCartItems);

// 장바구니 삭제
router.delete("/:id", deleteCartItems);

router.use(errorMiddleware);

module.exports = router;
