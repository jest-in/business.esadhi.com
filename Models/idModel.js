const mongoose = require("mongoose");

const IdSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: [true, "Please provide user ID"],
  },
  status: {
    type: String,
    default: "created",
    enum: {
      values: ["downloaded", "created"],
      message: "{VALUE} is not supported",
    },
  },
});

Id = new mongoose.model("Id", IdSchema);

module.exports = Id;
