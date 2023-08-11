const AppError = require("../utils/appError");

const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value: ${value}, Please use another value`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = (err) =>
  new AppError("Invalid token! Please log in again", 400);

const handleTokenExpiredError = (err) =>
  new AppError("Token expired! Please log in again", 400);

const sendErrorDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    err,
  });

const sendErrorProd = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (err.name === "TokenExpiredError") error = handleTokenExpiredError(err);
    if (err.name === "JsonWebTokenError") error = handleJsonWebTokenError(err);
    if (err.name === "ValidationError") error = handleValidationError(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.isOperational) sendErrorProd(err, res);
    else
      res.status(500).json({
        status: "error",
        message: "Something went very wrong!",
      });
  }
};
