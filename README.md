# Inventory Visibility System

## Short Description
This project addresses a common operational problem: limited visibility into stock levels across product SKUs, which often leads to manual tracking and delayed responses to low inventory. The application centralizes item data (SKU, quantity, category), highlights low-stock items, and provides simple stock-in/out operations with a basic dashboard for at-a-glance metrics. It was built as part of an SDE internship assignment to demonstrate end-to-end system design and implementation.

## Features
- Authentication using Supabase (Login + Signup)
- Inventory listing with SKU, quantity, and category
- Low-stock visibility (per-item threshold)
- Stock-in and stock-out handling
- Basic dashboard metrics
- Secure backend APIs

## Tech Stack
- Frontend: Next.js (App Router), TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database & Auth: Supabase (PostgreSQL + Supabase Auth)
- Deployment: Frontend on Vercel, Backend on Render

## Architecture Overview
- The Next.js frontend calls Express APIs for inventory operations and reads dashboard metrics.
- Supabase Auth provides email/password authentication. The frontend stores and forwards the access token with API requests.
- The Express backend validates the token (JWT issued by Supabase) and performs CRUD and stock adjustments.
- Data is persisted in Supabase Postgres tables; atomic stock changes are handled via controlled API endpoints.

```mermaid
flowchart LR
  subgraph Frontend["Frontend - Next.js App Router"]
    UI["Pages and Components"]
    Auth["Supabase Auth - Browser"]
  end

  subgraph Backend["Backend - Express TypeScript"]
    Routes["REST API"]
    Validate["Request Validation"]
    Guard["Auth Middleware"]
    RPC["Supabase RPC"]
  end

  DB["Supabase PostgreSQL"]

  UI --> Routes
  Auth --> UI
  Routes --> Validate
  Routes --> Guard
  Routes --> RPC
  RPC --> DB
```

## Environment Variables
`.env.example` files are provided to illustrate required variables. Do not commit real values.

Frontend (Next.js):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_BACKEND_URL` (points to the deployed or local backend)

Backend (Express):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PORT` (optional; defaults if not set)
- `FRONTEND_ORIGIN` (for CORS, points to the frontend origin)

## Running Locally
Prerequisites:
- Node.js (v18 or newer) and npm

Backend:
- Create a `.env` file in `backend/` based on `backend/.env.example`.
- Install dependencies and start the server (development or production build) from the `backend/` directory.
- Ensure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured.

Frontend:
- Create a `.env.local` file in `frontend/` based on `frontend/.env.example`.
- Install dependencies and run the development server from the `frontend/` directory.
- Ensure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_BACKEND_URL` are configured to match your local backend.

Supabase setup (brief):
- Create a Supabase project.
- Enable email/password authentication.
- Create the necessary tables for items and stock transactions (as defined in your schema).

## Deployment
Backend (Render):
- Deploy the Express server as a Render Web Service.
- Set environment variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `FRONTEND_ORIGIN`, etc.) in Render.
- Use appropriate build/start commands per your `backend/package.json`.

Frontend (Vercel):
- Deploy the Next.js app to Vercel.
- Configure environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_BACKEND_URL`).
- Ensure `NEXT_PUBLIC_BACKEND_URL` points to the Render backend URL.

## Assumptions & Notes
- Single user role and minimal access control (sufficient for an internship scope).
- Email confirmation may be disabled in development for faster testing.
- Low-stock threshold is per item and kept simple.
- Scope is intentionally minimal to demonstrate core functionality without over-engineering.

## Author / Submission Note
This project was submitted as part of an SDE internship assignment.
