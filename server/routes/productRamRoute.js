const express = require("express");
const {
  getAllProductRAMs,
  getProductRAMById,
  createProductRAM,
  updateProductRAM,
  deleteProductRAM,
} = require("../controllers/productRamController.js");

const router = express.Router();

router.get("/", getAllProductRAMs);
router.get("/:id", getProductRAMById);
router.post("/create", createProductRAM);
router.put("/:id", updateProductRAM);
router.delete("/:id", deleteProductRAM);

module.exports = router;
