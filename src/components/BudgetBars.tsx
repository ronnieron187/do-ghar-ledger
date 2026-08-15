"use client";

import { useState } from "react";
import { BudgetMap, CATEGORIES } from "@/lib/types";
import { formatNZD } from "@/lib/currency";

export default function BudgetBars({
  budgets,
  spentByCategory,
  onChange,
}: {
  budgets: BudgetMap;
  spentByCategory: Record<string, number>;
  onChange: (budgets: BudgetMap) => void;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="rounded-card border border-line bg-surface shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-medium">Monthly budgets</h3>
        <button
          onClick={() => setEditing((v) => !v)}
          className="text-xs text-nz hover:text-ivory transition-colors"
        >
          {editing ? "Done" : "Edit"}
        </button>
      </div>

      <div className="space-y-3.5">
        {CATEGORIES.map((cat) => {
          const budget = budgets[cat] ?? 0;
          const spent = spentByCategory[cat] ?? 0;
          const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
          const over = budget > 0 && spent > budget;

          return (
            <div key={cat}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-ivory">{cat}</span>
                {editing ? (
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => onChange({ ...budgets, [cat]: parseFloat(e.target.value) || 0 })}
                    className="w-24 bg-surface2 border border-line rounded-md px-2 py-1 text-right font-mono text-xs outline-none"
                  />
                ) : (
                  <span className={`font-mono text-xs ${over ? "text-alert" : "text-mist"}`}>
                    {formatNZD(spent)} / {formatNZD(budget)}
                  </span>
                )}
              </div>
              <div className="h-2 rounded-full bg-surface2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${over ? "bg-alert" : "bg-nz"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
