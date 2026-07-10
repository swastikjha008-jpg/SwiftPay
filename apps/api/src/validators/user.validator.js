const { z } = require("zod");

const signupSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password is too long"),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
});

const signinSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const updateUserSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  password: z.string().min(6).max(72).optional(),
});

const transferSchema = z.object({
  to: z.string().min(1, "Recipient account id is required"),
  amount: z.number().positive("Amount must be greater than zero"),
});

const topupSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be greater than zero")
    .max(10000000, "That's larger than this demo allows in one go"),
});

module.exports = {
  signupSchema,
  signinSchema,
  updateUserSchema,
  transferSchema,
  topupSchema,
};
