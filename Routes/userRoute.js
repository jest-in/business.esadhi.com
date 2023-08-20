const express = require("express");
const User = require("../Controllers/userController");
const AuthController = require("../Controllers/authController");
const router = express.Router();

router
  .route("/add-admin")
  .post(
    AuthController.protect,
    AuthController.restrictTo("super-admin"),
    User.addAdmin
  );

router
  .route("/view-admins")
  .get(
    AuthController.protect,
    AuthController.restrictTo("super-admin"),
    User.viewAdmins
  );

router
  .route("/reset-admin-password")
  .patch(
    AuthController.protect,
    AuthController.restrictTo("super-admin"),
    User.resetAdmin
  );

module.exports = router;
