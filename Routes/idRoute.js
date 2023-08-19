const express = require("express");
const IdController = require("../Controllers/CreateIdController");
const AuthController = require("../Controllers/authController");
const IdRouter = express.Router();

// error
// IdRouter.route(
//   AuthController.protect,
//   AuthController.restrictTo("super-admin")
// );

IdRouter.route("/create-ids").post(
  AuthController.protect,
  AuthController.restrictTo("super-admin"),
  IdController.createIds
);

IdRouter.route("/download-ids").get(
  AuthController.protect,
  AuthController.restrictTo("super-admin"),
  IdController.downloadIds
);

module.exports = IdRouter;
