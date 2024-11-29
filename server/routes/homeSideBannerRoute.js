const express = require("express");
const multer = require("multer");
const {
  uploadImages,
  getAllSideBanners,
  getSideBannerById,
  createSideBanner,
  deleteImage,
  deleteSideBanner,
  updateSideBanner,
} = require("../controllers/homeSideBannerController");

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
router.get("/", getAllSideBanners);
router.get("/:id", getSideBannerById);
router.post("/create", createSideBanner);
router.delete("/deleteImage", deleteImage);
router.delete("/:id", deleteSideBanner);
router.put("/:id", updateSideBanner);

module.exports = router;
