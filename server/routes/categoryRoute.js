const express = require("express");
const multer = require("multer");
const {
  uploadImages,
  getAllCategories,
  getCategoryCount,
  getSubCategoryCount,
  getCategoryById,
  createCategory,
  deleteCategoryImage,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.array("images"), uploadImages);
router.get("/", getAllCategories);
router.get("/get/count", getCategoryCount);
router.get("/subCat/get/count", getSubCategoryCount);
router.get("/:id", getCategoryById);
router.post("/create", createCategory);
router.delete("/deleteImage", deleteCategoryImage);
router.delete("/:id", deleteCategory);
router.put("/:id", updateCategory);

module.exports = router;
