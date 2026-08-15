-- Run this in your Supabase project's SQL Editor (Supabase Dashboard → SQL Editor → New query)
-- This sets up the tables and security rules for Fern & Fifty.

-- 1. Expenses table
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  amount numeric not null,
  currency text not null check (currency in ('NZD', 'PKR')),
  amount_in_nzd numeric not null,
  rate_used numeric not null,
  category text not null,
  note text default '',
  due_date date,
  created_at timestamptz default now()
);

-- Safe to re-run: adds the due_date column if it's missing from an earlier setup
alter table expenses add column if not exists due_date date;

alter table expenses enable row level security;

create policy "Users can view their own expenses"
  on expenses for select using (auth.uid() = user_id);
create policy "Users can insert their own expenses"
  on expenses for insert with check (auth.uid() = user_id);
create policy "Users can delete their own expenses"
  on expenses for delete using (auth.uid() = user_id);
create policy "Users can update their own expenses"
  on expenses for update using (auth.uid() = user_id);

-- 2. Profile table (settings + budgets stored as JSON per user)
create table if not exists profiles (
  user_id uuid references auth.users(id) on delete cascade primary key,
  name text default '',
  rate numeric default 79.5,
  monthly_income numeric default 9000,
  remittance_target numeric default 1500,
  budgets jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select using (auth.uid() = user_id);
create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = user_id);
create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = user_id);

-- 3. Index for faster expense queries per user
create index if not exists expenses_user_id_idx on expenses(user_id);
