

# 📈 StockPulse

**StockPulse** is a modern stock tracking app that gives you real-time market data, personalized watchlists, and a daily AI-summarized market news digest delivered straight to your inbox.

👉 **Live app:** [https://stockpulse.pritika.xyz](https://stockpulse.pritika.xyz)

---

## ✨ What you can do

- **Dashboard** — TradingView widgets: market overview, heatmap, top stories, market quotes (configurable sectors).
- **Search** — Command palette–style search (`Ctrl+K` / `Cmd+K`). Search symbols; add/remove from watchlist from results.
- **Watchlist** — Per-user list with live quotes. Empty state links into search.
- **Stock detail** — Quote, profile, and charts for a symbol (`/stock/[symbol]`).
- **Daily digest** — Inngest cron (e.g. noon) fetches news (general or from your watchlist), summarizes with GPT-4o-mini, and sends a personalized email via Nodemailer.

Auth and user sync: **Clerk** (sign-in, webhook for user create → Prisma/DB).



---

## 🧠 Tech Stack

| Layer           | Tech                                        |
| --------------- | ------------------------------------------- |
| App             | Next.js 15 (App Router), React 19           |
| Language        | TypeScript                                  |
| Auth            | Clerk                                       |
| Database        | MongoDB + Prisma                            |
| Market Data     | Finnhub                                     |
| UI & Charts     | Tailwind CSS, Radix UI, TradingView widgets |
| Background Jobs | Inngest (cron + AI steps)                   |
| Email           | Nodemailer                                  |
| AI              | OpenAI (GPT-4o-mini)                        |

---

## 🚀 Run Locally

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Environment variables

Create a `.env` file in the root:

#### Database

```
DATABASE_URL=
```

#### Market Data

```
NEXT_PUBLIC_FINNHUB_API_KEY=
```

#### Clerk

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET_KEY=
```

Also configure:

* Sign-in URL
* Sign-up URL
* Redirect URLs

#### AI + Email

```
OPENAI_API_KEY=
EMAIL_USER=
EMAIL_PASS=
```

#### App

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

### 3️⃣ Prisma

```bash
npx prisma generate
```

Ensure your MongoDB instance is reachable.

---

### 4️⃣ Start dev server

```bash
npm run dev
```

App runs at → **[http://localhost:3000](http://localhost:3000)**

---

### 5️⃣ (Optional) Inngest dev server

```bash
npm run inngest
```

Use the Inngest UI to test the daily digest or wait for cron execution.

---

## 📁 Project Structure (Quick Look)

```
src/app/(root)/        # Dashboard, search, watchlist, stock pages
src/app/api/           # Search, watchlist, Clerk webhook, Inngest routes
src/components/        # UI components, TradingView widgets, search modal
src/lib/actions/       # Finnhub APIs, watchlist CRUD, user helpers
src/lib/inngest/       # Cron jobs + AI summary logic
src/lib/nodemailer/    # Email sender & HTML templates
prisma/schema.prisma   # User & Watchlist models
```

---

## 🧩 Scripts

| Command           | Description          |
| ----------------- | -------------------- |
| `npm run dev`     | Start dev server     |
| `npm run build`   | Production build     |
| `npm run start`   | Run production build |
| `npm run inngest` | Inngest dev server   |
| `npm run lint`    | Lint code            |

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repo
2. Create a branch (`feature/your-feature` or `fix/your-fix`)
3. Make changes and run `npm run lint`
4. Commit with a clear message
5. Open a PR against `main`

If you have an idea or find a bug, feel free to open an **Issue** first.

---

## 📝 Notes

* Finnhub free tier has rate limits — basic throttling and caching are used
* **Daily digest flow:**

  * Fetch user watchlist
  * Pull relevant news
  * Summarize via OpenAI
  * Send one clean email per user
* Clerk webhook ensures every authenticated user exists in Prisma

---

<div align="center">

🔗 **Live:** [https://stockpulse.pritika.xyz](https://stockpulse.pritika.xyz)

</div>
