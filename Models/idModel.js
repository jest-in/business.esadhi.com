const mongoose = require("mongoose");

const IdSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: [true, "Please provide user ID"],
  },
  status: {
    type: String,
    default: undefined,
    enum: {
      values: [undefined, "assigned"],
      message: "{VALUE} is not supported",
    },
  },
});

Id = new mongoose.model("Id", IdSchema);

module.exports = Id;
