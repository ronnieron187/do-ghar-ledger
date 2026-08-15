"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatNZD } from "@/lib/currency";

export default function TrendChart({ data }: { data: { month: string; spent: number }[] }) {
  return (
    <div className="rounded-card border border-line bg-surface shadow-card p-5">
      <h3 className="font-display text-lg font-medium mb-2">Spending trend</h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A3947" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#9FB0BE", fontSize: 11 }} axisLine={{ stroke: "#2A3947" }} tickLine={false} />
            <YAxis tick={{ fill: "#9FB0BE", fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
            <Tooltip
              contentStyle={{ background: "#1D2B39", border: "1px solid #2A3947", borderRadius: 8, fontSize: 12 }}
              cursor={{ fill: "rgba(79,184,175,0.08)" }}
              formatter={(value: number) => [formatNZD(value), "Spent"]}
            />
            <Bar dataKey="spent" fill="#4FB8AF" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
