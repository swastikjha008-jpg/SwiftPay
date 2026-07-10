```markdown
# 🚀 SwiftPay - Full-Stack Digital Wallet

SwiftPay is a modern digital wallet built with **Next.js**, **Express.js**, **MongoDB**, and **Turborepo**. It lets users create an account, sign in securely, view wallet balance, search people, add money, and transfer funds with transaction safety.

The project is designed as a clean full-stack learning project with a polished fintech UI and a backend that uses **MongoDB transactions** so wallet transfers either complete fully or fail safely.

---

## ✨ Highlights

- 🔐 Secure user signup and signin with JWT authentication
- 🔑 Password hashing with `bcryptjs`
- 💸 Wallet balance for every user
- ⚡ Fast money transfer flow
- 🧾 MongoDB transaction support for safe balance updates
- 👥 Search users before sending money
- 🧠 Input validation with `zod`
- 🎨 Premium landing page built with Next.js and Tailwind CSS
- 🧩 Monorepo structure using npm workspaces and Turborepo
- 🚂 Railway-ready backend deployment config
- 🧪 Backend test suite included

---

## 🖼️ App Preview

SwiftPay includes a polished frontend experience with:

- Animated hero section
- Modern wallet dashboard
- User search flow
- Send money page
- Add money page
- Responsive UI
- Bento-style feature cards
- “Send to anyone” people grid with sample wallet contacts

---

## 🛠️ Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | Next.js 14 |
| UI | React, Tailwind CSS |
| Animations | Framer Motion, GSAP |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Auth | JWT |
| Password Security | bcryptjs |
| Validation | Zod |
| Monorepo | npm workspaces, Turborepo |
| Deployment | Vercel frontend, Railway backend |

---

## 📁 Project Structure

```text
SwiftPay
├── apps
│   ├── api
│   │   ├── src
│   │   ├── test
│   │   ├── .env.example
│   │   └── package.json
│   └── web
│       ├── app
│       ├── components
│       ├── lib
│       ├── .env.example
│       └── package.json
├── package.json
├── package-lock.json
├── railway.toml
├── turbo.json
└── README.md
```

---

## 🧠 How SwiftPay Works

### User Signup

When a new user creates an account:

1. The backend validates the request body.
2. The password is hashed using `bcryptjs`.
3. A user document is created.
4. A wallet account is created for that user.
5. A JWT token is returned to the frontend.

### Money Transfer

Transfers use MongoDB sessions and transactions:

```text
Start transaction
→ Check sender balance
→ Debit sender
→ Credit receiver
→ Commit transaction
```

If anything fails:

```text
Abort transaction
→ No partial transfer
→ Balances stay safe
```

---

## 🔐 Authentication

Protected routes expect this header:

```http
Authorization: Bearer YOUR_TOKEN
```

---

## 🧩 API Routes

### User Routes

| Method | Endpoint | Auth Required | Description |
| --- | --- | --- | --- |
| POST | `/api/v1/user/signup` | No | Create a new user |
| POST | `/api/v1/user/signin` | No | Sign in existing user |
| GET | `/api/v1/user/me` | Yes | Get current user profile |
| PUT | `/api/v1/user` | Yes | Update user profile |
| GET | `/api/v1/user/bulk` | Yes | Search users |

### Wallet Routes

| Method | Endpoint | Auth Required | Description |
| --- | --- | --- | --- |
| GET | `/api/v1/account/balance` | Yes | Get wallet balance |
| POST | `/api/v1/account/topup` | Yes | Add money to wallet |
| POST | `/api/v1/account/transfer` | Yes | Transfer money |

---

## ⚙️ Environment Variables

Backend: `apps/api/.env`

```env
PORT=3001
MONGO_URL=mongodb://localhost:27017/swiftpay?replicaSet=rs0
JWT_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://localhost:3000
```

Frontend: `apps/web/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🧑‍💻 Local Development

Install dependencies:

```bash
npm install
```

Start MongoDB replica set:

```bash
docker run -d --name mongodb -p 27017:27017 mongo:latest --replSet rs0
docker exec -it mongodb mongosh --eval "rs.initiate()"
```

Run both apps:

```bash
npm run dev
```

Backend only:

```bash
npm run dev:api
```

Frontend only:

```bash
npm run dev:web
```

---

## 🌐 Local URLs

| App | URL |
| --- | --- |
| Frontend | `http://localhost:3000` |
| Backend | `http://localhost:3001` |
| Health Check | `http://localhost:3001/api/v1/health` |

---

## 🧪 Testing

Run backend tests:

```bash
npm test --workspace=api
```

Tests cover auth, validation, wallet balance, top-up, transfers, insufficient balance, self-transfer rejection, and user search.

---

## 🚀 Deployment

### Frontend

Recommended: **Vercel**

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Backend

Recommended: **Railway**

This repo includes `railway.toml`, so Railway builds only the API.

Required Railway variables:

```env
MONGO_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=https://your-frontend-url.com
PORT=3001
```

---

## 🍃 MongoDB Atlas Notes

For production, use MongoDB Atlas.

Atlas is recommended because:

- Railway can access it.
- It is cloud-hosted.
- Atlas clusters are replica sets by default.
- MongoDB transactions work correctly.

Do not use your local Docker MongoDB URL in Railway.

---

## ✅ Project Status

- ✅ Backend API
- ✅ Frontend UI
- ✅ Authentication
- ✅ Wallet creation
- ✅ Wallet top-up
- ✅ User search
- ✅ Money transfer
- ✅ MongoDB transaction support
- ✅ Railway backend config
- ✅ Vercel-ready frontend
- ✅ Backend tests

---

## 🙌 Author

Built by **Swastik Jha** as a full-stack digital wallet project.

---

## ⭐ Support

If you like this project, consider starring the repository on GitHub.
```
