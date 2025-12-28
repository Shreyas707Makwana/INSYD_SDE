# Inventory Visibility System (Option 1 — SDE)

A complete, interview-quality full-stack project: Next.js 14 (App Router, TypeScript) + Tailwind; Backend: Node.js + Express + TypeScript; DB: Supabase (Postgres) via @supabase/supabase-js. Validation: Zod. Auth: Supabase Auth (email/password) from frontend. Testing: Jest. Deploy: Vercel (frontend), Render or Heroku (backend).

## Overview
- Items with `sku`, `name`, `category`, `quantity`, `low_stock_threshold`.
- Transactions record stock-in/out with timestamps and notes.
- Supabase accessed ONLY from backend using Service Role key.
- Frontend logs in with Supabase Auth and calls backend APIs with `Authorization: Bearer <access_token>`.

## Architecture
```mermaid
flowchart LR
  subgraph Frontend [Next.js 14]
    UI[Pages & Components]
    Auth[Supabase Auth (Browser)]
  end
  subgraph Backend [Express + TS]
    Routes[REST API]
    C[Zod Validation]
    M[Auth Middleware]
    RPC[Supabase RPC]
  end
  DB[(Supabase Postgres)]

  UI -->|Fetch+Bearer| Routes
  Auth -->|access_token| UI
  Routes --> RPC --> DB
```

## API Summary
- POST /api/items
- GET /api/items?q=&page=&limit=
- GET /api/items/:id
- PUT /api/items/:id
- DELETE /api/items/:id
- POST /api/items/:id/stock-in
- POST /api/items/:id/stock-out
- GET /api/items/low-stock?threshold=
- POST /api/auth/verify

## Data Model
- `items(id, sku UNIQUE, name, category, quantity>=0 CHECK, low_stock_threshold>=0, created_at, updated_at)`
- `transactions(id, item_id FK, type in('in','out'), amount>0, note, created_at)`

## Key Design Choices
- Supabase RPC functions `fn_stock_in` and `fn_stock_out` used for atomic stock changes and transaction recording.
- Backend validates inputs with Zod; predictable JSON responses and status codes.
- Frontend holds access token in memory (not persisted) to keep scope minimal and safe.

## Interview Talking Points
- Consistency: stock changes handled atomically via DB-side RPC.
- Security: service role key strictly server-side; frontend uses anon key + Auth only.
- Scalability: pagination, indexed `sku`, RPC path scalable to queued workers.

## Getting Started
See MANUAL_TASKS.md for precise, step-by-step instructions to set up Supabase, run SQL, configure env vars, run locally, test, and deploy.
