import { createTransfer, encryptSecret, requestAirdrop } from "../../api/rialo.js";
import { jsonLog } from "../../lib/utils.js";

export default function ActionForms({ busy, setBusy, onLog, onDone }) {
  async function handleSubmit(event, fn, buildPayload, title) {
    event.preventDefault();

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = buildPayload(form);

    setBusy(true);

    try {
      const data = await fn(payload);
      onLog(jsonLog(title, data));

      if (formElement) {
        formElement.reset();
      }

      await onDone(data);
    } catch (error) {
      onLog(jsonLog(`${title}失败`, { error: error.message }));
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-cyan-400";

  return (
    <section className="mt-6 grid gap-5 xl:grid-cols-3">
      <form
        onSubmit={(event) =>
          handleSubmit(
            event,
            createTransfer,
            (form) => ({
              recipient: form.get("recipient"),
              amount: Number(form.get("amount")),
              memo: form.get("memo") || null,
            }),
            "转账请求已提交",
          )
        }
        className="rounded-3xl border border-slate-200 bg-white p-5 text-slate-950 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
      >
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">创建转账</h2>
        <p className="mt-1 text-sm text-slate-500">提交一笔需要策略检查的转账请求。</p>

        <label className="mt-4 block text-sm font-medium text-slate-600">
          收款地址
          <input name="recipient" required className={inputClass} placeholder="输入 Rialo 公钥或演示地址" />
        </label>

        <label className="mt-3 block text-sm font-medium text-slate-600">
          金额
          <input name="amount" required type="number" min="1" className={inputClass} />
        </label>

        <label className="mt-3 block text-sm font-medium text-slate-600">
          备注
          <input name="memo" className={inputClass} placeholder="可选备注" />
        </label>

        <button
          disabled={busy}
          className="mt-4 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {busy ? "提交中..." : "提交转账"}
        </button>
      </form>

      <form
        onSubmit={(event) =>
          handleSubmit(
            event,
            requestAirdrop,
            (form) => ({
              recipient: form.get("recipient"),
              amount: Number(form.get("amount")),
            }),
            "测试币请求已记录",
          )
        }
        className="rounded-3xl border border-slate-200 bg-white p-5 text-slate-950 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
      >
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">记录测试币请求</h2>
        <p className="mt-1 text-sm text-slate-500">真实 faucet 请到 Rialo Playground 领取，这里记录请求流程。</p>

        <label className="mt-4 block text-sm font-medium text-slate-600">
          接收地址
          <input name="recipient" required className={inputClass} placeholder="输入接收地址" />
        </label>

        <label className="mt-3 block text-sm font-medium text-slate-600">
          数量
          <input name="amount" required type="number" min="1" className={inputClass} />
        </label>

        <button
          disabled={busy}
          className="mt-4 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {busy ? "记录中..." : "记录测试币请求"}
        </button>
      </form>

      <form
        onSubmit={(event) =>
          handleSubmit(
            event,
            encryptSecret,
            (form) => ({
              name: form.get("name"),
              secret: form.get("secret"),
            }),
            "密钥已加密",
          )
        }
        className="rounded-3xl border border-slate-200 bg-white p-5 text-slate-950 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
      >
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">加密密钥</h2>
        <p className="mt-1 text-sm text-slate-500">用于保存 Agent Key、API Key 或服务凭证。</p>

        <label className="mt-4 block text-sm font-medium text-slate-600">
          密钥名称
          <input name="name" required className={inputClass} placeholder="agent-pay-key" />
        </label>

        <label className="mt-3 block text-sm font-medium text-slate-600">
          密钥内容
          <textarea
            name="secret"
            required
            rows={4}
            className={inputClass}
            placeholder="演示时不要填真实私钥"
          />
        </label>

        <button
          disabled={busy}
          className="mt-4 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {busy ? "加密中..." : "加密密钥"}
        </button>
      </form>
    </section>
  );
}
