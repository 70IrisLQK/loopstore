const {
  uploadImageProduct,
  getProducts,
  filterByCategoryName,
  filterByCategoryId,
  filterBySubCategoryId,
  filterByPrice,
  productRating,
  productCount,
  productFeatured,
  getProductRecentlyView,
  createProductRecentlyView,
  createProduct,
  getProductById,
  deleteImageProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController.js");
const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post(`/upload`, upload.array("images"), uploadImageProduct);

router.get(`/`, getProducts);

router.get(`/catName`, filterByCategoryName);

router.get(`/catId`, filterByCategoryId);

router.get(`/subCatId`, filterBySubCategoryId);

router.get(`/filterByPrice`, filterByPrice);

router.get(`/rating`, productRating);

router.get(`/get/count`, productCount);

router.get(`/featured`, productFeatured);

router.get(`/recentlyView`, getProductRecentlyView);

router.post(`/recentlyView`, createProductRecentlyView);

router.post(`/create`, createProduct);

router.get("/:id", getProductById);

router.delete("/deleteImage", deleteImageProduct);

router.delete("/:id", deleteProduct);

router.put("/:id", updateProduct);

module.exports = router;
