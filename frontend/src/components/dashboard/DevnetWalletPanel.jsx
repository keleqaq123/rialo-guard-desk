import { useState } from "react";
import { Activity, Search, WalletCards } from "lucide-react";
import { getBalance, getRpcStatus } from "../../api/rialo.js";

const DEFAULT_PUBKEY = "5TAJ9oAsfZD4XccMFMA5KqkW1PyC89nqS89msHi7CcT";

export default function DevnetWalletPanel({ onLog }) {
  const [pubkey, setPubkey] = useState(DEFAULT_PUBKEY);
  const [balance, setBalance] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function checkRpc() {
    setLoading(true);
    try {
      const data = await getRpcStatus();
      setStatus(data);
      onLog?.(`真实 Rialo RPC 状态\n\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      onLog?.(`RPC 状态查询失败\n\n${JSON.stringify({ error: error.message }, null, 2)}`);
    } finally {
      setLoading(false);
    }
  }

  async function queryBalance() {
    setLoading(true);
    try {
      const data = await getBalance(pubkey);
      setBalance(data);
      onLog?.(`真实 Devnet 余额查询\n\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setBalance(null);
      onLog?.(`余额查询失败\n\n${JSON.stringify({ error: error.message }, null, 2)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 text-slate-950 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
            <WalletCards size={15} />
            Rialo Devnet Real Query
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
            真实 Devnet 钱包余额查询
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
            输入 Rialo Playground 的 Public Key，通过后端 Rialo RPC 查询真实开发网余额。这个模块让你的 Demo 从本地流程升级为真实 Devnet 查询。
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={checkRpc}
            disabled={loading}
            className="inline-flex h-11 items-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 hover:bg-slate-50 disabled:opacity-50"
          >
            <Activity size={16} className="mr-2" />
            检查 RPC
          </button>
          <button
            onClick={queryBalance}
            disabled={loading}
            className="inline-flex h-11 items-center rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            <Search size={16} className="mr-2" />
            查询余额
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.55fr]">
        <label className="block text-sm font-medium text-slate-600">
          Rialo Public Key
          <input
            value={pubkey}
            onChange={(event) => setPubkey(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 font-mono text-sm text-slate-950 outline-none focus:border-cyan-400"
            placeholder="输入 Rialo Playground Public Key"
          />
        </label>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            查询结果
          </div>

          <div className="mt-3 grid gap-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">RPC</span>
              <span className="max-w-[220px] truncate font-mono text-xs text-cyan-700">
                {balance?.rpc_url || status?.rpc_url || "未查询"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">状态</span>
              <span className="font-semibold text-slate-950">
                {loading ? "查询中..." : balance?.ok || status?.ok ? "已连接" : "待查询"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">余额 Raw</span>
              <span className="font-mono text-lg font-semibold text-slate-950">
                {balance?.balance_raw ?? "—"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">时间</span>
              <span className="font-mono text-xs text-slate-600">
                {balance?.checked_at || status?.checked_at || "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
