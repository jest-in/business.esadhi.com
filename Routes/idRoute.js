const express = require("express");
const createIdController = require("../Controllers/CreateIdController");
const AuthController = require("../Controllers/authController");
const IdRouter = express.Router();

IdRouter.route("/").post(AuthController.protect, createIdController);

module.exports = IdRouter;
