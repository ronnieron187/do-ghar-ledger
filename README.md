# Fern & Fifty

A budget and expense tracker with real accounts — built for someone living between
two currencies. Every user signs up, logs in, and gets their own private, saved
data (no more browser-only storage).

## What's new in this version

- **A public landing page** (`/`) explaining what the app does, with a "Get
  started" button — the actual app now lives at `/dashboard`
- **Real accounts**: sign up / sign in with email + password
- **Cloud database**: every expense, budget, and setting is saved to your account
  via Supabase (Postgres), not just the browser — works across devices
- **Private by design**: Row Level Security means each user can only ever see
  their own data, enforced at the database level
- **New categories**: Donations, Loan Repayment, Loan Given, and
  Fitness/Equipment, alongside the originals
- **Loan due dates**: "Loan Repayment" (money you owe) and "Loan Given" (money
  you've lent) prompt for a date — repay-by or expected-back-by — and show an
  "Overdue" badge in the expense list once that date passes
- Everything from before: the Currency Bridge converter, category budgets, charts,
  expense history, and JSON export

## One-time setup: create your Supabase project

This app needs a free Supabase project to store accounts and data.

1. Go to **https://supabase.com** and sign up (free tier is enough)
2. Click **New Project**, give it a name, set a database password (save it
   somewhere), pick a region close to New Zealand, and create it — takes ~2 minutes
3. Once it's ready, go to **SQL Editor** in the left sidebar → **New query**
4. Open the file `supabase/schema.sql` from this project, copy all of it, paste it
   into the SQL editor, and click **Run**. This creates the tables and security
   rules.
5. Go to **Settings → API** in the Supabase dashboard. You'll need two values:
   - **Project URL**
   - **anon public** key

## Running it locally in VS Code

1. Open this folder in VS Code
2. Copy `.env.example` to a new file named `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Open `.env.local` and paste in your Project URL and anon key from Supabase
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the dev server:
   ```bash
   npm run dev
   ```
6. Open http://localhost:3000 — you'll land on the sign-up/sign-in page

## Deploying to Vercel

1. Push this folder to a GitHub repository
2. Go to vercel.com → **New Project** → import the repo
3. **Important**: before deploying, add your environment variables. In the
   "Environment Variables" section, add:
   - `NEXT_PUBLIC_SUPABASE_URL` → your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your Supabase anon key
4. Click **Deploy**

If Supabase requires confirming email addresses (default for new projects), go to
**Supabase → Authentication → URL Configuration** and add your Vercel URL
(e.g. `https://your-app.vercel.app`) as a **Redirect URL**, otherwise confirmation
links will point back to `localhost`.

## Turning off email confirmation (optional, for faster testing)

By default Supabase requires users to confirm their email before signing in. To
skip this while testing: **Supabase → Authentication → Providers → Email** → turn
off "Confirm email". Turn it back on before real users sign up.

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase (Postgres database + authentication)
- Recharts for the charts
