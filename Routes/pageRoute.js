const express = require("express");
const Transaction = require("../Controllers/transactionController");
const AuthController = require("../Controllers/authController");
const router = express.Router();

// Public
router.route("/").get((req, res, next) => {
  res.status(200).render("login");
});

// error
// router.route(AuthController.protect, AuthController.restrictTo("super-admin"));

// Admin
router
  .get(
    "/dashboard",
    AuthController.protect,
    AuthController.restrictTo("super-admin"),
    (req, res, next) => {
      res.status(200).render("dashboard");
    }
  )
  .get(
    "/approvals",
    AuthController.protect,
    AuthController.restrictTo("super-admin"),
    (req, res, next) => {
      res.status(200).render("approvals");
    }
  )
  .get(
    "/users/:id",
    AuthController.protect,
    AuthController.restrictTo("super-admin"),
    (req, res, next) => {
      res.status(200).render("user");
    }
  );

module.exports = router;
