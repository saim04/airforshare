require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URI}`);
    console.log("Database Connected successfully");
  } catch (error) {
    console.error("Error while connecting with database", error.message);
  }
};

module.exports = connectDB;
