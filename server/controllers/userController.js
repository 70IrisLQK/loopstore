const { User } = require("../models/user");
const { ImageUpload } = require("../models/imageUpload");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { randomCode } = require("../helper/main");
const { sendOTPEmail } = require("../helper/send-mail");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
var imagesArr = [];
// Controller logic
const uploadImages = async (req, res) => {
  imagesArr = [];

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
    return res.status(500).json({ error: "Error uploading images" });
  }
};

const signUp = async (req, res) => {
  const { name, phone, email, password, isAdmin } = req.body;

  try {
    // Generate verify code
    const verifyCode = await randomCode();
    let user;

    const existingUser = await User.findOne({ email: email });
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

    const hashPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      existingUser.password = hashPassword;
      existingUser.otp = verifyCode;
      existingUser.otpExpired = Date.now() + 600000; // 10 minutes
      await existingUser.save();
      user = existingUser;
    } else {
      if (isAdmin === true) {
        user = new User({
          name,
          email,
          phone,
          password: hashPassword,
          isAdmin,
          isVerified: true,
        });
      } else {
        user = new User({
          name,
          email,
          phone,
          password: hashPassword,
          isAdmin,
          otp: verifyCode,
          otpExpired: Date.now() + 600000, // 10 minutes
        });
      }

      await user.save();
    }

    await sendOTPEmail(email, verifyCode);

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.TOKEN_SECRET_KEY
    );

    return res.status(200).json({
      success: true,
      token,
      msg: "User registered successfully! Please verify your email",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "FAILED", msg: "Something went wrong" });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ error: true, msg: "User not found!" });
    }
    if (existingUser.isVerified === false) {
      return res.status(400).json({
        error: true,
        isVerify: false,
        msg: "Your account is not active yet. Please active your account!",
      });
    }
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(400).json({ error: true, msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.TOKEN_SECRET_KEY
    );

    return res.status(200).json({
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

  const existingUser = await User.findOne({ email: email });
  if (!existingUser) {
    res.status(404).json({ error: true, msg: "User not found!" });
  }

  const matchPassword = await bcrypt.compare(password, existingUser.password);

  if (!matchPassword) {
    res.status(404).json({ error: true, msg: "Current password wrong" });
  } else {
    let newPassword;

    if (newPass) {
      newPassword = bcrypt.hashSync(newPass, 10);
    } else {
      newPassword = existingUser.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: name,
        phone: phone,
        email: email,
        password: newPassword,
        images: images,
      },
      { new: true }
    );

    if (!user)
      return res
        .status(400)
        .json({ error: true, msg: "The user cannot be Updated!" });

    res.send(user);
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

const signInWithGoogle = async (req, res) => {
  const { name, phone, email, password, images, isAdmin } = req.body;
  const existingUser = await User.findOne({ email: email });
  try {
    if (!existingUser) {
      const result = await User.create({
        name: name,
        phone: phone,
        email: email,
        password: password,
        images: images,
        isAdmin: isAdmin,
        isVerified: true,
      });

      const token = jwt.sign(
        { email: result.email, id: result._id },
        process.env.TOKEN_SECRET_KEY
      );

      return res
        .status(200)
        .json({ user: result, token: token, msg: "User login successfully." });
    } else {
      if (!existingUser.isAdmin) {
        return res.status(403).json({ error: true, msg: "User is not admin." });
      }
      const token = jwt.sign(
        { email: existingUser.email, id: existingUser._id },
        process.env.TOKEN_SECRET_KEY
      );

      return res.status(200).json({
        user: existingUser,
        token: token,
        msg: "User login successfully.",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: true, msg: "Something went wrong" });
  }
};

const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const verifyCode = await randomCode();

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "OTP Send",
        otp: verifyCode,
        existingUserId: existingUser._id,
      });
    }
  } catch (error) {
    return res.json({ status: "FAILED", msg: "Something went wrong" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    const isCodeValid = user.otp === otp;
    const isNotExpired = user.otpExpired > Date.now();

    if (isCodeValid && isNotExpired) {
      user.isVerified = true;
      user.otp = null;
      user.otpExpired = null;
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Email verified successfully.",
      });
    } else if (!isCodeValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid code.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "OTP expired code.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in verify mail",
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Generate verify code
    const verifyCode = await randomCode();

    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      return res.json({
        status: "FAILED",
        msg: "User not exists with this email!",
      });
    }

    if (existingUser) {
      existingUser.otp = verifyCode;
      existingUser.otpExpired = Date.now() + 600000; // 10 minutes
      await existingUser.save();
    }

    await sendOTPEmail(email, verifyCode);

    return res.status(200).json({
      success: true,
      status: "SUCCESS",
      msg: "OTP send",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "FAILED", msg: "Something went wrong" });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.json({
        status: "FAILED",
        msg: "User not exists with this email!",
      });
    }

    if (existingUser) {
      const hashPassword = await bcrypt.hash(newPassword, 10);
      existingUser.password = hashPassword;
      await existingUser.save();
    }

    return res.status(200).json({
      success: true,
      status: "SUCCESS",
      msg: "Change password successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "FAILED", msg: "Something went wrong" });
  }
};
const updateUser = async (req, res) => {
  const { name, phone, email } = req.body;

  const userExist = await User.findById(req.params.id);

  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10);
  } else {
    newPassword = userExist.passwordHash;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: name,
      phone: phone,
      email: email,
      password: newPassword,
      images: imagesArr,
    },
    { new: true }
  );

  if (!user) return res.status(400).send("The user cannot be Updated!");

  res.send(user);
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
  signInWithGoogle,
  resendOtp,
  verifyEmail,
  forgotPassword,
  resetPassword,
  updateUser,
};
