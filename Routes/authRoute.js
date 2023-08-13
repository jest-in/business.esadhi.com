const express = require("express");
const AuthController = require("../Controllers/authController");
const router = express.Router();

// Public
// router.route("/signup").post(AuthController.signup);
router.route("/login").post(AuthController.login);

// Super-Admin/Admin
router
  .route("/reset-password")
  .patch(
    AuthController.protect,
    AuthController.restrictTo("super-admin", "admin"),
    AuthController.updatePassword
  );

module.exports = router;
