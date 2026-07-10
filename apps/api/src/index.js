require("dotenv").config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const createApp = require("./app");
const connectDB = require("./db");

const PORT = process.env.PORT || 3001;

if (!process.env.JWT_SECRET) {
  console.error("[swiftpay] JWT_SECRET is not set. Add it to your .env file before starting the server.");
  process.exit(1);
}

const app = createApp();

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[swiftpay] backend listening on http://localhost:${PORT}`);
  });
});
