const TransactionModel = require("../Models/transactionModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

module.exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/login");
});

module.exports.dashboard = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/overview", {
    scripts: ["/JS/basic.js", "/JS/search.js", "/JS/admin-all-clients.js"],
    heading: "Overview",
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
    heading: "Approvals",
  });
});

module.exports.pendingRewards = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/pending-rewards", {
    scripts: ["/JS/basic.js", "/JS/search.js", "/JS/pending-rewards.js"],
    heading: "Pending Rewards",
  });
});

module.exports.completedRewards = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/completed-rewards", {
    scripts: ["/JS/basic.js", "/JS/search.js", "/JS/completed-rewards.js"],
    heading: "Completed Rewards",
  });
});

module.exports.allAdmins = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/all-admins", {
    scripts: ["/JS/basic.js", "/JS/search.js", "/JS/all-admins.js"],
    heading: "All Admins",
  });
});

module.exports.addAdmins = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/add-admin", {
    scripts: ["/JS/basic.js", "/JS/add-admin.js"],
    heading: "Add Admin",
  });
});

module.exports.resetAdmin = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/reset-admin", {
    scripts: ["/JS/basic.js", "/JS/reset-admin.js"],
    heading: "Reset Admin",
  });
});

module.exports.clients = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/clients", {
    scripts: ["/JS/basic.js", "/JS/clients.js"],
    heading: "Clients",
  });
});

module.exports.resetPassword = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/reset-password", {
    scripts: ["/JS/basic.js", "/JS/search.js", "/JS/reset-password.js"],
    heading: "Reset Password",
  });
});

module.exports.approve = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await TransactionModel.findOne({ _id: id });
  const details = JSON.parse(JSON.stringify(user));
  const parent = await TransactionModel.findOne({ userId: user.parentId });
  if (user.parentId === "admin") details.parentName = "admin";
  else details.parentName = parent.name;
  details.parentId = undefined;
  res.status(200).render(
    "Pages/Super-admin/approve",
    Object.assign(details, {
      scripts: ["/JS/approve-client.js"],
      popup: "Approve",
      heading: "User Details",
    })
  );
});

module.exports.reward = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await TransactionModel.findOne({ _id: id });
  const details = JSON.parse(JSON.stringify(user));
  const parent = await TransactionModel.findOne({ userId: user.parentId });
  if (user.parentId === "admin") details.parentName = "admin";
  else details.parentName = parent.name;
  details.parentId = undefined;
  res.status(200).render(
    "Pages/Super-admin/reward",
    Object.assign(details, {
      scripts: ["/JS/approve-reward.js"],
      popup: "Reward",
      heading: "User Details",
    })
  );
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
