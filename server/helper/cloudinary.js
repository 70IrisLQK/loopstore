const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const cloudinaryHelper = async (filePath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, options);

    return result.secure_url; // Return the URL of the uploaded file
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Image upload failed");
  }
};

const cloudinaryDestroy = async (imageName) => {
  try {
    const result = await cloudinary.uploader.destroy(imageName);
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Image destroy failed");
  }
};

module.exports = { cloudinaryHelper, cloudinaryDestroy };
