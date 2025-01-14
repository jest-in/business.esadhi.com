const TransactionModel = require("../Models/transactionModel");
const IdModel = require("../Models/idModel");
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
  if (req.query.count && role === "super-admin") {
    const totalCount = await TransactionModel.countDocuments({
      status: "added",
    });
    return res.status(200).json({
      status: "success",
      totalCount,
    });
  }
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
      addedDate: req.requestTime,
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
    const details = JSON.parse(JSON.stringify(user));
    const parent = await TransactionModel.findOne({ userId: user.parentId });
    if (user.parentId === "admin") details.parentName = "admin";
    else details.parentName = parent.name;
    details.parentId = undefined;
    res.status(200).json({
      status: "success",
      details,
    });
  }
});

module.exports.getApprovedTransactions = catchAsync(async (req, res, next) => {
  const { role, email } = req.user;
  const transactions = await TransactionModel.find(
    role !== "admin"
      ? { status: "approved" }
      : { $and: [{ admin: email }, { status: "approved" }] }
  );
  res.status(200).json({
    status: "success",
    transactions,
  });
});

module.exports.getAllTransactions = catchAsync(async (req, res, next) => {
  const { role, email } = req.user;
  const transactions = await TransactionModel.find(
    role !== "admin" ? {} : { admin: email }
  );
  res.status(200).json({
    status: "success",
    transactions,
  });
});

// Approve added transaction
module.exports.approveTransaction = catchAsync(async (req, res, next) => {
  const { id, userId } = req.body;
  if (!id || !userId)
    return next(new AppError("Please provide required fields!", 400));

  // Check whether transaction is already approved
  if (
    await TransactionModel.findOne({
      $and: [{ _id: id }, { status: "approved" }],
    })
  )
    return next(new AppError("Already approved.", 400));
  // Check whether user id exists
  if (!(await IdModel.exists({ userId })))
    return next(new AppError("User Id does not exists", 400));
  // Approve
  if (
    await TransactionModel.updateOne(
      { _id: id },
      {
        userId,
        status: "approved",
        approvedDate: req.requestTime,
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

  // If the query string contains count
  if (req.query.count)
    return res
      .status(200)
      .json({ status: "success", totalCount: eligibleMembers.length });

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
    await TransactionModel.findOne({
      $and: [{ userId }, { status: "rewarded" }],
    })
  )
    return next(new AppError("This user is not eligible for reward!", 400));
  if (
    (await TransactionModel.countDocuments({
      $and: [{ parentId: userId }, { status: { $ne: "added" } }],
    })) !== 4
  )
    return next(new AppError("This user is not eligible for reward!", 400));
  else {
    if (
      await TransactionModel.findOneAndUpdate(
        { userId },
        { status: "rewarded", rewardRemarks, rewardedDate: req.requestTime }
      )
    )
      res.status(200).json({
        status: "success",
        message: "Rewarded Successfully",
      });
  }
});

module.exports.viewRewardedTransaction = catchAsync(async (req, res, next) => {
  const { role, email } = req.user;
  const transactions = await TransactionModel.find(
    role !== "admin"
      ? { status: "rewarded" }
      : { $and: [{ status: "rewarded" }, { admin: email }] }
  );
  res.status(200).json({
    status: "success",
    transactions,
  });
});
