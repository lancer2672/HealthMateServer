const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: Number,
      //0: male, 1:female
      enum: [0, 1],
      default: 0,
    },
    phoneNumber: {
      type: String,
    },
    avatar: {
      type: String,
    },
    FCMtoken: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("user", UserSchema);
