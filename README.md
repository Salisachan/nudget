# Nudget

**Track money the way you think.**

Nudget is a conversational personal finance web app. Instead of tapping through forms and dropdowns, you log money the way you'd say it — type *"coffee 6 bucks"* or *"got paid 2800"* and Nudget parses it into a structured transaction using AI. You can also ask it questions about your finances in plain language, like *"how much did I spend on food this month?"*, and get a real answer based on your data.

🔗 **Live app:** https://nudget-delta.vercel.app
🔗 **API:** https://nudget-xy1w.onrender.com

---

## What it does

- **Conversational logging** — Type a transaction in natural language and an AI model parses the amount, category, type (income or expense), and description automatically.
- **AI financial assistant** — Ask questions about your spending and get answers grounded in your actual transaction data.
- **Persistent chat history** — Your conversation with Nudget is saved so it feels like a continuous chat each time you log in.
- **Dashboard** — Monthly overview of income, expenses, and net balance, with a month/year filter and a category breakdown chart (bar or pie).
- **Budget limits** — Set monthly spending caps per category and track progress with visual indicators that warn you when you're close to or over budget.
- **Full transaction management** — View all transactions grouped by month, and edit or delete any entry.
- **Authentication** — Secure signup and login with hashed passwords and token-based sessions.

---

## Tech Stack

**Frontend**
- React (Vite)
- React Router
- Bootstrap
- Recharts
- Axios

**Backend**
- Node.js / Express
- MongoDB (Mongoose)
- JWT authentication
- bcrypt

**AI**
- Groq API (Llama 3.3)

**Deployment**
- Frontend hosted on Vercel
- Backend hosted on Render
- Database on MongoDB Atlas

---

## How it works

When a user sends a message, the backend first classifies it as either a transaction to log or a question about their finances. Transactions are parsed into structured data and saved to the database, then returned to the chat as a card. Questions trigger a second step where the app gathers the user's monthly financial data and asks the AI to answer in plain language. All AI calls happen server-side so the API key is never exposed to the client.

---

## Project Structure

```
nudget/
├── client/          React frontend (Vite)
│   └── src/
│       ├── pages/         Landing, Login, Register, Chat, Dashboard, Transactions, Edit
│       ├── components/    Navbar, TransactionCard, BudgetLimits, FloatingButton
│       ├── hooks/         Custom hooks for data fetching
│       └── context/       Auth context
└── server/          Node/Express backend
    ├── models/      User, Transaction, Budget, Message
    ├── routes/      auth, transactions, budgets
    ├── middleware/  JWT verification
    └── utils/       Message history helper
```

---

## About

Nudget was built as a capstone project for the CircuitStream × UBC Software Development Bootcamp. It explores how natural language and AI can remove the friction that makes traditional budgeting apps hard to stick with.
