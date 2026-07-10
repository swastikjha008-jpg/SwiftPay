const express = require("express");
const mongoose = require("mongoose");

const Account = require("../models/account.model");
const authMiddleware = require("../middleware/auth.middleware");
const { transferSchema, topupSchema } = require("../validators/user.validator");

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  const account = await Account.findOne({ userId: req.userId });
  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  return res.status(200).json({ balance: account.balance });
});

// Demo top-up: adds funds to your own account. There's no real payment
// gateway behind this — it exists so the "Add money" flow isn't a dead end
// while you're building the project. Swap this out for a real provider
// (Razorpay, Stripe, etc.) before this ever touches real money.
router.post("/topup", authMiddleware, async (req, res) => {
  const parsed = topupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const account = await Account.findOne({ userId: req.userId });
  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  await Account.updateOne({ userId: req.userId }, { $inc: { balance: parsed.data.amount } });
  const updated = await Account.findOne({ userId: req.userId });

  return res.status(200).json({ message: "Balance updated", balance: updated.balance });
});

// The core of the project: an atomic funds transfer.
// Both the debit and the credit either happen together inside one
// MongoDB transaction, or neither happens at all. If any check fails
// partway through (bad recipient, insufficient balance, a write error)
// the whole transaction is aborted and the database is left untouched.
router.post("/transfer", authMiddleware, async (req, res) => {
  const parsed = transferSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { to, amount } = parsed.data;

  if (to === req.userId) {
    return res.status(400).json({ message: "You can't transfer money to yourself" });
  }

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const senderAccount = await Account.findOne({ userId: req.userId }).session(session);

      if (!senderAccount) {
        throw new AppError(404, "Sender account not found");
      }
      if (senderAccount.balance < amount) {
        throw new AppError(400, "Insufficient balance");
      }

      const recipientAccount = await Account.findOne({ userId: to }).session(session);
      if (!recipientAccount) {
        throw new AppError(404, "Recipient account not found");
      }

      await Account.updateOne(
        { userId: req.userId },
        { $inc: { balance: -amount } }
      ).session(session);

      await Account.updateOne(
        { userId: to },
        { $inc: { balance: amount } }
      ).session(session);
    });

    return res.status(200).json({ message: "Transfer successful" });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.status).json({ message: err.message });
    }
    console.error("[transfer] failed, transaction rolled back:", err);
    return res.status(500).json({ message: "Transfer failed, please try again" });
  } finally {
    session.endSession();
  }
});

class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

module.exports = router;
