"use client";

import { useState } from "react";
import { CATEGORIES, Category, Currency, isLoanCategory } from "@/lib/types";

export default function ExpenseForm({
  onAdd,
}: {
  onAdd: (input: {
    amount: number;
    currency: Currency;
    category: Category;
    date: string;
    note: string;
    dueDate: string | null;
  }) => void;
}) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("NZD");
  const [category, setCategory] = useState<Category>("Groceries");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const showDueDate = isLoanCategory(category);
  const dueDateLabel =
    category === "Loan Repayment" ? "I must repay by" : "Expected back by";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    if (showDueDate && !dueDate) {
      setError(
        `Enter the date this ${category === "Loan Repayment" ? "is due" : "is expected back"}.`
      );
      return;
    }
    onAdd({
      amount: value,
      currency,
      category,
      date,
      note: note.trim(),
      dueDate: showDueDate ? dueDate : null,
    });
    setAmount("");
    setNote("");
    setDueDate("");
    setError("");
  }

  return (
    <form onSubmit={submit} className="rounded-card border border-line bg-surface shadow-card p-5">
      <h3 className="font-display text-lg font-medium mb-4">Log an expense</h3>

      {error && <div className="text-alert text-sm mb-3">{error}</div>}

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-mist text-xs mb-1">Amount</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            inputMode="decimal"
            placeholder="0.00"
            className="w-full bg-surface2 border border-line rounded-md px-3 py-2 font-mono text-sm outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-mist text-xs mb-1">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="w-full bg-surface2 border border-line rounded-md px-3 py-2 text-sm outline-none"
          >
            <option value="NZD">NZD</option>
            <option value="PKR">PKR</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-mist text-xs mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full bg-surface2 border border-line rounded-md px-3 py-2 text-sm outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-mist text-xs mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-surface2 border border-line rounded-md px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      {showDueDate && (
        <div className="mb-3 rounded-md border border-pk/30 bg-pk-soft/20 px-3 py-3">
          <label className="block text-pk text-xs font-medium mb-1">{dueDateLabel}</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full bg-surface2 border border-line rounded-md px-3 py-2 text-sm outline-none"
            required
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-mist text-xs mb-1">Note (optional)</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Weekly groceries at Pak'nSave"
          className="w-full bg-surface2 border border-line rounded-md px-3 py-2 text-sm outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-nz text-ink font-semibold text-sm py-2.5 hover:brightness-110 transition"
      >
        Add expense
      </button>
    </form>
  );
}
