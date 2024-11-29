const { SubCategory } = require("../models/subCat");

const getSubCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10; // Set a default value for perPage
    const totalPosts = await SubCategory.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    let subCategoryList = [];

    if (page > totalPages) {
      return res.status(404).json({ message: "No data found!" });
    }

    if (req.query.page !== undefined && req.query.perPage !== undefined) {
      subCategoryList = await SubCategory.find()
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    } else {
      subCategoryList = await SubCategory.find().populate("category");
    }

    if (!subCategoryList) {
      return res.status(500).json({ success: false });
    }

    return res.status(200).json({
      subCategoryList: subCategoryList,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getSubCategoryCount = async (req, res) => {
  try {
    const subCatCount = await SubCategory.countDocuments();

    if (!subCatCount) {
      return res.status(500).json({ success: false });
    }
    return res.status(200).json({ subCatCount: subCatCount });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getSubCategoryById = async (req, res) => {
  try {
    const subCat = await SubCategory.findById(req.params.id).populate(
      "category"
    );

    if (!subCat) {
      return res
        .status(500)
        .json({ message: "The sub category with the given ID was not found." });
    }

    return res.status(200).send(subCat);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const createSubCategory = async (req, res) => {
  try {
    let subCat = new SubCategory({
      category: req.body.category,
      subCat: req.body.subCat,
    });

    subCat = await subCat.save();
    return res.status(201).json(subCat);
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

const deleteSubCategory = async (req, res) => {
  try {
    const deletedSubCat = await SubCategory.findByIdAndDelete(req.params.id);

    if (!deletedSubCat) {
      return res.status(404).json({
        message: "Sub Category not found!",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Sub Category Deleted!",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const updateSubCategory = async (req, res) => {
  try {
    const subCat = await SubCategory.findByIdAndUpdate(
      req.params.id,
      {
        category: req.body.category,
        subCat: req.body.subCat,
      },
      { new: true }
    );

    if (!subCat) {
      return res.status(500).json({
        message: "Sub Category cannot be updated!",
        success: false,
      });
    }

    return res.send(subCat);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getSubCategories,
  getSubCategoryCount,
  getSubCategoryById,
  createSubCategory,
  deleteSubCategory,
  updateSubCategory,
};
