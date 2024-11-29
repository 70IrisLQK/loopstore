const mongoose = require("mongoose");
require("dotenv").config();

const databaseConnection = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("Connect database successfully.");
  } catch (error) {
    console.log("Connect database error at: ", error.message);
  }
};

module.exports = databaseConnection;
