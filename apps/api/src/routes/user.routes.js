const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("../models/user.model");
const Account = require("../models/account.model");
const authMiddleware = require("../middleware/auth.middleware");
const {
  signupSchema,
  signinSchema,
  updateUserSchema,
} = require("../validators/user.validator");

const router = express.Router();

// Every new account starts with a small demo balance (in paise) so the
// product can be tried out immediately without a manual top-up flow.
const STARTING_BALANCE = 100000; // ₹1,000.00

router.post("/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { email, password, firstName, lastName } = parsed.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const session = await mongoose.startSession();
  try {
    let createdUser;
    await session.withTransaction(async () => {
      const [user] = await User.create(
        [{ email, passwordHash, firstName, lastName }],
        { session }
      );
      await Account.create(
        [{ userId: user._id, balance: STARTING_BALANCE }],
        { session }
      );
      createdUser = user;
    });

    const token = jwt.sign({ userId: createdUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({
      message: "Account created",
      token,
      user: {
        id: createdUser._id,
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
      },
    });
  } catch (err) {
    console.error("[signup] failed:", err);
    return res.status(500).json({ message: "Could not create account, please try again" });
  } finally {
    session.endSession();
  }
});

router.post("/signin", async (req, res) => {
  const parsed = signinSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Incorrect email or password" });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ message: "Incorrect email or password" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return res.status(200).json({
    message: "Signed in",
    token,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
});

router.put("/", authMiddleware, async (req, res) => {
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const updates = { ...parsed.data };
  if (updates.password) {
    updates.passwordHash = await bcrypt.hash(updates.password, 10);
    delete updates.password;
  }

  await User.updateOne({ _id: req.userId }, { $set: updates });

  return res.status(200).json({ message: "Profile updated" });
});

// GET /api/v1/user/bulk?filter=ann  -> search users by first/last name
// backs the SearchBar "send to" lookup on the dashboard
router.get("/bulk", authMiddleware, async (req, res) => {
  const filter = (req.query.filter || "").toString().trim();

  const query = filter
    ? {
        _id: { $ne: req.userId },
        $or: [
          { firstName: { $regex: filter, $options: "i" } },
          { lastName: { $regex: filter, $options: "i" } },
          { email: { $regex: filter, $options: "i" } },
        ],
      }
    : { _id: { $ne: req.userId } };

  const users = await User.find(query)
    .select("firstName lastName email")
    .limit(20);

  return res.status(200).json({
    users: users.map((u) => ({
      id: u._id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
    })),
  });
});

router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select("firstName lastName email");
  if (!user) return res.status(404).json({ message: "User not found" });

  return res.status(200).json({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });
});

module.exports = router;
