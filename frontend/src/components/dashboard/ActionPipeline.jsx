import { Activity, Layers3, LockKeyhole, RadioTower, ShieldCheck } from "lucide-react";
import StatusPill from "../shared/StatusPill.jsx";

const steps = [
  ["Draft", Layers3],
  ["Simulate", Activity],
  ["Policy", ShieldCheck],
  ["Sign", LockKeyhole],
  ["Broadcast", RadioTower],
];

export default function ActionPipeline() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm xl:col-span-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Execution pipeline</h2>
          <p className="mt-1 text-sm text-zinc-500">
            A visible state machine makes the product feel real and reliable.
          </p>
        </div>
        <StatusPill tone="dark">Live run</StatusPill>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-5">
        {steps.map(([label, Icon], index) => (
          <div key={label} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <Icon size={19} className="text-zinc-700" />
            <div className="mt-3 text-sm font-semibold">{label}</div>
            <div className="mt-1 text-xs text-zinc-500">Step {index + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
