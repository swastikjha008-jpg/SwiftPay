const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/user.routes");
const accountRoutes = require("./routes/account.routes");

function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
  app.use(express.json());

  app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api/v1/user", userRoutes);
  app.use("/api/v1/account", accountRoutes);

  // fallback handler for unknown routes
  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  // centralized error handler as a safety net for anything routes don't catch
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error("[swiftpay] unhandled error:", err);
    res.status(500).json({ message: "Something went wrong" });
  });

  return app;
}

module.exports = createApp;
