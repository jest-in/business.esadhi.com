const express = require("express");
const createIdController = require("../Controllers/createIdController");
const AuthController = require("../Controllers/authController");
const IdRouter = express.Router();

IdRouter.use(AuthController.protect, AuthController.restrictTo("super-admin"));

IdRouter.route("/create-ids").post(createIdController.createIds);

IdRouter.route("/download-ids").get(createIdController.downloadIds);

module.exports = IdRouter;
