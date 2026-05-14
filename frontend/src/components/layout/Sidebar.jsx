import {
  Activity,
  FileKey2,
  KeyRound,
  Layers3,
  Network,
  RadioTower,
  ShieldCheck,
  SquareTerminal,
} from "lucide-react";

const navItems = [
  { label: "Command", icon: SquareTerminal },
  { label: "Operations", icon: Activity },
  { label: "Policies", icon: ShieldCheck },
  { label: "Programs", icon: Layers3 },
  { label: "Secret Vault", icon: FileKey2 },
  { label: "Network", icon: RadioTower },
];

export default function Sidebar({ network, signer }) {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-zinc-200 bg-[#fbfaf7] px-4 py-5 lg:block">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-sm font-semibold text-white">
          RG
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight">Rialo Guard Desk</div>
          <div className="text-xs text-zinc-500">Policy execution console</div>
        </div>
      </div>

      <nav className="mt-8 space-y-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = index === 1;
          return (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-zinc-950 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
              }`}
            >
              <Icon size={17} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
          <Network size={14} />
          Connected Network
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">{network?.name || "Rialo Devnet"}</div>
            <div className="max-w-[180px] truncate font-mono text-xs text-zinc-500">
              {network?.rpc_url || "http://127.0.0.1:8080"}
            </div>
          </div>
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-white">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Signer</div>
        <div className="mt-2 max-w-[190px] truncate font-mono text-sm">
          {signer?.pubkey || "Not connected"}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-300">
          <KeyRound size={13} />
          Local service keyring
        </div>
      </div>
    </aside>
  );
}
