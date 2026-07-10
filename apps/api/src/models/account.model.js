const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  // stored in the smallest currency unit (paise) as an integer to avoid
  // floating point rounding errors when money is added or subtracted
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Account", accountSchema);
