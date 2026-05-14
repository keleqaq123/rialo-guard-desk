import { AlertTriangle, BadgeCheck } from "lucide-react";
import StatusPill from "../shared/StatusPill.jsx";
import { statusTone } from "../../lib/utils.js";

export default function ReviewPanel({ operation, onApprove, onReject, actionBusy }) {
  const disabled = !operation || actionBusy;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-950 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">Selected review</h2>
          <p className="mt-1 font-mono text-xs text-slate-500">
            {operation?.id || "No operation selected"}
          </p>
        </div>
        <StatusPill tone={statusTone(operation?.state)}>{operation?.state || "Idle"}</StatusPill>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-slate-500">Instruction</span>
          <span className="font-semibold text-slate-950">{operation?.type || "—"}</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-sm">
          <span className="text-slate-500">Amount</span>
          <span className="font-semibold text-slate-950">{operation?.amount || "—"}</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-sm">
          <span className="text-slate-500">Target</span>
          <span className="font-mono text-xs font-medium text-slate-800">{operation?.target || "—"}</span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <BadgeCheck size={18} className="text-emerald-700" />
          <div>
            <div className="text-sm font-semibold text-emerald-950">Simulation passed</div>
            <div className="text-xs text-emerald-700">No malformed account write.</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle size={18} className="text-amber-700" />
          <div>
            <div className="text-sm font-semibold text-amber-950">Manual approval required</div>
            <div className="text-xs text-amber-700">
              New recipients and large transfers require team review.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          disabled={disabled}
          onClick={() => onApprove?.(operation)}
          className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {actionBusy ? "Working..." : "Approve"}
        </button>
        <button
          disabled={disabled}
          onClick={() => onReject?.(operation)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
