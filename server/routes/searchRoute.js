// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const { getProducts } = require("../controllers/searchController");

router.get("/", getProducts);

module.exports = router;
