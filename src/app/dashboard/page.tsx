"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CurrencyBridge from "@/components/CurrencyBridge";
import StatCard from "@/components/StatCard";
import ExpenseForm from "@/components/ExpenseForm";
import BudgetBars from "@/components/BudgetBars";
import ExpenseList from "@/components/ExpenseList";
import CategoryChart from "@/components/CategoryChart";
import TrendChart from "@/components/TrendChart";
import SettingsPanel from "@/components/SettingsPanel";
import { createClient } from "@/lib/supabase/client";
import { db } from "@/lib/db";
import { BudgetMap, DEFAULT_BUDGETS, DEFAULT_SETTINGS, Expense, Settings, Category, Currency } from "@/lib/types";
import { currentMonthKey, formatNZD, monthKey, monthLabel, toNZD } from "@/lib/currency";

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();

  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<BudgetMap>(DEFAULT_BUDGETS);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUserId(user.id);
      setEmail(user.email ?? "");

      const [expenseList, profile] = await Promise.all([
        db.getExpenses(),
        db.getProfile(user.id),
      ]);

      setExpenses(expenseList);
      setSettings({ ...profile.settings, name: profile.settings.name || user.email?.split("@")[0] || "" });
      setBudgets(profile.budgets);
      setReady(true);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist profile (settings + budgets) whenever they change, after initial load
  useEffect(() => {
    if (!ready || !userId) return;
    const timeout = setTimeout(() => {
      db.saveProfile(userId, settings, budgets);
    }, 500);
    return () => clearTimeout(timeout);
  }, [settings, budgets, ready, userId]);

  const month = currentMonthKey();

  const monthExpenses = useMemo(
    () => expenses.filter((e) => monthKey(e.date) === month),
    [expenses, month]
  );

  const totalSpentThisMonth = useMemo(
    () => monthExpenses.reduce((sum, e) => sum + e.amountInNZD, 0),
    [monthExpenses]
  );

  const remittanceSpent = useMemo(
    () =>
      monthExpenses
        .filter((e) => e.category === "Family Remittance")
        .reduce((sum, e) => sum + e.amountInNZD, 0),
    [monthExpenses]
  );

  const totalBudget = useMemo(() => Object.values(budgets).reduce((a, b) => a + b, 0), [budgets]);

  const spentByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of monthExpenses) map[e.category] = (map[e.category] ?? 0) + e.amountInNZD;
    return map;
  }, [monthExpenses]);

  const categoryChartData = useMemo(
    () => Object.entries(spentByCategory).map(([name, value]) => ({ name, value })),
    [spentByCategory]
  );

  const trendData = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of expenses) {
      const k = monthKey(e.date);
      map[k] = (map[k] ?? 0) + e.amountInNZD;
    }
    return Object.entries(map)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .slice(-6)
      .map(([k, v]) => ({ month: monthLabel(k).split(" ")[0], spent: v }));
  }, [expenses]);

  const remaining = settings.monthlyIncome - totalSpentThisMonth;
  const savingsRate = settings.monthlyIncome > 0 ? Math.max(0, (remaining / settings.monthlyIncome) * 100) : 0;

  async function addExpense(input: {
    amount: number;
    currency: Currency;
    category: Category;
    date: string;
    note: string;
    dueDate: string | null;
  }) {
    if (!userId) return;
    const expense: Expense = {
      id: crypto.randomUUID(),
      date: input.date,
      amount: input.amount,
      currency: input.currency,
      amountInNZD: toNZD(input.amount, input.currency, settings.rate),
      rateUsed: settings.rate,
      category: input.category,
      note: input.note,
      createdAt: new Date().toISOString(),
      dueDate: input.dueDate,
    };
    // optimistic update
    setExpenses((prev) => [expense, ...prev]);
    const saved = await db.addExpense(expense, userId);
    if (saved) {
      setExpenses((prev) => prev.map((e) => (e.id === expense.id ? saved : e)));
    }
  }

  async function deleteExpense(id: string) {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    await db.deleteExpense(id);
  }

  function exportData() {
    const payload = { expenses, budgets, settings, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fern-and-fifty-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!ready) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-mist text-sm">Loading your ledger…</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <header className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="text-pk text-xs font-semibold tracking-[0.2em] uppercase mb-2">{monthLabel(month)}</div>
          <a href="/" className="inline-block">
            <h1 className="font-display text-3xl md:text-4xl font-medium hover:text-nz transition-colors">
              Fern &amp; Fifty
            </h1>
          </a>
          <p className="text-mist text-sm mt-1.5 max-w-md">
            {settings.name ? `${settings.name}'s` : "Your"} record of two homes, two currencies —
            every dollar tracked, every rupee accounted for.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={exportData}
            className="text-xs border border-line rounded-md px-3 py-2 text-mist hover:text-ivory hover:border-mist transition-colors"
          >
            Export backup
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="text-xs border border-line rounded-md px-3 py-2 text-mist hover:text-ivory hover:border-mist transition-colors"
          >
            Profile
          </button>
        </div>
      </header>

      <div className="mb-6">
        <CurrencyBridge rate={settings.rate} onRateChange={(rate) => setSettings((s) => ({ ...s, rate }))} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Spent this month" value={formatNZD(totalSpentThisMonth)} />
        <StatCard label="Remaining income" value={formatNZD(remaining)} tone={remaining >= 0 ? "good" : "alert"} />
        <StatCard
          label="Sent to Pakistan"
          value={formatNZD(remittanceSpent)}
          sub={`Target ${formatNZD(settings.remittanceTarget)}`}
          tone="pk"
        />
        <StatCard label="Savings rate" value={`${savingsRate.toFixed(0)}%`} sub={`Of ${formatNZD(settings.monthlyIncome)} income`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        <div className="space-y-6">
          <ExpenseForm onAdd={addExpense} />
          <BudgetBars budgets={budgets} spentByCategory={spentByCategory} onChange={setBudgets} />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CategoryChart data={categoryChartData} />
            <TrendChart data={trendData} />
          </div>
          <ExpenseList expenses={expenses} onDelete={deleteExpense} />
        </div>
      </div>

      {totalBudget > 0 && totalSpentThisMonth > totalBudget && (
        <div className="mt-6 rounded-card border border-alert/40 bg-alert/10 p-4 text-sm text-alert">
          You&apos;ve gone over your combined monthly budget of {formatNZD(totalBudget)}. Check the
          category breakdown to see where.
        </div>
      )}

      {showSettings && (
        <SettingsPanel settings={settings} email={email} onChange={setSettings} onClose={() => setShowSettings(false)} />
      )}
    </main>
  );
}
