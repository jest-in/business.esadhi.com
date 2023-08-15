const TransactionModel = require("../Models/transactionModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

module.exports.getUser = catchAsync(async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) return next(new AppError("Please provide user Id!", 400));
  const user = await TransactionModel.findOne({ userId });
  if (!user) return next(new AppError("User does not exist!", 400));
  else {
    let parentName;
    if (user.parentId !== "admin")
      parentName = await TransactionModel.findOne(
        { userId: user.parentId },
        "name"
      );
    const childNames = await TransactionModel.find(
      { parentId: user.userId, status: { $ne: "added" } },
      "name"
    );
    res.status(200).json({
      status: "success",
      details: {
        parentName: user.parentId !== "admin" ? parentName.name : "admin",
        childNames,
        name: user.name,
      },
    });
  }
});

// super-admin/admin
module.exports.getAddedTransactions = catchAsync(async (req, res, next) => {
  const { role, email } = req.user;
  const transactions = await TransactionModel.find(
    role !== "admin"
      ? { status: "added" }
      : { $and: [{ status: "added" }, { admin: email }] }
  );
  res.status(200).json({
    status: "success",
    transactions,
  });
});

module.exports.addTransaction = catchAsync(async (req, res, next) => {
  let { name, address, category, phoneNo, email, parentId } = req.body;
  if (!name || !address || !phoneNo || !email || !parentId)
    return next(new AppError("Please provide required fields!", 400));

  if (parentId !== "admin") {
    // Check whether the parent exists
    const parent = await TransactionModel.find({
      $and: [{ userId: parentId }, { admin: req.user.email }],
    });
    if (!parent.length) return next(new AppError("Parent not found!", 400));
    else category = parent[0].category;
  }
  // Check category field exists
  if (!category)
    return next(new AppError("Please provide category field!", 400));
  // if parent has 4 members already under him
  if (
    (await TransactionModel.countDocuments({
      $and: [{ parentId }, { parentId: { $ne: "admin" } }],
    })) >= 4
  )
    return next(new AppError("Parent Id is full!", 400));
  else {
    const transaction = {
      name,
      phoneNo,
      email,
      address,
      parentId,
      admin: req.user.email,
      status: "added",
      category,
    };
    if (await TransactionModel.create(transaction))
      res.status(200).json({
        status: "success",
        message: "Added successfully",
      });
  }
});

module.exports.getTransaction = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  if (!id) return next(new AppError("Transaction is not selected!", 400));
  else {
    const user = await TransactionModel.findById(id);
    let details = JSON.parse(JSON.stringify(user));
    const parent = await TransactionModel.findOne({ userId: user.parentId });
    // console.log(parent);
    if (user.parentId === "admin") details["parentName"] = "admin";
    else details["parentName"] = parent.name;
    details.parent = undefined;
    res.status(200).json({
      status: "success",
      details,
    });
  }
});

// Approve added transaction
module.exports.approveTransaction = catchAsync(async (req, res, next) => {
  const { id, userId } = req.body;
  if (!id || !userId)
    return next(new AppError("Please provide required fields!", 400));

  // Check whether transaction is already approved
  if (
    await TransactionModel.find({
      $and: [{ _id: id }, { status: "approved" }],
    })
  )
    return next(new AppError("Already approved.", 400));
  // Approved
  if (
    await TransactionModel.updateOne(
      { _id: id },
      {
        userId,
        status: "approved",
      }
    )
  )
    res.status(200).json({
      status: "success",
      message: "Approved successfully",
    });
});

// (super-admin)Retrieve eligible members for reward
module.exports.rewardableMembers = catchAsync(async (req, res, next) => {
  const approvedIds = await TransactionModel.find({ status: "approved" });
  const eligibleMembers = [];
  for (user of approvedIds) {
    const count = await TransactionModel.countDocuments({
      $and: [{ parentId: user.userId }, { status: { $ne: "added" } }],
    });
    if (count === 4) eligibleMembers.push(user);
  }

  res.status(200).json({
    status: "success",
    eligibleMembers,
  });
});

module.exports.rewardTransaction = catchAsync(async (req, res, next) => {
  const { userId, rewardRemarks } = req.body;
  if (!userId || !rewardRemarks || rewardRemarks === null)
    return next(new AppError("Please provide required details!"), 400);
  if (
    (await TransactionModel.countDocuments({
      $and: [{ parentId: userId }, { status: "approved" }],
    })) !== 4
  )
    return next(new AppError("This user is not eligible for reward!", 400));
  else {
    if (
      await TransactionModel.findOneAndUpdate(
        { userId },
        { status: "rewarded", rewardRemarks }
      )
    )
      res.status(200).json({
        status: "success",
        message: "Rewarded Successfully",
      });
  }
});

module.exports.viewRewardedTransaction = catchAsync(async (req, res, next) => {
  const transactions = await TransactionModel.find({ status: "rewarded" });
  res.status(200).json({
    status: "success",
    transactions,
  });
});
