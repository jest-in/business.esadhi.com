const TransactionModel = require("../Models/transactionModel");
const UserModel = require("../Models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

module.exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/login");
});

module.exports.dashboard = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/overview", {
    scripts: ["/JS/chart.min.js", "/JS/basic.js", "/JS/dashboard.js"],
    heading: "Overview",
    selected: "dashboard",
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
    selected: "approvals",
  });
});

module.exports.pendingRewards = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/pending-rewards", {
    scripts: ["/JS/basic.js", "/JS/search.js", "/JS/pending-rewards.js"],
    heading: "Pending Rewards",
    selected: "pending-rewards",
  });
});

module.exports.completedRewards = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/completed-rewards", {
    scripts: ["/JS/basic.js", "/JS/search.js", "/JS/completed-rewards.js"],
    heading: "Completed Rewards",
    selected: "completed-rewards",
  });
});

module.exports.approvedClients = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Admin/approved-clients", {
    scripts: ["/JS/basic.js", "/JS/search.js", "/JS/admin-approved-clients.js"],
    heading: "Completed Rewards",
    selected: "approved-clients",
  });
});

module.exports.allAdmins = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/all-admins", {
    scripts: ["/JS/basic.js", "/JS/search.js", "/JS/all-admins.js"],
    heading: "All Admins",
    selected: "admins",
  });
});

module.exports.addAdmins = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/add-admin", {
    scripts: ["/JS/basic.js", "/JS/add-admin.js"],
    heading: "Add Admin",
    selected: "add-admin",
    popup: "success",
  });
});

module.exports.resetAdmin = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/reset-admin", {
    scripts: ["/JS/basic.js", "/JS/reset-admin.js"],
    heading: "Reset Admin",
    selected: "reset-admin",
    popup: "success",
  });
});

module.exports.clients = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/clients", {
    scripts: ["/JS/basic.js", "/JS/clients.js"],
    heading: "Clients",
    selected: "clients",
  });
});

module.exports.resetPassword = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Super-admin/reset-password", {
    scripts: ["/JS/basic.js", "/JS/search.js", "/JS/reset-pass.js"],
    heading: "Reset Password",
    selected: "reset-password",
    popup: "success",
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
      selected: "approvals",
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

module.exports.viewAdmin = catchAsync(async (req, res, next) => {
  const { email } = req.params;
  const admin = await UserModel.findOne({ email });
  if (!admin) return next(new AppError("Admin not found", 400));
  res.status(200).render(
    "Pages/Super-admin/admin",
    Object.assign(admin, {
      heading: "Admin Details",
      scripts: ["/JS/basic.js"],
    })
  );
});

module.exports.view = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await TransactionModel.findOne({ _id: id });
  const details = JSON.parse(JSON.stringify(user));
  const parent = await UserModel.findOne({ userId: user.parentId });
  if (user.parentId === "admin") details.parentName = "admin";
  else details.parentName = parent.name;
  details.parentId = undefined;
  res.status(200).render(
    "Pages/Super-admin/reward",
    Object.assign(details, {
      heading: "User Details",
      scripts: ["/JS/basic.js"],
    })
  );
});

// Admin
module.exports.adminDashboard = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Admin/dashboard", {
    scripts: ["/JS/basic.js", "/JS/search.js", "/JS/admin/all-clients.js"],
    selected: "dashboard",
  });
});

module.exports.pendingApprovals = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Admin/pending-approvals", {
    scripts: ["/JS/basic.js", "/JS/search.js", "/JS/Admin/approvals.js"],
    selected: "pending-approvals",
  });
});

module.exports.adminCompletedRewards = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Admin/completed-rewards", {
    scripts: ["/JS/basic.js", "/JS/search.js", "/JS/completed-rewards.js"],
    selected: "completed-rewards",
  });
});

module.exports.addClient = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Admin/add-clients", {
    scripts: ["/JS/basic.js", "/JS/add-client.js"],
    selected: "add-client",
    popup: "success",
  });
});

module.exports.adminClientView = catchAsync(async (req, res, next) => {
  const { email } = req.user;
  const { id } = req.params;
  const user = await TransactionModel.findOne({
    $and: [{ _id: id }, { admin: email }],
  });
  const details = JSON.parse(JSON.stringify(user));
  const parent = await TransactionModel.findOne({ userId: user.parentId });
  if (user.parentId === "admin") details.parentName = "admin";
  else details.parentName = parent.name;
  details.parentId = undefined;
  res.status(200).render(
    "Pages/Admin/view-client",
    Object.assign(details, {
      heading: "User Details",
      scripts: ["/JS/basic.js"],
    })
  );
});

module.exports.adminResetPassword = catchAsync(async (req, res, next) => {
  res.status(200).render("Pages/Admin/reset-password", {
    scripts: ["/JS/basic.js", "/JS/search.js", "/JS/reset-pass.js"],
    heading: "Reset Password",
    selected: "reset-password",
    popup: "success",
  });
});
