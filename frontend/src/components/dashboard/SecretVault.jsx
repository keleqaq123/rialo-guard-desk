import { Clock3, FileKey2 } from "lucide-react";

export default function SecretVault({ vault }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white">
          <FileKey2 size={18} />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Secret Vault</h2>
          <p className="text-sm text-zinc-500">TEE-ready encrypted secrets</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4">
        <div className="text-sm font-medium">{vault?.name || "agent-pay-key"}</div>
        <div className="mt-2 break-all font-mono text-xs leading-6 text-zinc-500">
          {vault?.preview || "No encrypted secret yet"}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
          <Clock3 size={14} />
          updated from backend state
        </div>
      </div>
    </div>
  );
}
