export default function RiskBar({ value = "Low" }) {
  const width = value === "Low" ? "w-1/4" : value === "Medium" ? "w-2/3" : "w-full";
  const color = value === "Low" ? "bg-emerald-500" : value === "Medium" ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="w-28">
      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
        <div className={`h-full rounded-full ${width} ${color}`} />
      </div>
      <div className="mt-1 text-xs text-zinc-500">{value}</div>
    </div>
  );
}
