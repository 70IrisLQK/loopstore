// routes/productWeightRoutes.js

const express = require("express");
const router = express.Router();
const {
  getAllProductWeights,
  getProductWeightById,
  createProductWeight,
  deleteProductWeightById,
  updateProductWeightById,
} = require("../controllers/productWeightController");

// Get all product weights
router.get("/", getAllProductWeights);

// Get a single product weight by id
router.get("/:id", getProductWeightById);

// Create a new product weight
router.post("/create", createProductWeight);

// Delete a product weight by id
router.delete("/:id", deleteProductWeightById);

// Update a product weight by id
router.put("/:id", updateProductWeightById);

module.exports = router;
