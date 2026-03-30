# SafeHer Web

SafeHer is a Next.js app with Supabase-backed authentication, profile storage, SOS records, and protected dashboard/admin routes.

## 1) Environment variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 2) Create database tables

Run the SQL in `supabase/schema.sql` in the Supabase SQL Editor.

This creates and configures:
- `public.profiles`
- `public.sos_records`
- RLS policies for user-level access
- `updated_at` triggers

## 3) Start app

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 4) Auth and API routes

Auth routes:
- `POST /api/auth/register` (email/password signup + profile upsert)
- `POST /api/auth/login` (email/password login + JWT cookies)
- `POST /api/auth/logout` (clear cookies)
- `GET /api/auth/session` (current auth user)

User route:
- `GET /api/user/profile` (current user profile by JWT cookie)

## 5) Protected routes

`/dashboard/*` and `/admin/*` are protected by `middleware.ts`.

If JWT cookie is missing or expired, user is redirected to `/login`.

## 6) Login model

The app uses Supabase JWT access tokens stored in secure HTTP-only cookies:
- `safeher_access_token`
- `safeher_refresh_token`

Frontend login/register forms call backend APIs (not direct client-side auth), which keeps auth flow clearer and more production-friendly.
