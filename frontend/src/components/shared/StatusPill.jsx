export default function StatusPill({ children, tone = "neutral" }) {
  const toneClass = {
    neutral: "border-zinc-200 bg-zinc-50 text-zinc-700",
    good: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warn: "border-amber-200 bg-amber-50 text-amber-800",
    bad: "border-red-200 bg-red-50 text-red-700",
    dark: "border-zinc-800 bg-zinc-950 text-zinc-100",
  }[tone];

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${toneClass}`}>
      {children}
    </span>
  );
}
