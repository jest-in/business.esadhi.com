const express = require("express");
const Transaction = require("../Controllers/transactionController");
const AuthController = require("../Controllers/authController");
const router = express.Router();

// Public
router.route("/user").get(Transaction.getUser);

// router.route(AuthController.protect);

// Admin
router
  .route("/add")
  .post(
    AuthController.protect,
    AuthController.restrictTo("admin"),
    Transaction.addTransaction
  );

// Super-Admin/Admin
router
  .route("/view-added")
  .get(
    AuthController.protect,
    AuthController.restrictTo("super-admin", "admin"),
    Transaction.getAddedTransactions
  );
router
  .route("/view-approved")
  .get(
    AuthController.protect,
    AuthController.restrictTo("super-admin", "admin"),
    Transaction.getApprovedTransactions
  );
router
  .route("/")
  .get(
    AuthController.protect,
    AuthController.restrictTo("super-admin", "admin"),
    Transaction.getAllTransactions
  );

// Super-Admin
router
  .route("/user-details")
  .get(
    AuthController.protect,
    AuthController.restrictTo("super-admin"),
    Transaction.getTransaction
  );
router
  .route("/approve")
  .patch(
    AuthController.protect,
    AuthController.restrictTo("super-admin"),
    Transaction.approveTransaction
  );
router
  .route("/reward-eleigibles")
  .get(
    AuthController.protect,
    AuthController.restrictTo("super-admin"),
    Transaction.rewardableMembers
  );
router
  .route("/reward")
  .patch(
    AuthController.protect,
    AuthController.restrictTo("super-admin"),
    Transaction.rewardTransaction
  );
router
  .route("/rewarded-transactions")
  .get(
    AuthController.protect,
    AuthController.restrictTo("super-admin", "admin"),
    Transaction.viewRewardedTransaction
  );

module.exports = router;
