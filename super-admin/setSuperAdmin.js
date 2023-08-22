const mongoose = require("mongoose");
const dotenv = require("dotenv");
const validator = require("validator");
const bcrypt = require("bcryptjs");

dotenv.config({ path: "../config.env" });

const mongodb_con_string = process.env.MONGODB_SERVER;

mongoose
  .connect(mongodb_con_string)
  .then(() => console.log("DB connection successful!"));

//   User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, "Please provide valid email"],
  },
  role: { type: String, default: "super-admin" },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 10,
    select: false,
  },
  passwordChangedAt: Date,
});

// works only on CREATE and SAVE
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now();
});

User = new mongoose.model("User", userSchema);

const main = async () => {
  const password = process.env.npm_config_password;
  const superUser = await User.findOne({ role: "super-admin" });
  if (superUser) {
    superUser.password = password;
    await superUser.save().then(() => {
      console.log("Password reset successfull");
      process.exit(1);
    });
  } else {
    User.create({
      name: "vaasu annan",
      email: "sa@g.com",
      password: password,
    }).then(() => {
      console.log("Successfully created super-admin");
      process.exit(1);
    });
  }
};
main();
