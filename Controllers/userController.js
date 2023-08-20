const UserModel = require("../Models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

module.exports.addAdmin = catchAsync(async (req, res, next) => {
  const { name, email, phoneNo, address, password, passwordConfirm } = req.body;
  if (!email || !password || !phoneNo || !name || !address || !passwordConfirm)
    return next(new AppError("Please provide the required fields!"));
  else if (await UserModel.findOne({ email }))
    return next(new AppError("Admin already exists!"));
  else if (
    await UserModel.create({
      name,
      email,
      phoneNo,
      address,
      password,
      passwordConfirm,
    })
  )
    res.status(200).json({
      status: "success",
      message: "Added new admin",
    });
});

module.exports.viewAdmins = catchAsync(async (req, res, next) => {
  const admins = await UserModel.find({ role: "admin" });
  res.status(200).json({
    status: "success",
    admins,
  });
});

module.exports.resetAdmin = catchAsync(async (req, res, next) => {
  const { email, password, passwordConfirm } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) return next(new AppError("Admin does not exist!", 400));
  else {
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  }
});
