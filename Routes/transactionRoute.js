const express = require("express");
const Transaction = require("../Controllers/transactionController");
const AuthController = require("../Controllers/authController");
const router = express.Router();

// Public
router.route("/user").get(Transaction.getUser);

router.route(AuthController.protect);

// Admin
router
  .route("/add")
  .post(AuthController.restrictTo("admin"), Transaction.addTransaction);

// Super-Admin/Admin
router
  .route("/view-added")
  .get(
    AuthController.restrictTo("super-admin", "admin"),
    Transaction.getAddedTransactions
  );

// Super-Admin
router.route(AuthController.restrictTo("super-admin"));
router.route("/user-details").get(Transaction.getTransaction);
router.route("/approve").patch(Transaction.approveTransaction);
router
  .route("/reward-eleigibles")
  .get(AuthController.protect, Transaction.rewardableMembers);
router
  .route("/reward")
  .patch(AuthController.protect, Transaction.rewardTransaction);
router
  .route("/rewarded-transactions")
  .get(AuthController.protect, Transaction.viewRewardedTransaction);

module.exports = router;
