const express = require("express");
const {
  getAllOrders,
  getOrderById,
  getOrderCount,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

const router = express.Router();

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.get("/get/count", getOrderCount);
router.post("/create", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
