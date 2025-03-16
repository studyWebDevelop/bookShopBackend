const express = require("express");
const { postLike, deleteLike } = require("../controllers/likeController");
const { errorMiddleware } = require("../middlewares");
const router = express.Router();

router.use(express.json());

// 좋아요 추가
router.post("/:id", postLike);

// 좋아요 삭제
router.delete("/:id", deleteLike);

router.use(errorMiddleware);

module.exports = router;
