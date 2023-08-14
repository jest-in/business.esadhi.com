const path = require("path");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const cors = require("cors");

const TransactionRoute = require("./Routes/transactionRoute");
const IdRouter = require("./Routes/idRoute");
const AuthRoute = require("./Routes/authRoute");
const UserRoute = require("./Routes/userRoute");
const globalErrorHandler = require("./Controllers/errorController");
const AppError = require("./utils/appError");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5500",
  })
);

// Global middlewares

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
// set security http headers
app.use(helmet());

// limit request from same api
const loginLimiter = rateLimit({
  max: 24,
  windowMs: 24 * 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again after 24 hours!",
});
app.use("/login", loginLimiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSql injection
app.use(mongoSanitize());

// Data sanitization XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  req.requestTime = new Date();
  next();
});

// Routes
app.get("/", (req, res, next) => {
  res.status(200).render("base");
});
//api
app.use("/api", AuthRoute);
app.use("/api/users", UserRoute);
app.use("/api/transactions", TransactionRoute);
app.use("/api/id", IdRouter);

// middlewares
// If the requested route is not found
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
