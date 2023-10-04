const mongoose = require("mongoose");
require("dotenv").config();

function connectDB() {
  try {
    mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.lblzs9a.mongodb.net/?retryWrites=true&w=majority`
    );
    console.log("connected to DB");
  } catch (err) {
    console.log("can not connect to DB");
  }
}

module.exports = connectDB;
