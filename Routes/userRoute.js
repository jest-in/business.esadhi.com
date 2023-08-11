const express = require("express");
const AuthController = require("../Controllers/authController");
const router = express.Router();

router.route("/signup").post(AuthController.signup);

router.route("/login").post(AuthController.login);

router
  .route("/reset-password")
  .patch(AuthController.protect, AuthController.updatePassword);

module.exports = router;
