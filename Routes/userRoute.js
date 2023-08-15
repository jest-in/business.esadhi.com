const express = require("express");
const User = require("../Controllers/userController");
const AuthController = require("../Controllers/authController");
const router = express.Router();

router.route(AuthController.protect, AuthController.restrictTo("super-admin"));

router.route("/add-admin").post(User.addAdmin);

router.route("/view-admins").get(User.viewAdmins);

router.route("/reset-admin-password").patch(User.resetAdmin);

module.exports = router;
