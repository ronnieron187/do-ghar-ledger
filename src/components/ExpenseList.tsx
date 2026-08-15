"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, Category, Expense, isLoanCategory } from "@/lib/types";
import { formatNZD, formatPKR } from "@/lib/currency";

export default function ExpenseList({
  expenses,
  onDelete,
}: {
  expenses: Expense[];
  onDelete: (id: string) => void;
}) {
  const [filter, setFilter] = useState<Category | "All">("All");

  const filtered = useMemo(() => {
    const list = filter === "All" ? expenses : expenses.filter((e) => e.category === filter);
    return [...list].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [expenses, filter]);

  return (
    <div className="rounded-card border border-line bg-surface shadow-card p-5">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h3 className="font-display text-lg font-medium">Expense history</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as Category | "All")}
          className="bg-surface2 border border-line rounded-md px-3 py-1.5 text-xs outline-none"
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-mist text-sm py-6 text-center">
          Nothing logged yet. Add your first expense to start the record.
        </p>
      ) : (
        <div className="max-h-[420px] overflow-y-auto pr-1 space-y-2">
          {filtered.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between gap-3 rounded-md border border-line/70 bg-surface2/60 px-3.5 py-2.5"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-ivory truncate">{e.category}</span>
                  <span className="text-mist text-xs shrink-0">{e.date}</span>
                </div>
                {e.note && <div className="text-mist text-xs mt-0.5 truncate">{e.note}</div>}
                {isLoanCategory(e.category) && e.dueDate && (
                  <div
                    className={`inline-flex items-center gap-1 mt-1 text-[11px] font-medium rounded-full px-2 py-0.5 ${
                      new Date(e.dueDate) < new Date(new Date().toDateString())
                        ? "bg-alert/15 text-alert"
                        : "bg-pk/15 text-pk"
                    }`}
                  >
                    {new Date(e.dueDate) < new Date(new Date().toDateString())
                      ? "Overdue since"
                      : e.category === "Loan Repayment"
                      ? "Due"
                      : "Expected back"}{" "}
                    {e.dueDate}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right font-mono text-sm">
                  <div className="text-ivory">
                    {e.currency === "NZD" ? formatNZD(e.amount) : formatPKR(e.amount)}
                  </div>
                  <div className="text-mist text-[11px]">
                    {e.currency === "NZD" ? formatPKR(e.amount * e.rateUsed) : formatNZD(e.amountInNZD)}
                  </div>
                </div>
                <button
                  onClick={() => onDelete(e.id)}
                  aria-label={`Delete expense: ${e.category} on ${e.date}`}
                  className="text-mist hover:text-alert transition-colors text-lg leading-none px-1"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
