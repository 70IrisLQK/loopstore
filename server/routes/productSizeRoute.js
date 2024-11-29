// routes/productSizeRoutes.js

const express = require("express");
const router = express.Router();
const {
  getAllProductSizes,
  getProductSizeById,
  createProductSize,
  deleteProductSizeById,
  updateProductSizeById,
} = require("../controllers/productSizeController");

// Get all product sizes
router.get("/", getAllProductSizes);

// Get a single product size by id
router.get("/:id", getProductSizeById);

// Create a new product size
router.post("/create", createProductSize);

// Delete a product size by id
router.delete("/:id", deleteProductSizeById);

// Update a product size by id
router.put("/:id", updateProductSizeById);

module.exports = router;
