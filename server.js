const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! server shutting down:(");
  server.close(() => process.exit(1));
});

const app = require("./app");
dotenv.config({ path: "./config.env" });

const mongodb_con_string = process.env.MONGODB_SERVER;
const port = process.env.PORT || 3000;

mongoose
  .connect(mongodb_con_string)
  .then(() => console.log("DB connection successful!"));

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! server shutting down:(");
  server.close(() => process.exit(1));
});
