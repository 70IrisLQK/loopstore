const { cloudinaryHelper, cloudinaryDestroy } = require("../helper/cloudinary");
const { HomeBanner } = require("../models/homeBanner");
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
      fs.unlinkSync(file.path); // Remove the local file
    }

    const imagesUploaded = new ImageUpload({ images: imagesArr });
    await imagesUploaded.save();
    res.status(200).json(imagesArr);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Image upload failed" });
  }
};

// Get all banner images
const getAllBanners = async (req, res) => {
  try {
    const banners = await HomeBanner.find();
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

// Get a single banner by ID
const getBannerById = async (req, res) => {
  try {
    const banner = await HomeBanner.findById(req.params.id);
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

// Create a new banner entry
const createBanner = async (req, res) => {
  try {
    const newBanner = new HomeBanner({ images: imagesArr });
    const savedBanner = await newBanner.save();
    imagesArr = []; // Reset the images array after saving
    res.status(201).json(savedBanner);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create banner" });
  }
};

// Delete a specific image from Cloudinary
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

// Delete a banner and its images
const deleteBanner = async (req, res) => {
  try {
    const banner = await HomeBanner.findById(req.params.id);
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

// Update an existing banner
const updateBanner = async (req, res) => {
  try {
    const updatedBanner = await HomeBanner.findByIdAndUpdate(
      req.params.id,
      { images: req.body.images },
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
  getAllBanners,
  getBannerById,
  createBanner,
  deleteImage,
  deleteBanner,
  updateBanner,
};
