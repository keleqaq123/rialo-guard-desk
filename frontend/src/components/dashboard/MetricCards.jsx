import { zhMetricLabel, zhMetricNote } from "../../lib/utils.js";

export default function MetricCards({ metrics = [] }) {
  return (
    <section className="grid gap-4 md:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="metric-card rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
        >
          <div className="text-sm text-slate-600">{zhMetricLabel(metric.label)}</div>

          <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {metric.value || "—"}
          </div>

          <div className="mt-3 text-sm text-slate-500">{zhMetricNote(metric.note)}</div>
        </div>
      ))}
    </section>
  );
}