# Nudget — Development Log

## Week 1 — Foundation (April 26–May 2)

### What I built
Set up the full backend from scratch. This included scaffolding the project structure with separate `client` and `server` folders, configuring Node/Express with ES6 modules, connecting to MongoDB Atlas, and building JWT-based authentication (register, login, middleware).

### Challenges
**Case sensitivity on deployment:** File names like `user.js` work fine on Mac (case-insensitive) but fail on Linux servers like Render which are case-sensitive. I had to rename all model files to be capitalized (`User.js`, `Transaction.js`) using `git mv` to ensure Git tracked the rename properly.

**ES6 module loading order:** `dotenv.config()` runs after imports in ES6 modules due to hoisting. The fix was creating a separate `env.js` file that loads environment variables and importing it first, before any other module tries to read from `process.env`.

**Port blocking:** Port 5000 was blocked on my machine. Switched to port 3000 which resolved the issue.

### Key learnings
- ES6 modules hoist imports before any code runs, which affects initialization order
- Git treats file renames as delete + add unless you use `git mv`
- Always test locally with the same constraints as your deployment target

---

## Week 2 — Groq API Integration (May 3–May 9)

### What I built
Integrated the Groq API (Llama 3.3) for conversational transaction parsing. Built a two-step AI pipeline: first a classifier that determines whether the user input is a transaction to log or a question about their finances, then either a parser or a financial Q&A responder. Also built out all CRUD routes for transactions.

### Challenges
**Groq model deprecation:** The `llama3-8b-8192` model was decommissioned mid-development. Had to switch to `llama-3.3-70b-versatile` which required updating the model string in the route.

**JSON parsing reliability:** Groq occasionally returns markdown backticks or extra text around the JSON. Solved by being very explicit in the system prompt: "Return ONLY a valid JSON object with no extra text, no markdown, no backticks."

**AI question answering:** Initially the app only logged transactions. Extended the classifier to detect financial questions and added a second Groq call that fetches the user's real monthly data and passes it as context so Groq can answer questions like "how much did I spend on food this month?" with accurate numbers.

### Key learnings
- LLM output needs strict prompt engineering to be reliably parseable
- Two-step AI pipelines (classify first, then act) are more reliable than trying to do everything in one prompt
- Always check model deprecation notices when using third-party AI APIs

---

## Week 3 — React Frontend (May 10–May 16)

### What I built
Built the entire React frontend: routing with React Router, JWT auth context, Axios API layer with request interceptors, Login/Register pages, the main Chat page with conversational UI, TransactionCard component, and Navbar. The core chat feature — typing a transaction and seeing it parsed into a card — was working end to end by the end of this week.

### Challenges
**Auth context and token persistence:** Storing the JWT in localStorage and making it available across all components without prop drilling required setting up React Context. The `useAuth` hook made this clean to consume anywhere in the app.

**Chat message state:** Managing the chat messages as a local array with different types (user bubble, transaction card, answer bubble, error bubble) required careful state management. Each message type renders differently in the UI.

**Missing `finally` block:** A bug where the loading state never reset to `false` after an API call caused the Send button to stay disabled permanently. Adding a `finally` block to reset `setLoading(false)` fixed it.

### Key learnings
- React Context eliminates prop drilling for shared state like authentication
- Always include `finally` blocks in async functions to reset loading states
- Building the core feature first (chat + parsing) before styling makes debugging much faster

---

## Week 4 — Dashboard, Charts & Polish (May 17–May 25)

### What I built
Dashboard page with monthly income/expenses/net balance summary cards, a spending category chart (bar and pie toggle) using Recharts, budget limits with progress bars, and the Transactions page with transactions grouped by month. Also built the persistent chat history feature using a separate Message model with a 100-message rolling cap. Added Bootstrap for responsive styling across all pages.

### Challenges
**Summary route date filtering:** The dashboard was showing transactions from multiple months because the MongoDB query only had a lower bound (`$gte: startOfMonth`) with no upper bound. Fixed by adding `$lt: endOfMonth` to properly constrain to the selected month.

**Persistent chat history:** The chat initially only showed cards from the current session. Built a `Message` model that stores both user inputs and bot responses (cards and answers), capped at 100 messages per user with automatic deletion of oldest messages. On load, the last 30 messages are fetched and rendered in order.

**Bootstrap class conflicts:** Bootstrap's `.navbar` class was overriding custom styles. Renamed the custom class to `.nudget-navbar` to avoid the conflict.

### Key learnings
- Always set both upper and lower bounds on date range queries in MongoDB
- Rolling message caps are a practical alternative to unlimited chat history storage
- CSS framework class names can conflict with custom styles — use specific namespacing

---

## Week 5 — Deployment, Bug Fixes & Final Features (May 26–June 6)

### What I built
Deployed backend to Render and frontend to Vercel. Added manual transaction entry with a date picker modal, edit date functionality, category dropdowns in the edit form, and natural language date parsing ("yesterday coffee 6" logs with yesterday's date). Fixed multiple bugs discovered during deployment.

### Challenges
**MongoDB Atlas IP whitelist:** Render's servers have different IP addresses than my local machine. The database was refusing connections until I added `0.0.0.0/0` to the Atlas IP Access List to allow connections from anywhere.

**Timezone bugs:** This was the most persistent bug. Dates were consistently showing one day off because:
- `toISOString()` returns UTC time, which is behind Vancouver time
- The Render server runs in UTC (Virginia), so "today" on the server differed from "today" for the user
- Groq was unreliable at calculating relative dates like "yesterday" correctly across timezones

**Solution:** Installed `chrono-node`, a dedicated natural language date parsing library. Instead of asking Groq to figure out what date "yesterday" refers to, `chrono-node` parses the user's raw input server-side and extracts the correct date. This reliably handles "yesterday", "2 days ago", "last friday", and specific dates like "June 1".

**Message snapshot updates:** When a transaction is edited, the chat card (which stores a snapshot of the transaction) needs to be updated too. Solved by adding a `transactionId` field to the Message model and updating the message snapshot whenever a transaction is edited via `PUT /:id`.

### Key learnings
- Timezone handling is one of the most common sources of subtle bugs in full-stack apps — always be explicit about which timezone you're working in
- Using a purpose-built library (chrono-node) is far more reliable than asking an LLM to do date arithmetic
- Deployment surfaces bugs that never appear in local development — always test in production before submitting
- Free tier cloud services (Render) spin down after inactivity, which affects first-request latency

---

## Reflection

The biggest technical challenge throughout this project was the AI integration — not the API calls themselves, but making the AI output reliable and predictable enough to use as structured data. Strict prompt engineering, explicit output format requirements, and adding fallback error handling made the difference between a fragile demo and something that actually works consistently.

The most valuable learning was understanding how much context matters in full-stack development. A bug that seems like a frontend display issue (wrong date showing) turned out to be a combination of server timezone, LLM reliability, and JavaScript date parsing — three different layers all contributing to one visible symptom.

Nudget started as a minimal capstone decoy for a real product idea. Building it end to end gave me a clear picture of what "production ready" actually means versus "works on my machine."
