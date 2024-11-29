const { User } = require("../models/user");
const { ImageUpload } = require("../models/imageUpload");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Controller logic
const uploadImages = async (req, res) => {
  const imagesArr = [];

  try {
    for (let i = 0; i < req.files.length; i++) {
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      };

      const result = await cloudinary.uploader.upload(
        req.files[i].path,
        options
      );
      imagesArr.push(result.secure_url);
      fs.unlinkSync(`uploads/${req.files[i].filename}`);
    }

    const imagesUploaded = new ImageUpload({ images: imagesArr });
    await imagesUploaded.save();

    return res.status(200).json(imagesArr);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error uploading images" });
  }
};

const signUp = async (req, res) => {
  const { name, phone, email, password, isAdmin } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    const existingUserByPhone = await User.findOne({ phone });

    if (existingUser) {
      return res.json({
        status: "FAILED",
        msg: "User already exists with this email!",
      });
    }

    if (existingUserByPhone) {
      return res.json({
        status: "FAILED",
        msg: "User already exists with this phone number!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
      isAdmin,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.JSON_WEB_TOKEN_SECRET_KEY
    );

    return res
      .status(200)
      .json({ user: result, token, msg: "User registered successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "FAILED", msg: "Something went wrong" });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: true, msg: "User not found!" });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(400).json({ error: true, msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JSON_WEB_TOKEN_SECRET_KEY
    );

    return res
      .status(200)
      .json({
        user: existingUser,
        token,
        msg: "User authenticated successfully",
      });
  } catch (error) {
    return res.status(500).json({ error: true, msg: "Something went wrong" });
  }
};

const changePassword = async (req, res) => {
  const { name, phone, email, password, newPass, images } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: true, msg: "User not found!" });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res
        .status(404)
        .json({ error: true, msg: "Current password is incorrect" });
    }

    const newPassword = newPass
      ? bcrypt.hashSync(newPass, 10)
      : existingUser.password;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, email, password: newPassword, images },
      { new: true }
    );

    if (!user) {
      return res
        .status(400)
        .json({ error: true, msg: "User cannot be updated!" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: true, msg: "Something went wrong" });
  }
};

const getUserList = async (req, res) => {
  try {
    const userList = await User.find();
    if (!userList) {
      return res.status(500).json({ success: false });
    }
    return res.status(200).json(userList);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(500)
        .json({ message: "User with the given ID was not found." });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: true, msg: "Something went wrong" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getUserCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    return res.status(200).json({ userCount });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const deleteImage = async (req, res) => {
  const imgUrl = req.query.img;
  const urlArr = imgUrl.split("/");
  const imageName = urlArr[urlArr.length - 1].split(".")[0];

  try {
    const response = await cloudinary.uploader.destroy(imageName);
    if (response) {
      return res.status(200).json(response);
    }
    return res.status(400).json({ error: "Error deleting image" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadImages,
  signUp,
  signIn,
  changePassword,
  getUserList,
  getUserById,
  deleteUser,
  getUserCount,
  deleteImage,
};
