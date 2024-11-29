const { cloudinaryHelper, cloudinaryDestroy } = require("../helper/cloudinary");
const { HomeSideBanners } = require("../models/homeSideBanner");
const { ImageUpload } = require("../models/imageUpload");

const fs = require("fs");

let imagesArr = [];

// Upload images to Cloudinary
const uploadImages = async (req, res) => {
  imagesArr = [];
  try {
    for (const file of req?.files || []) {
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      };
      const secureUrl = await cloudinaryHelper(file.path, options); // Use the helper
      imagesArr.push(secureUrl);
      fs.unlinkSync(file.path); // Delete local file after upload
    }

    const imagesUploaded = new ImageUpload({ images: imagesArr });
    await imagesUploaded.save();
    res.status(200).json(imagesArr);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Image upload failed" });
  }
};

// Get all side banners
const getAllSideBanners = async (req, res) => {
  try {
    const banners = await HomeSideBanners.find();
    if (!banners) {
      return res
        .status(500)
        .json({ success: false, error: "Failed to fetch banners" });
    }
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch banners" });
  }
};

// Get side banner by ID
const getSideBannerById = async (req, res) => {
  try {
    const banner = await HomeSideBanners.findById(req.params.id);
    if (!banner) {
      return res
        .status(404)
        .json({ success: false, error: "Banner not found" });
    }
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch banner" });
  }
};

// Create a new side banner
const createSideBanner = async (req, res) => {
  try {
    const newBanner = new HomeSideBanners({
      images: imagesArr,
      catId: req.body.catId,
      catName: req.body.catName,
      subCatId: req.body.subCatId,
      subCatName: req.body.subCatName,
    });

    const savedBanner = await newBanner.save();
    imagesArr = []; // Reset images array after saving
    res.status(201).json(savedBanner);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create banner" });
  }
};

// Delete an image from Cloudinary
const deleteImage = async (req, res) => {
  try {
    const imgUrl = req.query.img;
    const publicId = imgUrl.split("/").pop().split(".")[0];

    const result = await cloudinaryDestroy(publicId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete image" });
  }
};

// Delete a side banner and its associated images
const deleteSideBanner = async (req, res) => {
  try {
    const banner = await HomeSideBanners.findById(req.params.id);
    if (!banner) {
      return res
        .status(404)
        .json({ success: false, error: "Banner not found" });
    }

    for (const img of banner.images) {
      const publicId = img.split("/").pop().split(".")[0];

      await cloudinaryDestroy(publicId);
    }

    await banner.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete banner" });
  }
};

// Update a side banner
const updateSideBanner = async (req, res) => {
  try {
    const updatedBanner = await HomeSideBanners.findByIdAndUpdate(
      req.params.id,
      {
        images: req.body.images,
        catId: req.body.catId,
        catName: req.body.catName,
        subCatId: req.body.subCatId,
        subCatName: req.body.subCatName,
      },
      { new: true }
    );

    if (!updatedBanner) {
      return res
        .status(404)
        .json({ success: false, error: "Banner not found" });
    }

    imagesArr = [];
    res.status(200).json(updatedBanner);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update banner" });
  }
};

module.exports = {
  uploadImages,
  getAllSideBanners,
  getSideBannerById,
  createSideBanner,
  deleteImage,
  deleteSideBanner,
  updateSideBanner,
};
