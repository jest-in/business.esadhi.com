const express = require("express");
const AuthController = require("../Controllers/authController");
const router = express.Router();

// Public
router.route("/login").post(AuthController.login);

// Super-Admin/Admin (error)
// router.route(
//   AuthController.protect,
//   AuthController.restrictTo("super-admin", "admin")
// );
router
  .route("/logout")
  .get(
    AuthController.protect,
    AuthController.restrictTo("super-admin", "admin"),
    AuthController.logout
  );
router
  .route("/reset-password")
  .patch(
    AuthController.protect,
    AuthController.restrictTo("super-admin", "admin"),
    AuthController.updatePassword
  );

module.exports = router;
