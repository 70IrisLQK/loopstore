const express = require("express");
const {
  getAllReviews,
  getReviewCount,
  getReviewById,
  addReview,
} = require("../controllers/productReviewController");

const router = express.Router();

router.get("/", getAllReviews);
router.get("/get/count", getReviewCount);
router.get("/:id", getReviewById);
router.post("/add", addReview);

module.exports = router;
