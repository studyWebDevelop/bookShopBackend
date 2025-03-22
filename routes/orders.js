const express = require("express");
const { errorMiddleware } = require("../middlewares");
const router = express.Router();
const {
  getOrders,
  postOrders,
  getOrderDetail,
} = require("../controllers/ordersController");

router.use(express.json());

// 주문 목록 조회
router.get("/", getOrders);

// 주문 하기
router.post("/", postOrders);

// 주문 상품 조회
router.get("/:id", getOrderDetail);

router.use(errorMiddleware);

module.exports = router;
