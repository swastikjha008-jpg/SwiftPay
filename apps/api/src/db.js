const mongoose = require("mongoose");

async function connectDB() {
  const url = process.env.MONGO_URL || "mongodb://localhost:27017/swiftpay";

  try {
    await mongoose.connect(url);
    console.log(`[swiftpay] connected to MongoDB -> ${url}`);
  } catch (err) {
    console.error("[swiftpay] failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
