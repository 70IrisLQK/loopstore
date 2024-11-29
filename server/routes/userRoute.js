const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  uploadImages,
  signUp,
  signIn,
  changePassword,
  getUserList,
  getUserById,
  deleteUser,
  getUserCount,
  deleteImage,
} = require("../controllers/userController");

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
router.post("/signup", signUp);
router.post("/signin", signIn);
router.put("/changePassword/:id", changePassword);
router.get("/", getUserList);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);
router.get("/get/count", getUserCount);
router.delete("/deleteImage", deleteImage);

module.exports = router;
