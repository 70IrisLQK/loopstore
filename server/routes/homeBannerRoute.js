const express = require("express");
const multer = require("multer");
const {
  uploadImages,
  getAllBanners,
  getBannerById,
  createBanner,
  deleteImage,
  deleteBanner,
  updateBanner,
} = require("../controllers/homeBannerController");

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
router.get("/", getAllBanners);
router.get("/:id", getBannerById);
router.post("/create", createBanner);
router.delete("/deleteImage", deleteImage);
router.delete("/:id", deleteBanner);
router.put("/:id", updateBanner);

module.exports = router;
