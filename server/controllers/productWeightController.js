// controllers/productWeightController.js

const { ProductWeight } = require("../models/productWeight");

// Get all product weights
const getAllProductWeights = async (req, res) => {
  try {
    const productWeightList = await ProductWeight.find();
    if (!productWeightList) {
      return res
        .status(500)
        .json({ success: false, message: "No weights found" });
    }
    return res.status(200).json(productWeightList);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single product weight by id
const getProductWeightById = async (req, res) => {
  try {
    const item = await ProductWeight.findById(req.params.id);
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

// Create a new product weight
const createProductWeight = async (req, res) => {
  try {
    let productWeight = new ProductWeight({
      productWeight: req.body.productWeight,
    });

    productWeight = await productWeight.save();
    if (!productWeight) {
      return res
        .status(500)
        .json({ success: false, message: "Product weight could not be saved" });
    }
    return res.status(201).json(productWeight);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a product weight by id
const deleteProductWeightById = async (req, res) => {
  try {
    const deletedItem = await ProductWeight.findByIdAndDelete(req.params.id);
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

// Update a product weight by id
const updateProductWeightById = async (req, res) => {
  try {
    const item = await ProductWeight.findByIdAndUpdate(
      req.params.id,
      { productWeight: req.body.productWeight },
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
  getAllProductWeights,
  getProductWeightById,
  createProductWeight,
  deleteProductWeightById,
  updateProductWeightById,
};
