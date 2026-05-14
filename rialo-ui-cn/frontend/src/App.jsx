import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, AlertTriangle, BadgeCheck, ChevronRight, FileKey2, Layers3, LockKeyhole, Network, Plus, RadioTower, RefreshCcw, Search, ShieldCheck, SquareTerminal, WalletCards } from "lucide-react";
import { approveOperation, createTransfer, encryptSecret, getBalance, getRpcStatus, getState, rejectOperation, requestAirdrop } from "./api/rialo.js";

const T = {
  "brand": "Rialo Guard Desk v0.2",
  "badge": "真实 Devnet RPC 查询版",
  "title": "里亚洛团队链上安全执行控制台",
  "subtitle": "已接入 Rialo Devnet RPC，可查询真实 Playground 钱包余额；审批、密钥金库和审计流程继续保留。",
  "search": "搜索操作、地址、状态、风险",
  "refresh": "刷新",
  "newOp": "新建操作",
  "navCommand": "命令中心",
  "navWallet": "真实钱包",
  "navOps": "操作队列",
  "navPolicies": "策略规则",
  "navVault": "密钥金库",
  "upgrade": "v0.2 Devnet RPC 升级",
  "upgradeDesc": "本版本新增真实 Rialo Devnet 钱包余额查询。真实转账广播仍需要后端可控测试钱包私钥。",
  "network": "网络",
  "defaultAddr": "默认查询地址",
  "walletTitle": "真实 Devnet 钱包余额查询",
  "walletDesc": "输入 Rialo Playground 的 Public Key，通过后端 Rialo RPC 查询真实开发网余额。",
  "checkRpc": "检查 RPC",
  "queryBalance": "查询余额",
  "result": "查询结果",
  "status": "状态",
  "connected": "已连接",
  "pending": "待查询",
  "loading": "查询中...",
  "balanceRaw": "余额 Raw",
  "time": "时间",
  "opQueue": "操作队列",
  "opQueueDesc": "所有转账、测试币请求、密钥加密和自动化操作都会先进入队列。",
  "live": "实时",
  "operation": "操作",
  "target": "目标",
  "amount": "金额",
  "risk": "风险",
  "state": "状态",
  "review": "当前审核",
  "noSelected": "暂无选中操作",
  "opType": "操作类型",
  "targetAddr": "目标地址",
  "simOk": "模拟检查通过",
  "simDesc": "未发现明显账户写入冲突。",
  "approvalRequired": "需要人工审批",
  "approvalDesc": "大额转账或陌生收款地址需要团队成员确认。",
  "approve": "批准",
  "reject": "拒绝",
  "working": "处理中...",
  "pipeline": "执行流程",
  "pipelineDesc": "每一笔操作都先经过模拟、策略、签名，再进入广播阶段。",
  "running": "运行中",
  "steps": [
    "创建草稿",
    "模拟检查",
    "策略判断",
    "签名确认",
    "广播执行"
  ],
  "step": "第",
  "policies": "策略规则",
  "policiesDesc": "团队链上操作的安全边界。",
  "vault": "密钥金库",
  "vaultDesc": "用于 AI Agent 和自动化程序的敏感密钥加密。",
  "audit": "审计时间线",
  "auditDesc": "记录创建、审批、拒绝、加密等关键动作。",
  "transferTitle": "创建转账",
  "transferDesc": "提交一笔需要策略检查的转账请求。",
  "recipient": "收款地址",
  "recipientPh": "输入 Rialo 公钥或演示地址",
  "memo": "备注",
  "memoPh": "可选备注",
  "submitTransfer": "提交转账",
  "submitting": "提交中...",
  "airdropTitle": "记录测试币请求",
  "airdropDesc": "真实 faucet 请到 Rialo Playground 领取，这里记录请求流程。",
  "receiver": "接收地址",
  "quantity": "数量",
  "recordAirdrop": "记录测试币请求",
  "recording": "记录中...",
  "encryptTitle": "加密密钥",
  "encryptDesc": "用于保存 Agent Key、API Key 或服务凭证。",
  "secretName": "密钥名称",
  "secretValue": "密钥内容",
  "secretPh": "演示时不要填真实私钥",
  "encrypting": "加密中...",
  "logTitle": "后端响应日志",
  "apiDebug": "API 调试",
  "getState": "获取后端状态 /state",
  "backendDown": "后端未连接，当前显示本地演示数据",
  "rpcStatus": "真实 Rialo RPC 状态",
  "rpcFailed": "RPC 状态查询失败",
  "balanceQuery": "真实 Devnet 余额查询",
  "balanceFailed": "余额查询失败",
  "approveOk": "操作已批准",
  "approveFailed": "批准失败",
  "rejectOk": "操作已拒绝",
  "rejectFailed": "拒绝失败",
  "failed": "失败",
  "realBalanceNote": "真实 Devnet RPC 查询结果",
  "metricMap": {
    "Treasury Balance": "团队金库余额",
    "Pending Reviews": "待审批操作",
    "Policy Pass Rate": "策略通过率",
    "Median Finality": "中位确认时间",
    "Secrets Encrypted": "已加密密钥"
  },
  "noteMap": {
    "Use Devnet Wallet panel": "请使用真实钱包模块查询",
    "1 requires manual approval": "需要人工审批",
    "last 24 hours": "近 24 小时",
    "devnet rpc connected": "开发网 RPC 已连接",
    "No review blockers": "暂无审批阻塞",
    "vault operations tracked": "密钥金库操作已记录"
  },
  "opMap": {
    "Transfer": "转账",
    "Airdrop": "测试币请求",
    "Secret encryption": "密钥加密",
    "Program invoke": "程序调用"
  },
  "riskMap": {
    "Low": "低风险",
    "Medium": "中风险",
    "High": "高风险"
  },
  "statusMap": {
    "Waiting approval": "等待审批",
    "Ready to sign": "等待签名",
    "Encrypted": "已加密",
    "Broadcasted": "已广播",
    "Approved": "已批准",
    "Rejected": "已拒绝",
    "Idle": "空闲"
  },
  "policyName": {
    "Daily transfer ceiling": "每日转账上限",
    "Unknown recipient review": "陌生收款地址审核",
    "Program deploy cooldown": "程序部署冷却",
    "Secret export": "密钥导出限制"
  },
  "policyValue": {
    "Manual approval": "需要人工审批",
    "15 min delay": "延迟 15 分钟",
    "Blocked": "禁止导出"
  },
  "policyStatus": {
    "Active": "已启用",
    "Strict": "严格"
  },
  "timelineTitle": {
    "RPC integration ready": "RPC 集成就绪",
    "Transaction simulated": "交易模拟完成",
    "Policy engine completed": "策略检查完成",
    "MFA request created": "多重验证请求已创建",
    "Transfer request created": "转账请求已创建",
    "Airdrop requested": "测试币请求已记录",
    "Secret encrypted": "密钥已加密",
    "Operation approved": "操作已批准",
    "Operation rejected": "操作已拒绝"
  },
  "timelineBody": {
    "No account write conflict detected.": "未发现账户写入冲突。",
    "2 checks passed, 1 review required.": "2 项检查通过，1 项需要人工审批。"
  }
};
const DEFAULT_PUBKEY = "5TAJ9oAsfZD4XccMFMA5KqkW1PyC89nqS89msHi7CcT";
const navItems = [
  { label: T.navCommand, key: "command", icon: SquareTerminal },
  { label: T.navWallet, key: "wallet", icon: Network },
  { label: T.navOps, key: "operations", icon: Activity },
  { label: T.navPolicies, key: "policies", icon: ShieldCheck },
  { label: T.navVault, key: "vault", icon: FileKey2 },
];
const mockState = { network: { name:"Rialo Devnet", rpc_url:"https://api.devnet.rialo.xyz", rpc_status:"Ready" }, signer:{pubkey:DEFAULT_PUBKEY}, metrics:[{label:"Treasury Balance",value:"Query via RPC",note:"Use Devnet Wallet panel"},{label:"Pending Reviews",value:"2",note:"1 requires manual approval"},{label:"Policy Pass Rate",value:"94.6%",note:"last 24 hours"},{label:"Median Finality",value:"RPC",note:"devnet rpc connected"}], operations:[{id:"op_demo_001",type:"Transfer",target:"5TAJ...7CcT",amount:"1 RIAL",risk:"Medium",state:"Waiting approval",time:"2m ago"},{id:"op_demo_002",type:"Secret encryption",target:"agent-pay-key",amount:"—",risk:"Low",state:"Encrypted",time:"18m ago"}], policies:[{name:"Daily transfer ceiling",value:"≤ 10,000 RIAL",status:"Active"},{name:"Unknown recipient review",value:"Manual approval",status:"Active"},{name:"Program deploy cooldown",value:"15 min delay",status:"Active"},{name:"Secret export",value:"Blocked",status:"Strict"}], timeline:[{title:"RPC integration ready",body:"Connected target: https://api.devnet.rialo.xyz",time:"14:22:08"},{title:"Transaction simulated",body:"No account write conflict detected.",time:"14:22:09"}], vault:{name:"agent-pay-key",preview:"No encrypted secret yet"} };
function jlog(title,data){return `${title}\n\n${JSON.stringify(data,null,2)}`}
function tr(map, v){return map?.[v] || v || "—"}
function note(v){return T.noteMap?.[v] || v || ""}
function tone(s=""){const v=String(s).toLowerCase(); if(v.includes("waiting")||v.includes("review"))return"warn"; if(v.includes("approved")||v.includes("encrypted")||v.includes("broadcast"))return"good"; if(v.includes("reject")||v.includes("block"))return"bad"; return"neutral"}
function StatusPill({children,tone:toneName="neutral"}){const cls={good:"border-emerald-200 bg-emerald-50 status-good",warn:"border-amber-200 bg-amber-50 status-warn",bad:"border-red-200 bg-red-50 status-bad",neutral:"border-slate-200 bg-slate-50 status-neutral",dark:"border-slate-900 bg-slate-950 text-white"}[toneName];return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}>{children}</span>}
function MetricCards({metrics=[]}){return <section className="grid gap-4 md:grid-cols-4">{metrics.map(m=><div key={m.label} className="light-card rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"><div className="text-sm light-muted">{tr(T.metricMap,m.label)}</div><div className="mt-3 text-3xl font-semibold tracking-tight">{m.value||"—"}</div><div className="mt-3 text-sm light-soft">{note(m.note)}</div></div>)}</section>}
function RiskBar({value="Low"}){const w=value==="Low"?"w-1/4":value==="Medium"?"w-2/3":"w-full";const c=value==="Low"?"bg-emerald-500":value==="Medium"?"bg-amber-500":"bg-red-500";return <div className="w-28"><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${w} ${c}`}/></div><div className="mt-1 text-xs light-soft">{tr(T.riskMap,value)}</div></div>}
function DevnetWalletPanel({onLog,onBalanceLoaded}){const[pubkey,setPubkey]=useState(DEFAULT_PUBKEY);const[balance,setBalance]=useState(null);const[status,setStatus]=useState(null);const[loading,setLoading]=useState(false);async function checkRpc(){setLoading(true);try{const data=await getRpcStatus();setStatus(data);onLog?.(jlog(T.rpcStatus,data))}catch(e){onLog?.(jlog(T.rpcFailed,{error:e.message}))}finally{setLoading(false)}}async function queryBalance(){setLoading(true);try{const data=await getBalance(pubkey);setBalance(data);onBalanceLoaded?.(data);onLog?.(jlog(T.balanceQuery,data))}catch(e){setBalance(null);onLog?.(jlog(T.balanceFailed,{error:e.message}))}finally{setLoading(false)}}return <section className="light-card rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"><div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between"><div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700"><WalletCards size={15}/>Rialo Devnet Real Query</div><h2 className="mt-2 text-xl font-semibold tracking-tight">{T.walletTitle}</h2><p className="mt-1 max-w-3xl text-sm leading-6 light-soft">{T.walletDesc}</p></div><div className="flex gap-2"><button onClick={checkRpc} disabled={loading} className="inline-flex h-11 items-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"><Activity size={16} className="mr-2"/>{T.checkRpc}</button><button onClick={queryBalance} disabled={loading} className="dark-button inline-flex h-11 items-center rounded-2xl px-4 text-sm font-semibold disabled:opacity-50"><Search size={16} className="mr-2"/>{T.queryBalance}</button></div></div><div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.55fr]"><label className="block text-sm font-medium light-muted">Rialo Public Key<input value={pubkey} onChange={e=>setPubkey(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 font-mono text-sm outline-none focus:border-cyan-400" placeholder="Rialo Public Key"/></label><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs font-semibold uppercase tracking-[0.16em] light-muted">{T.result}</div><div className="mt-3 grid gap-2 text-sm"><div className="flex items-center justify-between gap-3"><span className="light-soft">RPC</span><span className="max-w-[220px] truncate font-mono text-xs text-cyan-700">{balance?.rpc_url||status?.rpc_url||"—"}</span></div><div className="flex items-center justify-between gap-3"><span className="light-soft">{T.status}</span><span className="font-semibold">{loading?T.loading:balance?.ok||status?.ok?T.connected:T.pending}</span></div><div className="flex items-center justify-between gap-3"><span className="light-soft">{T.balanceRaw}</span><span className="font-mono text-lg font-semibold">{balance?.balance_raw??"—"}</span></div><div className="flex items-center justify-between gap-3"><span className="light-soft">{T.time}</span><span className="font-mono text-xs light-soft">{balance?.checked_at||status?.checked_at||"—"}</span></div></div></div></div></section>}
function OperationTable({operations=[],selectedId,onSelect}){return <div className="light-card rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]"><div className="flex items-center justify-between border-b border-slate-200 p-5"><div><h2 className="text-xl font-semibold tracking-tight">{T.opQueue}</h2><p className="mt-1 text-sm light-soft">{T.opQueueDesc}</p></div><StatusPill tone="dark">{T.live}</StatusPill></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-[0.12em] light-muted"><tr><th className="px-5 py-3 font-medium">{T.operation}</th><th className="px-5 py-3 font-medium">{T.target}</th><th className="px-5 py-3 font-medium">{T.amount}</th><th className="px-5 py-3 font-medium">{T.risk}</th><th className="px-5 py-3 font-medium">{T.state}</th><th className="px-5 py-3 font-medium">{T.time}</th></tr></thead><tbody>{operations.map(op=><tr key={op.id} onClick={()=>onSelect(op)} className={`cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50 ${selectedId===op.id?"bg-cyan-50/60":""}`}><td className="px-5 py-4"><div className="font-semibold">{tr(T.opMap,op.type)}</div><div className="font-mono text-xs light-soft">{op.id}</div></td><td className="px-5 py-4 font-mono light-muted">{op.target}</td><td className="px-5 py-4 light-muted">{op.amount}</td><td className="px-5 py-4"><RiskBar value={op.risk}/></td><td className="px-5 py-4"><StatusPill tone={tone(op.state)}>{tr(T.statusMap,op.state)}</StatusPill></td><td className="px-5 py-4 light-soft">{op.time}</td></tr>)}</tbody></table></div></div>}
function ReviewPanel({operation,onApprove,onReject,actionBusy}){const disabled=!operation||actionBusy;return <div className="light-card rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"><div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-semibold tracking-tight">{T.review}</h2><p className="mt-1 font-mono text-xs light-soft">{operation?.id||T.noSelected}</p></div><StatusPill tone={tone(operation?.state)}>{tr(T.statusMap,operation?.state||"Idle")}</StatusPill></div><div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center justify-between gap-3 text-sm"><span className="light-soft">{T.opType}</span><span className="font-semibold">{tr(T.opMap,operation?.type)}</span></div><div className="mt-3 flex items-center justify-between gap-3 text-sm"><span className="light-soft">{T.amount}</span><span className="font-semibold">{operation?.amount||"—"}</span></div><div className="mt-3 flex items-center justify-between gap-3 text-sm"><span className="light-soft">{T.targetAddr}</span><span className="font-mono text-xs font-medium">{operation?.target||"—"}</span></div></div><div className="mt-5 space-y-3"><div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 status-good"><BadgeCheck size={18}/><div><div className="text-sm font-semibold">{T.simOk}</div><div className="text-xs">{T.simDesc}</div></div></div><div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 status-warn"><AlertTriangle size={18}/><div><div className="text-sm font-semibold">{T.approvalRequired}</div><div className="text-xs">{T.approvalDesc}</div></div></div></div><div className="mt-5 grid grid-cols-2 gap-3"><button disabled={disabled} onClick={()=>onApprove?.(operation)} className="dark-button rounded-2xl px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50">{actionBusy?T.working:T.approve}</button><button disabled={disabled} onClick={()=>onReject?.(operation)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">{T.reject}</button></div></div>}
function ActionPipeline(){const icons=[Layers3,Activity,ShieldCheck,LockKeyhole,RadioTower];return <div className="light-card rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"><div className="flex items-center justify-between"><div><h2 className="text-xl font-semibold tracking-tight">{T.pipeline}</h2><p className="mt-1 text-sm light-soft">{T.pipelineDesc}</p></div><StatusPill tone="dark">{T.running}</StatusPill></div><div className="mt-6 grid gap-3 md:grid-cols-5">{T.steps.map((label,index)=>{const Icon=icons[index];return <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><Icon size={19} className="text-slate-700"/><div className="mt-3 text-sm font-semibold">{label}</div><div className="mt-1 text-xs light-soft">{T.step} {index+1}</div></div>})}</div></div>}
function PolicyPanel({policies=[]}){return <div className="light-card rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"><h2 className="text-xl font-semibold tracking-tight">{T.policies}</h2><p className="mt-1 text-sm light-soft">{T.policiesDesc}</p><div className="mt-4 space-y-3">{policies.map(r=><div key={r.name} className="rounded-2xl border border-slate-200 p-3"><div className="flex items-center justify-between gap-3"><div className="text-sm font-semibold">{tr(T.policyName,r.name)}</div><StatusPill tone={r.status==="Strict"?"bad":"good"}>{tr(T.policyStatus,r.status)}</StatusPill></div><div className="mt-1 text-sm light-soft">{tr(T.policyValue,r.value)}</div></div>)}</div></div>}
function SecretVault({vault}){return <div className="light-card rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"><div className="flex items-center gap-3"><div className="dark-button flex h-10 w-10 items-center justify-center rounded-2xl"><FileKey2 size={18}/></div><div><h2 className="text-xl font-semibold tracking-tight">{T.vault}</h2><p className="text-sm light-soft">{T.vaultDesc}</p></div></div><div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4"><div className="text-sm font-semibold">{vault?.name||"agent-pay-key"}</div><div className="mt-2 break-all font-mono text-xs leading-6 light-soft">{vault?.preview||"No encrypted secret yet"}</div></div></div>}
function AuditTimeline({timeline=[]}){return <div className="light-card rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"><h2 className="text-xl font-semibold tracking-tight">{T.audit}</h2><p className="mt-1 text-sm light-soft">{T.auditDesc}</p><div className="mt-5 space-y-4">{timeline.map((e,index)=><div key={`${e.title}-${index}`} className="flex gap-4"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold">{index+1}</div><div><div className="flex flex-wrap items-center gap-2"><div className="font-semibold">{tr(T.timelineTitle,e.title)}</div><span className="font-mono text-xs light-soft">{e.time}</span></div><p className="mt-1 text-sm light-soft">{tr(T.timelineBody,e.body)}</p></div></div>)}</div></div>}
function ActionForms({busy,setBusy,onLog,onDone}){async function handleSubmit(event,fn,buildPayload,title){event.preventDefault();const formElement=event.currentTarget;const form=new FormData(formElement);const payload=buildPayload(form);setBusy(true);try{const data=await fn(payload);onLog(jlog(title,data));formElement?.reset();await onDone(data)}catch(e){onLog(jlog(`${title} ${T.failed}`,{error:e.message}))}finally{setBusy(false)}}const inputClass="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-cyan-400";return <section className="mt-6 grid gap-5 xl:grid-cols-3"><form onSubmit={e=>handleSubmit(e,createTransfer,f=>({recipient:f.get("recipient"),amount:Number(f.get("amount")),memo:f.get("memo")||null}),T.submitTransfer)} className="light-card rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"><h2 className="text-xl font-semibold tracking-tight">{T.transferTitle}</h2><p className="mt-1 text-sm light-soft">{T.transferDesc}</p><label className="mt-4 block text-sm font-medium light-muted">{T.recipient}<input name="recipient" required className={inputClass} placeholder={T.recipientPh}/></label><label className="mt-3 block text-sm font-medium light-muted">{T.amount}<input name="amount" required type="number" min="1" className={inputClass}/></label><label className="mt-3 block text-sm font-medium light-muted">{T.memo}<input name="memo" className={inputClass} placeholder={T.memoPh}/></label><button disabled={busy} className="dark-button mt-4 w-full rounded-2xl px-4 py-3 text-sm font-semibold disabled:opacity-60">{busy?T.submitting:T.submitTransfer}</button></form><form onSubmit={e=>handleSubmit(e,requestAirdrop,f=>({recipient:f.get("recipient"),amount:Number(f.get("amount"))}),T.recordAirdrop)} className="light-card rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"><h2 className="text-xl font-semibold tracking-tight">{T.airdropTitle}</h2><p className="mt-1 text-sm light-soft">{T.airdropDesc}</p><label className="mt-4 block text-sm font-medium light-muted">{T.receiver}<input name="recipient" required className={inputClass} placeholder={T.receiver}/></label><label className="mt-3 block text-sm font-medium light-muted">{T.quantity}<input name="amount" required type="number" min="1" className={inputClass}/></label><button disabled={busy} className="dark-button mt-4 w-full rounded-2xl px-4 py-3 text-sm font-semibold disabled:opacity-60">{busy?T.recording:T.recordAirdrop}</button></form><form onSubmit={e=>handleSubmit(e,encryptSecret,f=>({name:f.get("name"),secret:f.get("secret")}),T.encryptTitle)} className="light-card rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"><h2 className="text-xl font-semibold tracking-tight">{T.encryptTitle}</h2><p className="mt-1 text-sm light-soft">{T.encryptDesc}</p><label className="mt-4 block text-sm font-medium light-muted">{T.secretName}<input name="name" required className={inputClass} placeholder="agent-pay-key"/></label><label className="mt-3 block text-sm font-medium light-muted">{T.secretValue}<textarea name="secret" required rows={4} className={inputClass} placeholder={T.secretPh}/></label><button disabled={busy} className="dark-button mt-4 w-full rounded-2xl px-4 py-3 text-sm font-semibold disabled:opacity-60">{busy?T.encrypting:T.encryptTitle}</button></form></section>}

export default function App(){const[dashboard,setDashboard]=useState(mockState);const[selected,setSelected]=useState(mockState.operations?.[0]||null);const[loading,setLoading]=useState(false);const[busy,setBusy]=useState(false);const[reviewBusy,setReviewBusy]=useState(false);const[log,setLog]=useState("Waiting for backend response…");const[active,setActive]=useState("operations");const[query,setQuery]=useState("");const commandRef=useRef(null),walletRef=useRef(null),operationsRef=useRef(null),policiesRef=useRef(null),vaultRef=useRef(null),actionsRef=useRef(null);const refs={command:commandRef,wallet:walletRef,operations:operationsRef,policies:policiesRef,vault:vaultRef};function scrollTo(key){setActive(key);refs[key]?.current?.scrollIntoView({behavior:"smooth",block:"start"})}async function loadState(){setLoading(true);try{const data=await getState();setDashboard(data);setSelected(cur=>cur?data.operations?.find(op=>op.id===cur.id)||data.operations?.[0]||null:data.operations?.[0]||null);setLog(jlog(T.getState,data));return data}catch(e){setLog(jlog(T.backendDown,{error:e.message,hint:"http://127.0.0.1:8080"}));setDashboard(mockState);setSelected(mockState.operations?.[0]||null);return null}finally{setLoading(false)}}async function handleOperationCreated(response){const fresh=await loadState();const created=response?.operation||response?.data?.operation||null;setSelected(created||fresh?.operations?.[0]||null);setActive("operations");setTimeout(()=>operationsRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),120)}async function handleApprove(operation){if(!operation?.id)return;setReviewBusy(true);try{const data=await approveOperation(operation.id);setLog(jlog(T.approveOk,data));await loadState()}catch(e){setLog(jlog(T.approveFailed,{error:e.message}))}finally{setReviewBusy(false)}}async function handleReject(operation){if(!operation?.id)return;setReviewBusy(true);try{const data=await rejectOperation(operation.id);setLog(jlog(T.rejectOk,data));await loadState()}catch(e){setLog(jlog(T.rejectFailed,{error:e.message}))}finally{setReviewBusy(false)}}useEffect(()=>{loadState()},[]);const filteredOperations=useMemo(()=>{const ops=dashboard?.operations||[];const q=query.trim().toLowerCase();if(!q)return ops;return ops.filter(op=>[op.id,op.type,tr(T.opMap,op.type),op.target,op.amount,op.risk,tr(T.riskMap,op.risk),op.state,tr(T.statusMap,op.state),op.time].filter(Boolean).join(" ").toLowerCase().includes(q))},[dashboard,query]);return <div className="min-h-screen bg-[#060708] text-white"><header className="sticky top-0 z-40 border-b border-white/10 bg-[#060708]/95 backdrop-blur-xl"><div className="mx-auto max-w-[1680px] px-6 py-4"><div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between"><div className="header-text"><div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400"><span>{T.brand}</span><ChevronRight size={14} className="text-cyan-300"/><span>{T.badge}</span></div><h1 className="mt-2 text-3xl font-semibold leading-tight tracking-[-0.045em] text-white md:text-5xl">{T.title}</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{T.subtitle}</p></div><div className="flex flex-wrap items-center gap-2"><div className="flex h-11 min-w-[310px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 max-md:min-w-0 max-md:flex-1"><Search size={17} className="text-cyan-300"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={T.search} className="w-full border-0 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"/></div><button onClick={loadState} className="inline-flex h-11 items-center rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm font-medium text-white hover:bg-white/[0.1]"><RefreshCcw size={16} className={`mr-2 ${loading?"animate-spin":""}`}/>{T.refresh}</button><button onClick={()=>actionsRef.current?.scrollIntoView({behavior:"smooth",block:"start"})} className="inline-flex h-11 items-center rounded-2xl bg-white px-4 text-sm font-semibold text-slate-950 hover:bg-cyan-100"><Plus size={16} className="mr-2"/>{T.newOp}</button></div></div><nav className="mt-4 flex flex-wrap items-center gap-2">{navItems.map(item=>{const Icon=item.icon;const isActive=active===item.key;return <button key={item.key} onClick={()=>scrollTo(item.key)} className={`inline-flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-medium transition ${isActive?"border-cyan-300/40 bg-cyan-300/15 text-cyan-100":"border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white"}`}><Icon size={14}/>{item.label}</button>})}<div className="ml-auto hidden items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs text-cyan-100 lg:flex"><span className="h-2 w-2 rounded-full bg-emerald-300"/>{dashboard?.network?.rpc_status||"Ready"}</div></nav></div></header><main className="mx-auto max-w-[1680px] px-6 py-6"><section ref={commandRef} className="scroll-mt-36"><div className="mb-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_90px_rgba(0,0,0,.35)]"><div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"><div className="header-text"><div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">{T.upgrade}</div><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{T.upgradeDesc}</p></div><div className="grid gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 text-sm"><div className="flex items-center justify-between gap-3"><span className="text-slate-400">{T.network}</span><span className="font-medium text-white">{dashboard?.network?.name||"Rialo Devnet"}</span></div><div className="flex items-center justify-between gap-3"><span className="text-slate-400">RPC</span><span className="max-w-[360px] truncate font-mono text-xs text-cyan-200">{dashboard?.network?.rpc_url||"https://api.devnet.rialo.xyz"}</span></div><div className="flex items-center justify-between gap-3"><span className="text-slate-400">{T.defaultAddr}</span><span className="max-w-[360px] truncate font-mono text-xs text-slate-200">{dashboard?.signer?.pubkey||"—"}</span></div></div></div></div><MetricCards metrics={dashboard?.metrics||[]}/></section><div ref={walletRef} className="mt-6 scroll-mt-36"><DevnetWalletPanel onLog={setLog} onBalanceLoaded={(b)=>setDashboard(cur=>({...cur,metrics:(cur?.metrics||[]).map(m=>m.label==="Treasury Balance"?{...m,value:`${b.balance_raw} RIALO`,note:T.realBalanceNote}:m)}))}/></div><section ref={operationsRef} className="mt-6 grid scroll-mt-36 gap-6 xl:grid-cols-[1.45fr_0.75fr]"><OperationTable operations={filteredOperations} selectedId={selected?.id} onSelect={setSelected}/><ReviewPanel operation={selected} onApprove={handleApprove} onReject={handleReject} actionBusy={reviewBusy}/></section><section ref={policiesRef} className="mt-6 grid scroll-mt-36 gap-6 xl:grid-cols-3"><div className="xl:col-span-2"><ActionPipeline/></div><PolicyPanel policies={dashboard?.policies||[]}/></section><section ref={vaultRef} className="mt-6 grid scroll-mt-36 gap-6 xl:grid-cols-[0.78fr_1.22fr]"><SecretVault vault={dashboard?.vault}/><AuditTimeline timeline={dashboard?.timeline||[]}/></section><div ref={actionsRef} className="scroll-mt-36"><ActionForms busy={busy} setBusy={setBusy} onLog={setLog} onDone={handleOperationCreated}/></div><section className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_90px_rgba(0,0,0,.35)]"><div className="flex items-center justify-between gap-3"><h2 className="api-log-title text-lg font-semibold tracking-tight">{T.logTitle}</h2><span className="api-log-badge rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs">{T.apiDebug}</span></div><pre className="api-log-pre mt-4 max-h-[360px] overflow-auto rounded-2xl border border-white/10 bg-black p-4 text-xs leading-6">{log}</pre></section></main></div>}
