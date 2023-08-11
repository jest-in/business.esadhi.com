const express = require("express");
const Transaction = require("../Controllers/transactionController");
const AuthController = require("../Controllers/authController");
const router = express.Router();

router
  .route("/add")
  // .get(AuthController.protect, Transaction.getTransactions)
  .post(AuthController.protect, Transaction.addTransaction);

router
  .route("/view-added")
  .get(AuthController.protect, Transaction.getAddedTransactions);

router
  .route("/approve")
  .patch(AuthController.protect, Transaction.approveTransaction);

router
  .route("/reward-eleigibles")
  .get(AuthController.protect, Transaction.rewardableMembers);

router
  .route("/reward")
  .patch(AuthController.protect, Transaction.rewardTransaction);

module.exports = router;
