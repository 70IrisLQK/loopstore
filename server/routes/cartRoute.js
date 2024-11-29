const express = require("express");
const {
  getCartItems,
  addCartItem,
  deleteCartItem,
  getCartItemById,
  updateCartItem,
} = require("../controllers/cartController");

const router = express.Router();

router.get(`/`, getCartItems);
router.post("/add", addCartItem);
router.delete("/:id", deleteCartItem);
router.get("/:id", getCartItemById);
router.put("/:id", updateCartItem);

module.exports = router;
