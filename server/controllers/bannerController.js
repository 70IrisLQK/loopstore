const { cloudinaryDestroy, cloudinaryHelper } = require("../helper/cloudinary");
const { Banner } = require("../models/banners");
const { ImageUpload } = require("../models/imageUpload");
const fs = require("fs");

var imagesArr = [];

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

const getAllBanners = async (req, res) => {
  try {
    const bannerList = await Banner.find();

    if (!bannerList) {
      res.status(500).json({ success: false });
    }

    return res.status(200).json(bannerList);
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

const getBannerById = async (req, res) => {
  try {
    const slide = await Banner.findById(req.params.id);
    if (!slide) {
      return res
        .status(404)
        .json({ message: "The Banner with the given ID was not found." });
    }
    return res.status(200).send(slide);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createBanner = async (req, res) => {
  try {
    let newEntry = new Banner({
      images: imagesArr,
      catId: req.body.catId,
      catName: req.body.catName,
      subCatId: req.body.subCatId,
      subCatName: req.body.subCatName,
    });

    newEntry = await newEntry.save();
    imagesArr = [];
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ error: "Failed to create banner", success: false });
  }
};

const deleteImage = async (req, res) => {
  try {
    const imgUrl = req.query.img;
    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];
    const imageName = image.split(".")[0];

    const response = await cloudinaryDestroy(imageName);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete image" });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const item = await Banner.findById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ message: "Banner not found!", success: false });
    }

    const images = item.images;
    for (let img of images) {
      const urlArr = img.split("/");
      const image = urlArr[urlArr.length - 1];
      const imageName = image.split(".")[0];
      await cloudinaryDestroy(imageName);
    }

    await Banner.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Banner Deleted!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete banner" });
  }
};

const updateBanner = async (req, res) => {
  try {
    const slideItem = await Banner.findByIdAndUpdate(
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

    if (!slideItem) {
      return res
        .status(500)
        .json({ message: "Item cannot be updated!", success: false });
    }

    imagesArr = [];
    res.send(slideItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to update banner" });
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
