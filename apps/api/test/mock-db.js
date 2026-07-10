const mongoose = require("mongoose");
const User = require("../src/models/user.model");
const Account = require("../src/models/account.model");

// A tiny fluent query stub that supports the chained calls the routes use
// (.session(), .select(), .limit()) and resolves like a real mongoose query.
class MockQuery {
  constructor(resolveValue) {
    this._value = resolveValue;
  }
  session() {
    return this;
  }
  select() {
    return this;
  }
  limit() {
    return this;
  }
  then(onFulfilled, onRejected) {
    return Promise.resolve(this._value).then(onFulfilled, onRejected);
  }
  catch(onRejected) {
    return Promise.resolve(this._value).catch(onRejected);
  }
}

let store;
let nextId;

function resetDb() {
  store = { users: [], accounts: [] };
  nextId = 1;
}

function makeId() {
  return `mock_${nextId++}`;
}

function seedUser({ email, firstName = "Test", lastName = "User", passwordHash = "hashed", balance = 100000 }) {
  const id = makeId();
  store.users.push({ _id: id, email, firstName, lastName, passwordHash });
  store.accounts.push({ userId: id, balance });
  return id;
}

function getAccount(userId) {
  return store.accounts.find((a) => a.userId === userId);
}

function installMocks() {
  resetDb();

  User.findOne = (query) => {
    const match = store.users.find((u) => !query.email || u.email === query.email);
    return new MockQuery(match || null);
  };

  User.findById = (id) => {
    const match = store.users.find((u) => u._id === id);
    return new MockQuery(match || null);
  };

  User.find = (query = {}) => {
    let results = store.users;
    if (query._id && query._id.$ne) {
      results = results.filter((u) => u._id !== query._id.$ne);
    }
    if (query.$or) {
      results = results.filter((u) =>
        query.$or.some((clause) => {
          const [field, cond] = Object.entries(clause)[0];
          const regex = new RegExp(cond.$regex, cond.$options);
          return regex.test(u[field] || "");
        })
      );
    }
    return new MockQuery(results);
  };

  User.create = async (docs, opts) => {
    const list = Array.isArray(docs) ? docs : [docs];
    const created = list.map((doc) => {
      const id = makeId();
      const user = { _id: id, ...doc };
      store.users.push(user);
      return user;
    });
    return created;
  };

  User.updateOne = (query, update) => {
    const run = async () => {
      const user = store.users.find((u) => u._id === query._id);
      if (user && update.$set) Object.assign(user, update.$set);
      return { acknowledged: true };
    };
    return new MockQuery(run());
  };

  Account.findOne = (query) => {
    const match = store.accounts.find((a) => a.userId === query.userId);
    return new MockQuery(match || null);
  };

  Account.create = async (docs) => {
    const list = Array.isArray(docs) ? docs : [docs];
    const created = list.map((doc) => {
      const account = { ...doc };
      store.accounts.push(account);
      return account;
    });
    return created;
  };

  Account.updateOne = (query, update) => {
    const run = async () => {
      const account = store.accounts.find((a) => a.userId === query.userId);
      if (account && update.$inc) {
        for (const [key, delta] of Object.entries(update.$inc)) {
          account[key] += delta;
        }
      }
      return { acknowledged: true };
    };
    return new MockQuery(run());
  };

  // Fake session: withTransaction just runs the callback. It doesn't give us
  // real atomicity, but it lets us test the *logic* (ordering, error paths,
  // aborts-on-throw) without a MongoDB replica set available in this sandbox.
  mongoose.startSession = async () => ({
    withTransaction: async (fn) => fn(),
    endSession: () => {},
  });
}

module.exports = { installMocks, resetDb, seedUser, getAccount, store: () => store };
