"use client";

import { useState } from "react";
import { formatNZD, formatPKR } from "@/lib/currency";

export default function CurrencyBridge({
  rate,
  onRateChange,
}: {
  rate: number;
  onRateChange: (rate: number) => void;
}) {
  const [nzdInput, setNzdInput] = useState("100");
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const nzd = parseFloat(nzdInput) || 0;
  const pkr = nzd * rate;

  async function refreshLiveRate() {
    setFetching(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/rate");
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      if (typeof data.rate === "number" && data.rate > 0) {
        onRateChange(Number(data.rate.toFixed(2)));
      } else {
        throw new Error("no rate");
      }
    } catch {
      setFetchError("Couldn't fetch a live rate — kept your manual rate.");
    } finally {
      setFetching(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-card border border-line bg-surface shadow-card">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr]">
        <div className="p-6 md:p-8 bg-gradient-to-br from-nz-soft/40 to-transparent">
          <div className="flex items-center gap-2 text-nz text-xs font-semibold tracking-[0.18em] uppercase mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-nz" />
            Aotearoa New Zealand
          </div>
          <label className="block text-mist text-sm mb-1">You have</label>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl text-mist">$</span>
            <input
              value={nzdInput}
              onChange={(e) => setNzdInput(e.target.value.replace(/[^0-9.]/g, ""))}
              inputMode="decimal"
              className="w-full bg-transparent font-display text-4xl md:text-5xl font-medium text-ivory outline-none placeholder:text-mist/40"
              placeholder="0"
              aria-label="Amount in New Zealand dollars"
            />
          </div>
          <div className="mt-1 text-mist text-sm font-mono">NZD</div>
        </div>

        <div className="relative flex flex-col items-center justify-center px-6 py-4 md:py-0 md:px-3 min-w-[140px]">
          <svg viewBox="0 0 140 60" className="hidden md:block w-32 h-14 text-line" aria-hidden="true">
            <path d="M2 48 C 30 10, 110 10, 138 48" fill="none" stroke="currentColor" strokeWidth="2" />
            {[18, 42, 70, 98, 122].map((x, i) => (
              <line
                key={i}
                x1={x}
                y1={48 - (30 - Math.abs(70 - x) * 0.28)}
                x2={x}
                y2="48"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.5"
              />
            ))}
          </svg>
          <div className="relative w-full md:w-32 h-1 rounded-full bg-line/70 overflow-hidden my-2 md:my-1">
            <span className="absolute top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-nz to-pk animate-flow" />
          </div>
          <div className="flex flex-col items-center gap-1.5 mt-1">
            <span className="font-mono text-xs text-mist">1 NZD = {rate.toFixed(2)} PKR</span>
            <input
              type="number"
              step="0.01"
              value={rate}
              onChange={(e) => onRateChange(parseFloat(e.target.value) || 0)}
              className="w-24 text-center bg-surface2 border border-line rounded-md py-1 font-mono text-sm outline-none"
              aria-label="Exchange rate, NZD to PKR"
            />
            <button
              onClick={refreshLiveRate}
              disabled={fetching}
              className="text-xs text-nz hover:text-ivory transition-colors disabled:opacity-50"
            >
              {fetching ? "Fetching…" : "Refresh live rate"}
            </button>
            {fetchError && (
              <span className="text-[11px] text-alert text-center max-w-[140px]">{fetchError}</span>
            )}
          </div>
        </div>

        <div className="p-6 md:p-8 bg-gradient-to-bl from-pk-soft/40 to-transparent">
          <div className="flex items-center gap-2 text-pk text-xs font-semibold tracking-[0.18em] uppercase mb-3 md:justify-end">
            <span className="h-1.5 w-1.5 rounded-full bg-pk" />
            Pakistan
          </div>
          <div className="md:text-right">
            <label className="block text-mist text-sm mb-1">Becomes</label>
            <div className="font-display text-4xl md:text-5xl font-medium text-ivory">
              {pkr.toLocaleString("en-PK", { maximumFractionDigits: 0 })}
            </div>
            <div className="mt-1 text-mist text-sm font-mono">PKR</div>
          </div>
        </div>
      </div>
      <div className="border-t border-line px-6 py-3 text-xs text-mist flex flex-wrap gap-x-6 gap-y-1">
        <span>{formatNZD(nzd)} → {formatPKR(pkr)}</span>
        <span className="text-mist/60">Every expense you log below is converted at this rate and saved to your account.</span>
      </div>
    </div>
  );
}
