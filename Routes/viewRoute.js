const express = require("express");
const AuthController = require("../Controllers/authController");
const ViewController = require("../Controllers/viewController");
const router = express.Router();

// Public
router.route("/").get(ViewController.login);

// Admin
router
  .get(
    "/admin/dashboard",
    AuthController.protect,
    AuthController.restrictTo("admin"),
    ViewController.adminDashboard
  )
  .get(
    "/admin/add-client",
    AuthController.protect,
    AuthController.restrictTo("admin"),
    ViewController.addClient
  );

// Super Admin
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
    ViewController.pendingRewards
  )
  .get(
    "/completed-rewards",
    AuthController.protect,
    AuthController.restrictTo("super-admin"),
    ViewController.completedRewards
  )
  .get(
    "/admins",
    AuthController.protect,
    AuthController.restrictTo("super-admin"),
    ViewController.allAdmins
  )
  .get(
    "/add-admin",
    AuthController.protect,
    AuthController.restrictTo("super-admin"),
    ViewController.addAdmins
  )
  .get(
    "/reset-admin",
    AuthController.protect,
    AuthController.restrictTo("super-admin"),
    ViewController.resetAdmin
  )
  .get(
    "/clients",
    AuthController.protect,
    AuthController.restrictTo("super-admin"),
    ViewController.clients
  )
  .get(
    "/reset-password",
    AuthController.protect,
    AuthController.restrictTo("super-admin"),
    ViewController.resetPassword
  )
  .get(
    "/approve/:id",
    AuthController.protect,
    AuthController.restrictTo("super-admin"),
    ViewController.approve
  )
  .get(
    "/reward/:id",
    AuthController.protect,
    AuthController.restrictTo("super-admin"),
    ViewController.reward
  );

module.exports = router;
