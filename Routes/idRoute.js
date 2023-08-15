const express = require("express");
const IdController = require("../Controllers/CreateIdController");
const AuthController = require("../Controllers/authController");
const IdRouter = express.Router();

IdRouter.route(
  AuthController.protect,
  AuthController.restrictTo("super-admin")
);

IdRouter.route("/create-ids").post(IdController.createIds);

IdRouter.route("/download-ids").get(IdController.downloadIds);

module.exports = IdRouter;
