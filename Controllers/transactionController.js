const TransactionModel = require("../Models/transactionModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

module.exports.getTransactions = catchAsync(async (req, res, next) => {
  let transactions = await TransactionModel.find({});
  res.status(200).json({
    status: "success",
    transactions,
  });
});

module.exports.addTransaction = catchAsync(async (req, res, next) => {
  let { phoneNo, email, parentId } = req.body;
  // Check whether the parent exists other than admin
  if (parentId !== "admin") {
    const parentCount = await TransactionModel.countDocuments({
      userId: parentId,
    });
    if (!parentCount) return next(new AppError("Parent not found!", 400));
  }
  let count = await TransactionModel.countDocuments({ parentId });
  // // if parent has 4 members already under him
  if (count >= 4) return next(new AppError("Parent Id is full!", 400));
  else {
    const transaction = {
      phoneNo,
      email,
      parentId,
      admin: req.user.email,
      status: "added",
    };
    let result = await TransactionModel.create(transaction);
    res.status(200).json({
      status: "success",
      result,
    });
  }
});

module.exports.getAddedTransactions = catchAsync(async (req, res, next) => {
  let transactions = await TransactionModel.find({ status: "added" });
  res.status(200).json({
    status: "success",
    transactions,
  });
});

// Approve added transaction
module.exports.approveTransaction = catchAsync(async (req, res, next) => {
  const { id, userId } = req.body;
  // Ckeck whether the userId already exist
  // Check whether transaction is already approved
  const approved = await TransactionModel.find({
    _id: id,
    status: "approved",
  });
  // .where("status")
  // .equals("approved");
  if (approved.length) return next(new AppError("Already approved.", 400));

  const transactions = await TransactionModel.findByIdAndUpdate(id, {
    userId,
    status: "approved",
  });
  res.status(200).json({
    status: "success",
    transactions,
  });
});

// Retrieve eligible members for reward
module.exports.rewardableMembers = catchAsync(async (req, res, next) => {
  const eligibleIds = await Transaction.aggregate([
    {
      $match: {
        status: "approved",
      },
    },
    {
      $group: {
        _id: "$parentId",
        count: { $sum: 1 },
      },
    },
    {
      $match: {
        count: 4,
        _id: { $ne: "admin" },
      },
    },
    {
      $project: {
        _id: 0,
        parentId: "$_id",
      },
    },
  ]);
  // Storing eligibleId's details to array
  let eligibleMembers = [];
  for ({ parentId } of eligibleIds) {
    const member = await TransactionModel.findOne({
      userId: parentId,
      status: "approved",
    });
    if (member) eligibleMembers.push(member);
  }
  res.status(200).json({
    status: "success",
    eligibleMembers,
  });
});

module.exports.rewardTransaction = catchAsync(async (req, res, next) => {
  const admin = req.user.email;
  const { userId, rewardRemarks } = req.body;
  if (!userId || !rewardRemarks || rewardRemarks === null)
    return next(new AppError("Please provide required details!"), 400);
  if (
    (await TransactionModel.countDocuments({
      parentId: userId,
      status: "approved",
      admin,
    })) !== 4
  )
    return next(new AppError("This user is not eligible for reward!", 400));
  else {
    if (
      await TransactionModel.findOneAndUpdate(
        { userId, admin },
        { status: "rewarded", rewardRemarks }
      )
    )
      res.status(200).json({
        status: "success",
        // members,
      });
  }
});
