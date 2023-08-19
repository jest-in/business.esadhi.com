const TransactionModel = require("../Models/transactionModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

module.exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/login");
});

module.exports.dashboard = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/overview", {
    scripts: ["/JS/basic.js", "/JS/search.js", "/JS/admin-all-clients.js"],
  });
});

module.exports.approvals = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/approval", {
    scripts: [
      "/JS/basic.js",
      "/JS/search.js",
      "/JS/approvals.js",
      "/JS/approve-client.js",
    ],
  });
});

module.exports.pendingRewards = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/pending-rewards", {
    scripts: ["/JS/basic.js", "/JS/search.js", "/JS/pending-rewards.js"],
  });
});

module.exports.completedRewards = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/completed-rewards", {
    scripts: ["/JS/basic.js", "/JS/search.js", "/JS/completed-rewards.js"],
  });
});

module.exports.allAdmins = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/all-admins", {
    scripts: ["/JS/basic.js", "/JS/search.js", "/JS/all-admins.js"],
  });
});

module.exports.addAdmins = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/add-admin", {
    scripts: ["/JS/basic.js", "/JS/add-admin.js"],
  });
});

module.exports.resetAdmin = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/reset-admin", {
    scripts: ["/JS/basic.js", "/JS/reset-admin.js"],
  });
});

module.exports.clients = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/clients", {
    scripts: ["/JS/basic.js", "/JS/clients.js"],
  });
});

module.exports.resetPassword = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/reset-password", {
    scripts: ["/JS/basic.js", "/JS/search.js", "/JS/reset-password.js"],
  });
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

// Admin
module.exports.adminDashboard = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/admin/dashboard", {
    scripts: ["/JS/basic.js", "/JS/search.js", "/JS/admin-all-clients.js"],
  });
});

module.exports.addClient = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/admin/add-clients", {
    scripts: ["/JS/basic.js", "/JS/add-client.js"],
  });
});
