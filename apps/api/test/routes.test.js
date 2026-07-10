process.env.JWT_SECRET = "test_secret_do_not_use_in_prod";
process.env.CLIENT_URL = "http://localhost:3000";

const { test, before, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const jwt = require("jsonwebtoken");

const { installMocks, resetDb, seedUser, getAccount } = require("./mock-db");

let app;

before(() => {
  installMocks();
  const createApp = require("../src/app");
  app = createApp();
});

beforeEach(() => {
  resetDb();
});

function tokenFor(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

test("GET /api/v1/health responds ok", async () => {
  const res = await request(app).get("/api/v1/health");
  assert.equal(res.status, 200);
  assert.equal(res.body.status, "ok");
});

test("signup rejects an invalid email", async () => {
  const res = await request(app).post("/api/v1/user/signup").send({
    email: "not-an-email",
    password: "password123",
    firstName: "Ada",
    lastName: "Lovelace",
  });
  assert.equal(res.status, 400);
  assert.ok(res.body.errors.email);
});

test("signup rejects a short password", async () => {
  const res = await request(app).post("/api/v1/user/signup").send({
    email: "ada@example.com",
    password: "abc",
    firstName: "Ada",
    lastName: "Lovelace",
  });
  assert.equal(res.status, 400);
  assert.ok(res.body.errors.password);
});

test("signup creates a user + account and returns a usable token", async () => {
  const res = await request(app).post("/api/v1/user/signup").send({
    email: "ada@example.com",
    password: "password123",
    firstName: "Ada",
    lastName: "Lovelace",
  });
  assert.equal(res.status, 201);
  assert.ok(res.body.token);
  assert.equal(res.body.user.email, "ada@example.com");

  const balanceRes = await request(app)
    .get("/api/v1/account/balance")
    .set("Authorization", `Bearer ${res.body.token}`);
  assert.equal(balanceRes.status, 200);
  assert.equal(balanceRes.body.balance, 100000); // starting demo balance
});

test("signup rejects a duplicate email", async () => {
  seedUser({ email: "taken@example.com" });
  const res = await request(app).post("/api/v1/user/signup").send({
    email: "taken@example.com",
    password: "password123",
    firstName: "A",
    lastName: "B",
  });
  assert.equal(res.status, 409);
});

test("signin fails with the wrong password", async () => {
  const bcrypt = require("bcryptjs");
  const id = seedUser({ email: "bob@example.com", passwordHash: await bcrypt.hash("correcthorse", 10) });
  const res = await request(app)
    .post("/api/v1/user/signin")
    .send({ email: "bob@example.com", password: "wrongpassword" });
  assert.equal(res.status, 401);
});

test("protected routes reject requests with no token", async () => {
  const res = await request(app).get("/api/v1/account/balance");
  assert.equal(res.status, 401);
});

test("protected routes reject a garbage token", async () => {
  const res = await request(app)
    .get("/api/v1/account/balance")
    .set("Authorization", "Bearer not.a.real.token");
  assert.equal(res.status, 401);
});

test("transfer moves money atomically between two accounts", async () => {
  const aliceId = seedUser({ email: "alice@example.com", balance: 50000 });
  const bobId = seedUser({ email: "bob2@example.com", balance: 10000 });

  const res = await request(app)
    .post("/api/v1/account/transfer")
    .set("Authorization", `Bearer ${tokenFor(aliceId)}`)
    .send({ to: bobId, amount: 20000 });

  assert.equal(res.status, 200);
  assert.equal(getAccount(aliceId).balance, 30000);
  assert.equal(getAccount(bobId).balance, 30000);
});

test("transfer rejects insufficient balance and leaves both accounts untouched", async () => {
  const aliceId = seedUser({ email: "poor@example.com", balance: 500 });
  const bobId = seedUser({ email: "rich@example.com", balance: 10000 });

  const res = await request(app)
    .post("/api/v1/account/transfer")
    .set("Authorization", `Bearer ${tokenFor(aliceId)}`)
    .send({ to: bobId, amount: 20000 });

  assert.equal(res.status, 400);
  assert.match(res.body.message, /insufficient/i);
  assert.equal(getAccount(aliceId).balance, 500);
  assert.equal(getAccount(bobId).balance, 10000);
});

test("transfer rejects an unknown recipient", async () => {
  const aliceId = seedUser({ email: "solo@example.com", balance: 50000 });

  const res = await request(app)
    .post("/api/v1/account/transfer")
    .set("Authorization", `Bearer ${tokenFor(aliceId)}`)
    .send({ to: "does_not_exist", amount: 100 });

  assert.equal(res.status, 404);
  assert.equal(getAccount(aliceId).balance, 50000);
});

test("transfer rejects sending money to yourself", async () => {
  const aliceId = seedUser({ email: "self@example.com", balance: 50000 });

  const res = await request(app)
    .post("/api/v1/account/transfer")
    .set("Authorization", `Bearer ${tokenFor(aliceId)}`)
    .send({ to: aliceId, amount: 100 });

  assert.equal(res.status, 400);
});

test("transfer rejects a negative or zero amount", async () => {
  const aliceId = seedUser({ email: "zero@example.com", balance: 50000 });
  const bobId = seedUser({ email: "zero2@example.com", balance: 10000 });

  const res = await request(app)
    .post("/api/v1/account/transfer")
    .set("Authorization", `Bearer ${tokenFor(aliceId)}`)
    .send({ to: bobId, amount: -50 });

  assert.equal(res.status, 400);
});

test("GET /user/bulk finds a user by name and excludes yourself", async () => {
  const aliceId = seedUser({ email: "alice3@example.com", firstName: "Alice", lastName: "Zhang" });
  seedUser({ email: "bob3@example.com", firstName: "Bob", lastName: "Nolan" });

  const res = await request(app)
    .get("/api/v1/user/bulk")
    .query({ filter: "bob" })
    .set("Authorization", `Bearer ${tokenFor(aliceId)}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.users.length, 1);
  assert.equal(res.body.users[0].firstName, "Bob");
});

test("topup adds funds to your own balance", async () => {
  const aliceId = seedUser({ email: "topup@example.com", balance: 5000 });

  const res = await request(app)
    .post("/api/v1/account/topup")
    .set("Authorization", `Bearer ${tokenFor(aliceId)}`)
    .send({ amount: 25000 });

  assert.equal(res.status, 200);
  assert.equal(res.body.balance, 30000);
  assert.equal(getAccount(aliceId).balance, 30000);
});

test("topup rejects a zero or negative amount", async () => {
  const aliceId = seedUser({ email: "topupzero@example.com", balance: 5000 });

  const res = await request(app)
    .post("/api/v1/account/topup")
    .set("Authorization", `Bearer ${tokenFor(aliceId)}`)
    .send({ amount: 0 });

  assert.equal(res.status, 400);
  assert.equal(getAccount(aliceId).balance, 5000);
});

test("topup requires auth", async () => {
  const res = await request(app).post("/api/v1/account/topup").send({ amount: 100 });
  assert.equal(res.status, 401);
});
