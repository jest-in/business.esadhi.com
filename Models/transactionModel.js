const mongoose = require("mongoose");
const validator = require("validator");
const AppError = require("../utils/appError");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  name: {
    type: String,
    required: [true, "Please provide name"],
    lowercase: true,
  },
  phoneNo: {
    type: String,
    required: [true, "Please provide phone number"],
    // Not working
    // validate: [validator.isMobilePhone, "Please provide valid email"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email ID"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide valid email"],
  },
  address: {
    type: String,
    required: [true, "Please provide address"],
  },
  parentId: {
    type: String,
    required: [true, "Please provide the parent ID"],
  },
  status: {
    type: String,
    required: [true, "Please provide the status of transaction"],
  },
  category: {
    type: String,
    required: [true, "Please provide the category"],
  },
  admin: {
    type: String,
    required: [true, "Please provide your admin"],
  },
  rewardRemarks: String,
  addedDate: Date,
  approvedDate: Date,
  rewardedDate: Date,
});

transactionSchema.pre("updateOne", async function (next) {
  if (
    await mongoose.model("Transaction").exists({ userId: this._update.userId })
  )
    next(new AppError("User Id is not valid!", 400));
  next();
});

Transaction = new mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
