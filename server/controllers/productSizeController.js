// controllers/productSizeController.js

const { ProductSize } = require("../models/productSize");

// Get all product sizes
const getAllProductSizes = async (req, res) => {
  try {
    const productSizeList = await ProductSize.find();
    if (!productSizeList) {
      return res
        .status(500)
        .json({ success: false, message: "No sizes found" });
    }
    return res.status(200).json(productSizeList);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single product size by id
const getProductSizeById = async (req, res) => {
  try {
    const item = await ProductSize.findById(req.params.id);
    if (!item) {
      return res
        .status(500)
        .json({ message: "The item with the given ID was not found." });
    }
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new product size
const createProductSize = async (req, res) => {
  try {
    let productsize = new ProductSize({
      size: req.body.size,
    });

    productsize = await productsize.save();
    if (!productsize) {
      return res
        .status(500)
        .json({ success: false, message: "Product size could not be saved" });
    }
    return res.status(201).json(productsize);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a product size by id
const deleteProductSizeById = async (req, res) => {
  try {
    const deletedItem = await ProductSize.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res
        .status(404)
        .json({ message: "Item not found!", success: false });
    }
    return res.status(200).json({ success: true, message: "Item Deleted!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update a product size by id
const updateProductSizeById = async (req, res) => {
  try {
    const item = await ProductSize.findByIdAndUpdate(
      req.params.id,
      { size: req.body.size },
      { new: true }
    );

    if (!item) {
      return res.status(500).json({
        message: "Item cannot be updated!",
        success: false,
      });
    }

    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProductSizes,
  getProductSizeById,
  createProductSize,
  deleteProductSizeById,
  updateProductSizeById,
};
