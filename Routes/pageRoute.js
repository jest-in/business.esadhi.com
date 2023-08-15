const express = require("express");
const Transaction = require("../Controllers/transactionController");
const AuthController = require("../Controllers/authController");
const router = express.Router();

// Public
router.route("/").get((req, res, next) => {
  res.status(200).render("login");
});

router.route(AuthController.protect, AuthController.restrictTo("super-admin"));

// Admin
router
  .get("/approvals", (req, res, next) => {
    res.status(200).render("approvals");
  })
  .get("/dashboard", (req, res, next) => {
    res.status(200).render("dashboard");
  });

module.exports = router;
