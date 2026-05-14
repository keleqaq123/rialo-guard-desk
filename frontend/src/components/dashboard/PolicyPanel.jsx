import StatusPill from "../shared/StatusPill.jsx";

export default function PolicyPanel({ policies = [] }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold tracking-tight">Policy set</h2>
      <div className="mt-4 space-y-3">
        {policies.map((rule) => (
          <div key={rule.name} className="rounded-xl border border-zinc-200 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium">{rule.name}</div>
              <StatusPill tone={rule.status === "Strict" ? "bad" : "good"}>
                {rule.status}
              </StatusPill>
            </div>
            <div className="mt-1 text-sm text-zinc-500">{rule.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
