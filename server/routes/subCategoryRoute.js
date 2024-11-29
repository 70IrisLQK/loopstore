const express = require("express");
const router = express.Router();
const {
  getSubCategories,
  getSubCategoryCount,
  getSubCategoryById,
  createSubCategory,
  deleteSubCategory,
  updateSubCategory,
} = require("../controllers/subCategoryController");

router.get("/", getSubCategories);
router.get("/get/count", getSubCategoryCount);
router.get("/:id", getSubCategoryById);
router.post("/create", createSubCategory);
router.delete("/:id", deleteSubCategory);
router.put("/:id", updateSubCategory);

module.exports = router;
