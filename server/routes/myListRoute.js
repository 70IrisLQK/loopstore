const express = require("express");
const {
  getAllItems,
  getItemById,
  addItem,
  deleteItem,
} = require("../controllers/myListController");

const router = express.Router();

router.get("/", getAllItems);
router.get("/:id", getItemById);
router.post("/add", addItem);
router.delete("/:id", deleteItem);

module.exports = router;
