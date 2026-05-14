import RiskBar from "../shared/RiskBar.jsx";
import StatusPill from "../shared/StatusPill.jsx";
import { statusTone } from "../../lib/utils.js";

export default function OperationTable({ operations = [], selectedId, onSelect }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-200 p-5">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Operation queue</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Review, sign, and broadcast Rialo transactions with policy checks.
          </p>
        </div>
        <StatusPill tone="dark">Live</StatusPill>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-[0.12em] text-zinc-500">
            <tr>
              <th className="px-5 py-3 font-medium">Operation</th>
              <th className="px-5 py-3 font-medium">Target</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Risk</th>
              <th className="px-5 py-3 font-medium">State</th>
              <th className="px-5 py-3 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {operations.map((op) => (
              <tr
                key={op.id}
                onClick={() => onSelect(op)}
                className={`cursor-pointer border-b border-zinc-100 last:border-0 hover:bg-zinc-50/70 ${
                  selectedId === op.id ? "bg-zinc-50" : ""
                }`}
              >
                <td className="px-5 py-4">
                  <div className="font-medium text-zinc-950">{op.type}</div>
                  <div className="font-mono text-xs text-zinc-500">{op.id}</div>
                </td>
                <td className="px-5 py-4 font-mono text-zinc-600">{op.target}</td>
                <td className="px-5 py-4 text-zinc-700">{op.amount}</td>
                <td className="px-5 py-4"><RiskBar value={op.risk} /></td>
                <td className="px-5 py-4">
                  <StatusPill tone={statusTone(op.state)}>{op.state}</StatusPill>
                </td>
                <td className="px-5 py-4 text-zinc-500">{op.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
