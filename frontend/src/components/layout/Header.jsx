import { Boxes, Plus, RefreshCcw, Search } from "lucide-react";

export default function Header({ onRefresh, loading }) {
  return (
    <header className="border-b border-zinc-200 bg-[#fbfaf7]/90 px-5 py-4 backdrop-blur md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
            <Boxes size={14} />
            Team Treasury Workspace
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
            Guarded operations for Rialo teams
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 md:flex">
            <Search size={16} className="text-zinc-400" />
            <span className="text-sm text-zinc-400">Search operation, address, program</span>
          </div>
          <button
            onClick={onRefresh}
            className="inline-flex h-10 items-center rounded-xl border border-zinc-200 bg-white px-4 text-sm hover:bg-zinc-50"
          >
            <RefreshCcw size={16} className={`mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button className="inline-flex h-10 items-center rounded-xl bg-zinc-950 px-4 text-sm text-white hover:bg-zinc-800">
            <Plus size={16} className="mr-2" />
            New operation
          </button>
        </div>
      </div>
    </header>
  );
}
