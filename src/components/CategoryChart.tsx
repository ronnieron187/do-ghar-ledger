"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatNZD } from "@/lib/currency";

const PALETTE = [
  "#4FB8AF", "#C9A44C", "#6FBF8B", "#E2635A", "#8AA6C1",
  "#B58BC1", "#D98C5F", "#5FA8D9", "#A0C15F", "#C15F9E", "#7A8B99",
];

export default function CategoryChart({ data }: { data: { name: string; value: number }[] }) {
  const filtered = data.filter((d) => d.value > 0);

  if (filtered.length === 0) {
    return (
      <div className="rounded-card border border-line bg-surface shadow-card p-5 flex items-center justify-center h-[280px]">
        <p className="text-mist text-sm">Spending by category will appear here.</p>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-line bg-surface shadow-card p-5">
      <h3 className="font-display text-lg font-medium mb-2">This month, by category</h3>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={filtered} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2} stroke="none">
              {filtered.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#1D2B39", border: "1px solid #2A3947", borderRadius: 8, fontSize: 12 }}
              formatter={(value: number, name: string) => [formatNZD(value), name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
        {filtered.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2 text-xs text-mist truncate">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: PALETTE[i % PALETTE.length] }} />
            <span className="truncate">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
