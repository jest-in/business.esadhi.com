const express = require("express");
const AuthController = require("../Controllers/authController");
const router = express.Router();

// Public
router.route("/login").post(AuthController.login);

// Super-Admin/Admin
router.use(
  AuthController.protect,
  AuthController.restrictTo("super-admin", "admin")
);
router.route("/logout").get(AuthController.logout);
router.route("/reset-password").patch(AuthController.updatePassword);

module.exports = router;
