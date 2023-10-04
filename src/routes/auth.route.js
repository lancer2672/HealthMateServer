const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const { body } = require("express-validator");
const verifyToken = require("../middleware/verifyToken");

router.post(
  "/login",
  body("username").exists().withMessage("username is missing"),
  body("password").exists().withMessage("password is missing"),
  AuthController.login
);

router.put(
  "/change-password",
  verifyToken,
  body("currentPassword").exists().withMessage("currentPassword is missing"),
  body("newPassword").exists().withMessage("newPassword is missing"),
  AuthController.changePassword
);

router.post(
  "/register",
  body("password").exists().withMessage("password is missing"),
  body("email").exists().withMessage("email is missing"),
  AuthController.register
);
