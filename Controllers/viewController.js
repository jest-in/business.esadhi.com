const TransactionModel = require("../Models/transactionModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

module.exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render("login");
});

module.exports.dashboard = catchAsync(async (req, res, next) => {
  res.status(200).render("dashboard");
});

module.exports.approvals = catchAsync(async (req, res, next) => {
  res.status(200).render("approvals");
});

module.exports.user = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await TransactionModel.findOne({ _id: id });
  const details = JSON.parse(JSON.stringify(user));
  const parent = await TransactionModel.findOne({ userId: user.parentId });
  if (user.parentId === "admin") details.parentName = "admin";
  else details.parentName = parent.name;
  details.parentId = undefined;
  res.status(200).render("user", details);
});
