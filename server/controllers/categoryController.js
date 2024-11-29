const { cloudinaryHelper, cloudinaryDestroy } = require("../helper/cloudinary");
const { Category } = require("../models/category");
const { ImageUpload } = require("../models/imageUpload");
const fs = require("fs");

let imagesArr = [];

const uploadImages = async (req, res) => {
  imagesArr = [];

  try {
    // Upload each file in parallel and store the URLs in `imagesArr`
    for (const file of req.files) {
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      };

      const secureUrl = await cloudinaryHelper(file.path, options); // Use the helper
      imagesArr.push(secureUrl);

      fs.unlinkSync(file.path);
    }

    // Save image URLs to the database
    const imagesUploaded = new ImageUpload({ images: imagesArr });
    await imagesUploaded.save();

    return res.status(200).json(imagesArr); // Respond with the uploaded image URLs
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Image upload failed" });
  }
};

const createCategories = (categories, parentId = null) => {
  const categoryList = [];
  let category;

  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cat of category) {
    categoryList.push({
      _id: cat._id,
      id: cat._id,
      name: cat.name,
      images: cat.images,
      color: cat.color,
      slug: cat.slug,
      children: createCategories(categories, cat._id),
    });
  }

  return categoryList;
};

const getAllCategories = async (req, res) => {
  try {
    const categoryList = await Category.find();

    if (!categoryList) {
      res.status(500).json({ success: false });
    }

    if (categoryList) {
      const categoryData = createCategories(categoryList);

      return res.status(200).json({
        categoryList: categoryData,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

const getCategoryCount = async (req, res) => {
  const categoryCount = await Category.countDocuments({ parentId: undefined });

  if (!categoryCount) {
    res.status(500).json({ success: false });
  } else {
    res.send({
      categoryCount: categoryCount,
    });
  }
};

const getSubCategoryCount = async (req, res) => {
  const categoryCount = await Category.find();

  if (!categoryCount) {
    res.status(500).json({ success: false });
  } else {
    const subCatList = [];
    for (let cat of categoryCount) {
      if (cat.parentId !== undefined) {
        subCatList.push(cat);
      }
    }
    res.send({
      categoryCount: subCatList.length,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const categoryList = await Category.find();
    const category = await Category.findById(req.params.id);

    if (!category) {
      res
        .status(500)
        .json({ message: "The category with the given ID was not found." });
    }

    if (category) {
      const categoryData = createCat(categoryList, category._id, category);

      return res.status(200).json({
        categoryData,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

const createCategory = async (req, res) => {
  let catObj = {};

  if (imagesArr.length > 0) {
    catObj = {
      name: req.body.name,
      images: imagesArr,
      color: req.body.color,
      slug: req.body.name,
    };
  } else {
    catObj = {
      name: req.body.name,
      slug: req.body.name,
    };
  }

  if (req.body.parentId) {
    catObj.parentId = req.body.parentId;
  }

  let category = new Category(catObj);

  if (!category) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }

  category = await category.save();

  imagesArr = [];

  res.status(201).json(category);
};

const deleteCategoryImage = async (req, res) => {
  try {
    const imgUrl = req.query.img;
    const publicId = imgUrl.split("/").pop().split(".")[0];

    const result = await cloudinaryDestroy(publicId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete image" });
  }
};

const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  const images = category.images;

  for (img of images) {
    const imgUrl = img;
    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];

    const imageName = image.split(".")[0];

    await cloudinaryDestroy(imageName);
  }

  const deletedUser = await Category.findByIdAndDelete(req.params.id);

  if (!deletedUser) {
    res.status(404).json({
      message: "Category not found!",
      success: false,
    });
  }

  res.status(200).json({
    success: true,
    message: "Category Deleted!",
  });
};

const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      images: req.body.images,
      color: req.body.color,
    },
    { new: true }
  );
  if (!category) {
    return res.status(500).json({
      message: "Category cannot be updated!",
      success: false,
    });
  }
  imagesArr = [];
  res.send(category);
};

module.exports = {
  uploadImages,
  getAllCategories,
  getCategoryCount,
  getSubCategoryCount,
  getCategoryById,
  createCategory,
  deleteCategoryImage,
  deleteCategory,
  updateCategory,
};
