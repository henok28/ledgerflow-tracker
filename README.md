# LedgerFlow — Small Business Expense & Income Tracker

A simple, mobile-responsive single-tenant web application for small business owners to manually log expenses and income sales without authentication or inventory overhead.

---

## 🚀 Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **State Management**: Redux Toolkit + Redux Saga
- **Backend**: Node.js + TypeScript as Vercel Serverless Functions (`/api/*`)
- **ORM**: Prisma 6 (serverless singleton pattern)
- **Database**: PostgreSQL (hosted via Vercel Postgres / Neon)
- **Hosting**: Vercel (monorepo fullstack deployment)

---

## 🎨 Design Palette

- **Primary**: `#1B4332` (dark forest green)
- **Primary Hover**: `#2D6A4F`
- **Background**: `#F8F7F2` (warm off-white)
- **Card Surface**: `#FFFFFF` with subtle shadows and rounded corners
- **Income Accent**: `#40916C` (fresh green for revenue / "money in")
- **Expense Accent**: `#BC6C25` (warm rust/terracotta for costs / "money out")
- **Text**: `#1F2937` (dark charcoal), `#6B7280` (muted gray)
- **Borders**: `#E5E7EB` (light gray)

---

## 📁 Project Structure

```
kirubelsProject/
├── api/
│   ├── _lib/
│   │   ├── prisma.ts        # Serverless-safe Prisma client singleton (Neon pooled connection)
│   │   ├── types.ts         # Serverless API types & enums
│   │   └── validation.ts    # Input validation & entity serialization
│   ├── expenses/
│   │   ├── index.ts         # GET (list with filters) & POST (create)
│   │   └── [id].ts          # PUT (edit) & DELETE (delete)
│   ├── income/
│   │   ├── index.ts         # GET (list with filters) & POST (create)
│   │   └── [id].ts          # PUT (edit) & DELETE (delete)
│   └── summary.ts           # GET summary stats (total income, total expense, net profit)
├── prisma/
│   └── schema.prisma        # Expense and Income models with Postgres configuration
├── src/
│   ├── api/
│   │   └── client.ts        # API client with seamless offline/local fallback
│   ├── components/
│   │   ├── common/
│   │   │   ├── ConfirmDialog.tsx # Modal confirmation before record deletion
│   │   │   ├── Modal.tsx         # Accessible, responsive slide-up modal wrapper
│   │   │   └── ToastContainer.tsx# Notification toast system
│   │   ├── dashboard/
│   │   │   └── SummaryCards.tsx  # Total income, expenses & profit cards
│   │   ├── forms/
│   │   │   ├── ExpenseModal.tsx  # Add & edit expense modal
│   │   │   └── IncomeModal.tsx   # Add & edit income modal
│   │   ├── layout/
│   │   │   ├── Header.tsx        # Dark forest green header with quick actions
│   │   │   ├── MobileBottomBar.tsx# Sticky bottom quick logging buttons for phones
│   │   │   └── Footer.tsx        # Status footer
│   │   └── transactions/
│   │       ├── EmptyState.tsx    # Friendly zero-data state
│   │       ├── FilterBar.tsx     # Type, category/channel, date range & search filter
│   │       ├── TransactionItem.tsx # Mobile card & desktop table row
│   │       └── TransactionList.tsx # Unified reverse-chronological transaction ledger
│   ├── store/
│   │   ├── index.ts         # Redux Toolkit store + Saga middleware setup
│   │   ├── rootSaga.ts      # Combined saga root
│   │   ├── sagas/
│   │   │   ├── expensesSaga.ts
│   │   │   ├── incomeSaga.ts
│   │   │   └── summarySaga.ts
│   │   └── slices/
│   │       ├── expensesSlice.ts
│   │       ├── incomeSlice.ts
│   │       ├── summarySlice.ts
│   │       └── uiSlice.ts
│   ├── types/
│   │   └── index.ts         # Application TypeScript types
│   ├── utils/
│   │   └── formatters.ts    # Currency, date, and preset range formatters
│   ├── App.tsx              # Main view
│   ├── index.css            # Custom CSS & Tailwind utilities
│   └── main.tsx             # React entrypoint
├── tailwind.config.js       # Tailwind palette configuration
├── vercel.json              # Vercel deployment configuration
├── .env.example             # Example database environment variables
└── README.md
```

---

## ⚙️ Setup & Configuration

### 1. Prerequisites
- Node.js 18+ (tested on Node 24)
- npm or pnpm
- Vercel CLI (`npm i -g vercel`) for serverless local testing

### 2. Environment Variables
Create a `.env` file in the project root based on `.env.example`:

```bash
# Neon / Vercel Postgres pooled connection string (used by PrismaClient in serverless functions)
DATABASE_URL="postgres://default:password@ep-example-pooler.us-east-1.aws.neon.tech/verceldb?sslmode=require"

# Direct connection string (used by Prisma CLI for migrations)
DIRECT_URL="postgres://default:password@ep-example.us-east-1.aws.neon.tech/verceldb?sslmode=require"
```

> **Why pooled vs. direct?**
> Serverless functions spin up and tear down per request. Neon's pooled connection endpoint prevents PostgreSQL connection pool exhaustion. Prisma CLI migrations require `DIRECT_URL` because schema alterations cannot run in transaction pooler mode.

---

## 🗄️ Database Migrations

Generate the Prisma Client:
```bash
npx prisma generate
```

Run migrations against your Neon PostgreSQL database:
```bash
npx prisma migrate dev --name init
```

To view or manage database records via GUI:
```bash
npx prisma studio
```

---

## 💻 Running Locally

### Option A: Running with Vite Dev Server (Fast UI Development)
The frontend comes equipped with an automatic local fallback, allowing you to test UI interactions immediately without an active database:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

### Option B: Running Fullstack with `vercel dev` (Serverless Functions + Database)
To test both the Vite frontend and the `/api` serverless functions locally:
```bash
vercel dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 🚢 Deploying to Vercel

1. Push your code to GitHub, GitLab, or Bitbucket.
2. In the [Vercel Dashboard](https://vercel.com), import your repository.
3. Link a **Vercel Postgres** database (Neon integration) from the Storage tab, or add `DATABASE_URL` and `DIRECT_URL` in **Project Settings > Environment Variables**.
4. Deploy! Vercel automatically runs `prisma generate && tsc -b && vite build` as configured in [vercel.json](file:///home/henok/projects/kirubelsProject/vercel.json).

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/expenses` | List expenses (optional query params: `category`, `startDate`, `endDate`) |
| `POST` | `/api/expenses` | Create a new expense (`amount`, `category`, `description`, `date`) |
| `PUT` | `/api/expenses/:id` | Update an existing expense by ID |
| `DELETE` | `/api/expenses/:id` | Delete an expense by ID |
| `GET` | `/api/income` | List income entries (optional query params: `channel`, `startDate`, `endDate`) |
| `POST` | `/api/income` | Create a new income entry (`amount`, `channel`, `description`, `date`) |
| `PUT` | `/api/income/:id` | Update an existing income entry by ID |
| `DELETE` | `/api/income/:id` | Delete an income entry by ID |
| `GET` | `/api/summary` | Get aggregated financial summary (`totalIncome`, `totalExpense`, `netProfit`) |
