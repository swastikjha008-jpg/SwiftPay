
# 🚀 SwiftPay — Modern Digital Wallet

> 💸 A full-stack digital wallet inspired by **PayTM**, built as a production-ready **Turborepo Monorepo** using **Express**, **MongoDB Transactions**, and **Next.js 14**.

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge\&logo=next.js)
![Express](https://img.shields.io/badge/Express-4-404D59?style=for-the-badge\&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Replica_Set-47A248?style=for-the-badge\&logo=mongodb)
![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000?style=for-the-badge)
![JWT](https://img.shields.io/badge/Auth-JWT-blue?style=for-the-badge)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3-38BDF8?style=for-the-badge\&logo=tailwind-css)
![TurboRepo](https://img.shields.io/badge/Turborepo-Monorepo-EF4444?style=for-the-badge\&logo=turborepo)

**⚡ Fast • 🔒 Secure • 💳 Atomic Transactions • 🎨 Beautiful UI**

</div>

---

# ✨ Preview

## 🌐 Landing Page

* Animated hero section
* Aurora backgrounds
* Liquid currency effects
* WebGL animations
* Responsive layout
* Modern fintech aesthetic

## 💼 Dashboard

* Wallet balance
* Search users instantly
* Send money
* Transaction validation
* Clean minimal UI

---

# 🎯 Features

## 🔐 Authentication

✅ JWT Authentication

✅ Password hashing using bcrypt

✅ Protected Routes

✅ Persistent Login

---

## 💸 Wallet

* 💰 Auto wallet creation during signup
* 💳 Real-time balance
* 🔄 Atomic transfers
* 🚫 Prevent self-transfer
* ❌ Prevent overdraft
* 🔒 Transaction safety using MongoDB sessions

---

## 👤 User System

* Create account
* Login
* Update profile
* Change password
* Search users
* View own profile

---

## 🎨 Frontend

* Next.js 14 App Router
* Tailwind CSS
* Framer Motion
* GSAP Animations
* OGL WebGL Effects
* Beautiful Landing Page
* Fully Responsive

---

## 🛡 Backend

* Express REST API
* MongoDB + Mongoose
* Zod Validation
* JWT Middleware
* Modular Architecture
* Transaction Support
* Route Testing

---

# 🏗 Tech Stack

| Category          | Technology           |
| ----------------- | -------------------- |
| Frontend          | Next.js 14           |
| Backend           | Express.js           |
| Database          | MongoDB              |
| ODM               | Mongoose             |
| Validation        | Zod                  |
| Authentication    | JWT                  |
| Password Security | bcryptjs             |
| Styling           | Tailwind CSS         |
| Animation         | GSAP + Framer Motion |
| Graphics          | OGL                  |
| Monorepo          | Turborepo            |

---

# 📂 Project Structure

```text
swiftpay
│
├── apps
│   │
│   ├── api
│   │   ├── src
│   │   │   ├── app.js
│   │   │   ├── index.js
│   │   │   ├── db.js
│   │   │   ├── middleware
│   │   │   ├── models
│   │   │   ├── routes
│   │   │   └── validators
│   │   │
│   │   ├── test
│   │   └── .env.example
│   │
│   └── web
│       ├── app
│       ├── components
│       ├── lib
│       └── .env.example
│
├── package.json
└── turbo.json
```

---

# ⚙️ System Architecture

```text
               User

                 │

                 ▼

      Next.js Frontend (3000)

                 │

       REST API Requests

                 │

                 ▼

       Express Backend (3001)

                 │

       JWT Authentication

                 │

                 ▼

          MongoDB Replica Set

                 │

        MongoDB Transactions

                 │

          Account Updates
```

---

# 🔄 Money Transfer Flow

```text
Sender

   │

Check Balance

   │

Open Mongo Session

   │

Start Transaction

   │

Debit Sender

   │

Credit Receiver

   │

Commit Transaction

   │

Success
```

If **any** step fails 👆

```text
Rollback Everything
```

No partial transfers.

No inconsistent balances.

---

# 🔒 Why MongoDB Transactions?

Without transactions:

```text
Sender Balance

↓

Money Deducted

↓

Server Crashes

↓

Receiver Never Gets Money
```

❌ Broken state.

---

With transactions:

```text
Sender Balance

↓

Start Transaction

↓

Debit

↓

Credit

↓

Commit

↓

Done
```

OR

```text
Error

↓

Rollback

↓

Everything Restored
```

✅ Always consistent.

---

# 🧩 API Endpoints

## 👤 User

| Method | Endpoint              | Auth |
| ------ | --------------------- | ---- |
| POST   | `/api/v1/user/signup` | ❌    |
| POST   | `/api/v1/user/signin` | ❌    |
| GET    | `/api/v1/user/me`     | ✅    |
| PUT    | `/api/v1/user`        | ✅    |
| GET    | `/api/v1/user/bulk`   | ✅    |

---

## 💳 Wallet

| Method | Endpoint                   | Auth |
| ------ | -------------------------- | ---- |
| GET    | `/api/v1/account/balance`  | ✅    |
| POST   | `/api/v1/account/transfer` | ✅    |

---

# 🔑 Authentication

Protected endpoints require:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# 💰 Money Format

All amounts are stored as **integer paise**.

Example

| Amount | Stored Value |
| ------ | ------------ |
| ₹1     | 100          |
| ₹10    | 1000         |
| ₹99.99 | 9999         |

This completely avoids floating-point rounding issues.

---

# 🛠 Local Setup

## 1️⃣ Clone

```bash
git clone https://github.com/yourusername/swiftpay.git

cd swiftpay
```

---

## 2️⃣ Install

```bash
npm install
```

---

## 3️⃣ Backend Environment

```bash
cp apps/api/.env.example apps/api/.env
```

Set

```env
MONGO_URL=

JWT_SECRET=

CLIENT_URL=
```

---

## 4️⃣ Frontend Environment

```bash
cp apps/web/.env.example apps/web/.env.local
```

Set

```env
NEXT_PUBLIC_API_URL=
```

---

# 🐳 MongoDB Replica Set

Transactions **require** a Replica Set.

Start MongoDB

```bash
docker run -d \
--name mongodb \
-p 27017:27017 \
mongo:latest \
--replSet rs0
```

Initialize

```bash
docker exec -it mongodb mongosh --eval "rs.initiate()"
```

Verify

```bash
docker exec -it mongodb mongosh --eval "rs.status().ok"
```

Expected output

```text
1
```

---

# 🚀 Development

Run both apps

```bash
npm run dev
```

Backend only

```bash
npm run dev:api
```

Frontend only

```bash
npm run dev:web
```

---

# 🧪 Testing

```bash
cd apps/api

npm test
```

Current test coverage includes:

* ✅ Signup validation
* ✅ Duplicate users
* ✅ Login
* ✅ JWT validation
* ✅ Balance checks
* ✅ Successful transfer
* ✅ Self transfer rejection
* ✅ Invalid amount rejection
* ✅ Insufficient funds
* ✅ Unknown recipient
* ✅ User search

---

# 🚀 Deployment

## Frontend

Deploy on

* ▲ Vercel

Environment Variable

```env
NEXT_PUBLIC_API_URL=
```

---

## Backend

Deploy on

* 🚂 Railway
* 🟣 Render
* 🚀 Fly.io

Required variables

```env
MONGO_URL=

JWT_SECRET=

CLIENT_URL=
```

---

## Database

Recommended

* 🍃 MongoDB Atlas

Atlas already supports Replica Sets, so transactions work out of the box.

---

# 🌟 Project Highlights

* ⚡ Turborepo Monorepo
* 🔒 JWT Authentication
* 🔐 bcrypt Password Hashing
* 💳 Wallet System
* 🔄 MongoDB Transactions
* 🛡 Zod Validation
* 🎨 Premium Landing Page
* 📱 Responsive Design
* ✨ WebGL Animations
* 🧪 Unit Tested
* 🚀 Production Ready
---
# 🤝 Contributing

Contributions are always welcome!

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

# ⭐ Support

If you found this project useful,

🌟 **Star the repository** to support the project and help others discover it!

---

<div align="center">

### 💙 Built with Next.js, Express & MongoDB

**Designed to demonstrate production-ready full-stack architecture, secure authentication, and ACID-compliant money transfers.**

</div>

---
