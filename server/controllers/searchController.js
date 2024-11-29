// controllers/productController.js
const { Product } = require("../models/products.js");

const getProducts = async (req, res) => {
  try {
    const query = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10; // Default perPage to 10 if not provided

    if (!query) {
      return res.status(400).json({ msg: "Query is required" });
    }

    const searchQuery = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
        { catName: { $regex: query, $options: "i" } },
      ],
    };

    // Handle pagination
    const totalPosts = await Product.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalPosts / perPage);
    const products = await Product.find(searchQuery)
      .populate("category")
      .skip((page - 1) * perPage) // Skip items for pagination
      .limit(perPage); // Limit items per page

    return res.status(200).json({
      products: products,
      totalPages: totalPages,
      page: page,
      perPage: perPage,
      totalPosts: totalPosts,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { getProducts };
