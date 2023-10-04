const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};
exports.register = async (req, res) => {
  const { password, email, gender, dateOfBirth } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Invalid information", errors: errors.array() });
  }
  const existUser = await User.findOne({
    email: email.toLowerCase(),
  });
  if (existUser) {
    return res.status(400).json({ message: "Email is already taken" });
  }
  bcrypt.hash(password, 12, async (err, passwordHash) => {
    if (err) {
      return res
        .status(500)
        .json({ success: "false", message: "Couldn't hash the password" });
    } else if (passwordHash) {
      const newUser = new User({
        username: email.toLowerCase(),
        password: passwordHash,
        email: email.toLowerCase(),
        avatar: null,

        dateOfBirth,
      });
      try {
        await newUser.save();
      } catch (err) {
        console.log("err", err);
        return res
          .status(500)
          .json({ success: "false", message: "Couldn't create user" });
      }
      return res.json({
        success: "true",
        message: "Registered successfully",
        data: { user: newUser },
      });
    }
  });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Invalid information", errors: errors.array() });
  }

  try {
    const existUser = await User.findOne({
      username: username.toLowerCase(),
      emailVerified: true,
    });
    if (!existUser) {
      return res.status(400).json({ message: "User does not exist" });
    } else {
      bcrypt.compare(password, existUser.password, (err, compareRes) => {
        if (err) {
          res
            .status(502)
            .json({ message: "Error while checking user's password" });
        } else if (compareRes) {
          const accessToken = generateAccessToken(existUser._id);
          const refreshToken = generateRefreshToken(existUser._id);
          delete existUser.password;
          res.status(200).json({
            message: "User logged in successfully",
            data: { token: accessToken, refreshToken, user: existUser },
          });
        } else {
          res.status(401).json({ message: "Incorrect password" });
        }
      });
    }
    console.log("success");
  } catch (err) {
    res.status(500).json({ message: "SERVER ERROR" });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Invalid information", errors: errors.array() });
  }
  try {
    const user = await User.findById(req.userId);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    bcrypt.hash(newPassword, 12, async (err, passwordHash) => {
      if (err) {
        return res
          .status(500)
          .json({ success: "false", message: "Couldn't hash the password" });
      } else if (passwordHash) {
        user.password = passwordHash;
        try {
          await user.save();
        } catch (err) {
          console.log("err", err);
          return res
            .status(500)
            .json({ success: "false", message: "Couldn't update password" });
        }
        return res.json({
          success: "true",
          message: "Password changed successfully",
          data: { user },
        });
      }
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ message: "SERVER ERROR" });
  }
};
