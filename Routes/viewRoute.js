const express = require("express");
const AuthController = require("../Controllers/authController");
const ViewController = require("../Controllers/viewController");
const router = express.Router();

// Public
router.route("/").get(ViewController.login);

// Admin
router
  .get(
    "/dashboard",
    AuthController.protect,
    AuthController.restrictTo("super-admin"),
    ViewController.dashboard
  )
  .get(
    "/approvals",
    AuthController.protect,
    AuthController.restrictTo("super-admin"),
    ViewController.approvals
  )
  .get(
    "/pending-rewards",
    AuthController.protect,
    AuthController.restrictTo("super-admin"),
    (req, res, next) => {
      // Not ready
      res.status(200).render("approvals");
    }
  )
  .get(
    "/users/:id",
    AuthController.protect,
    AuthController.restrictTo("super-admin"),
    ViewController.user
  );

module.exports = router;
