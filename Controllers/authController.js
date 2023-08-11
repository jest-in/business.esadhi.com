const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (email) =>
  jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res) => {
  let user = await UserModel.create(req.body);
  res.json({
    status: "success",
    data: user,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  const token = signToken(email);
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: true,
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token)
    next(new AppError("You are not logged in! Please log in to access", 401));

  // token verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check user still exists
  const currentUser = await UserModel.findOne({ email: decoded.email });
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // check whether password is changed
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }
  // Grant access to protected route
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    next();
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.user.email }).select(
    "+password"
  );

  const passwordCompared = await user.correctPassword(
    req.body.currentPassword,
    user.password
  );
  if (!passwordCompared)
    return next(new AppError("Your current password is incorrect!"), 401);

  user.password = req.password;
  user.passwordConfirm = req.passwordConfirm;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
  });
});