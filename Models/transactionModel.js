const mongoose = require("mongoose");
const validator = require("validator");
const AppError = require("../utils/appError");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: String,
    // default: null,
    // unique: true,
    // sparse: true,
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
  parentId: {
    type: String,
    required: [true, "Please provide the parent ID"],
  },
  status: {
    type: String,
    required: [true, "Please provide the status of transaction"],
  },
  admin: {
    type: String,
    required: [true, "Please provide your admin"],
  },
  rewardRemarks: String,
});

transactionSchema.pre("findOneAndUpdate", async function (next) {
  const temp = await mongoose
    .model("Transaction")
    .findOne({ userId: this._update.userId });
  if (temp) next(new AppError("User Id is already assigned!", 400));
  next();
});

Transaction = new mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
