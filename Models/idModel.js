const mongoose = require("mongoose");

const IdSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: [true, "Please provide user ID"],
  },
  date: {
    type: Date,
    required: [true, "Please provide Date"],
  },
});

Id = new mongoose.model("Id", IdSchema);

module.exports = Id;
