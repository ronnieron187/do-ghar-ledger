export default function StatCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "good" | "alert" | "pk";
}) {
  const toneClass =
    tone === "good" ? "text-good" : tone === "alert" ? "text-alert" : tone === "pk" ? "text-pk" : "text-ivory";

  return (
    <div className="rounded-card border border-line bg-surface shadow-card p-5">
      <div className="text-mist text-xs font-semibold tracking-[0.14em] uppercase mb-2">{label}</div>
      <div className={`font-display text-3xl font-medium ${toneClass}`}>{value}</div>
      {sub && <div className="text-mist text-xs mt-1.5">{sub}</div>}
    </div>
  );
}
