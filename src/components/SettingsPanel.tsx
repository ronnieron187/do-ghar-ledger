"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Settings } from "@/lib/types";

export default function SettingsPanel({
  settings,
  email,
  onChange,
  onClose,
}: {
  settings: Settings;
  email: string;
  onChange: (settings: Settings) => void;
  onClose: () => void;
}) {
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-card border border-line bg-surface shadow-card p-6 my-8">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display text-xl font-medium">Your profile</h3>
          <button onClick={onClose} className="text-mist hover:text-ivory text-xl leading-none">×</button>
        </div>
        <p className="text-mist text-xs mb-5">{email}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-mist text-xs mb-1">Name</label>
            <input
              value={settings.name}
              onChange={(e) => onChange({ ...settings, name: e.target.value })}
              className="w-full bg-surface2 border border-line rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-mist text-xs mb-1">Monthly income (NZD, after tax)</label>
            <input
              type="number"
              value={settings.monthlyIncome}
              onChange={(e) => onChange({ ...settings, monthlyIncome: parseFloat(e.target.value) || 0 })}
              className="w-full bg-surface2 border border-line rounded-md px-3 py-2 text-sm font-mono outline-none"
            />
          </div>
          <div>
            <label className="block text-mist text-xs mb-1">Monthly remittance target to Pakistan (NZD)</label>
            <input
              type="number"
              value={settings.remittanceTarget}
              onChange={(e) => onChange({ ...settings, remittanceTarget: parseFloat(e.target.value) || 0 })}
              className="w-full bg-surface2 border border-line rounded-md px-3 py-2 text-sm font-mono outline-none"
            />
          </div>
          <p className="text-mist text-xs leading-relaxed pt-1">
            Your data is saved to your account and only visible to you, wherever you
            sign in.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 rounded-md bg-nz text-ink font-semibold text-sm py-2.5 hover:brightness-110 transition"
        >
          Save & close
        </button>
        <button
          onClick={signOut}
          className="w-full mt-2.5 rounded-md border border-line text-mist hover:text-alert hover:border-alert/50 font-medium text-sm py-2.5 transition"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
