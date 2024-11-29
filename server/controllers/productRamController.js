const { ProductRams } = require("../models/productRAMS.js");

// Get all Product RAMs
const getAllProductRAMs = async (req, res) => {
  try {
    const productRAMsList = await ProductRams.find();

    if (!productRAMsList || productRAMsList.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Product RAMs found" });
    }

    res.status(200).json(productRAMsList);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch Product RAMs" });
  }
};

// Get a specific Product RAM by ID
const getProductRAMById = async (req, res) => {
  try {
    const productRAM = await ProductRams.findById(req.params.id);

    if (!productRAM) {
      return res.status(404).json({ message: "Product RAM not found" });
    }

    res.status(200).send(productRAM);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch Product RAM" });
  }
};

// Create a new Product RAM
const createProductRAM = async (req, res) => {
  try {
    const newProductRAM = new ProductRams({
      productRam: req.body.productRam,
    });

    const savedProductRAM = await newProductRAM.save();

    res.status(201).json(savedProductRAM);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to create Product RAM" });
  }
};

// Update an existing Product RAM
const updateProductRAM = async (req, res) => {
  try {
    const updatedProductRAM = await ProductRams.findByIdAndUpdate(
      req.params.id,
      { productRam: req.body.productRam },
      { new: true }
    );

    if (!updatedProductRAM) {
      return res
        .status(404)
        .json({ success: false, message: "Product RAM not found" });
    }

    res.status(200).json(updatedProductRAM);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to update Product RAM" });
  }
};

// Delete a Product RAM
const deleteProductRAM = async (req, res) => {
  try {
    const deletedProductRAM = await ProductRams.findByIdAndDelete(
      req.params.id
    );

    if (!deletedProductRAM) {
      return res.status(404).json({ message: "Product RAM not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Product RAM deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to delete Product RAM" });
  }
};

module.exports = {
  getAllProductRAMs,
  getProductRAMById,
  createProductRAM,
  updateProductRAM,
  deleteProductRAM,
};
