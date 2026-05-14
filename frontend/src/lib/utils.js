export function statusTone(state = "") {
  const value = String(state).toLowerCase();

  if (
    value.includes("waiting") ||
    value.includes("review") ||
    value.includes("待审批") ||
    value.includes("等待")
  ) {
    return "warn";
  }

  if (
    value.includes("encrypted") ||
    value.includes("broadcast") ||
    value.includes("approved") ||
    value.includes("已批准") ||
    value.includes("已加密") ||
    value.includes("已广播")
  ) {
    return "good";
  }

  if (
    value.includes("reject") ||
    value.includes("block") ||
    value.includes("已拒绝")
  ) {
    return "bad";
  }

  return "neutral";
}

export function jsonLog(title, data) {
  return `${title}\n\n${JSON.stringify(data, null, 2)}`;
}

export function zhRisk(risk = "") {
  const map = {
    Low: "低风险",
    Medium: "中风险",
    High: "高风险",
  };

  return map[risk] || risk || "未知风险";
}

export function zhStatus(state = "") {
  const map = {
    "Waiting approval": "等待审批",
    "Ready to sign": "等待签名",
    Encrypted: "已加密",
    Broadcasted: "已广播",
    Approved: "已批准",
    Rejected: "已拒绝",
    Idle: "空闲",
  };

  return map[state] || state || "未知状态";
}

export function zhOperationType(type = "") {
  const map = {
    Transfer: "转账",
    Airdrop: "测试币请求",
    "Secret encryption": "密钥加密",
    "Program invoke": "程序调用",
  };

  return map[type] || type || "未知操作";
}

export function zhMetricLabel(label = "") {
  const map = {
    "Treasury Balance": "团队金库余额",
    "Pending Reviews": "待审批操作",
    "Policy Pass Rate": "策略通过率",
    "Median Finality": "中位确认时间",
    "Secrets Encrypted": "已加密密钥",
  };

  return map[label] || label;
}

export function zhMetricNote(note = "") {
  const text = String(note);

  if (text.includes("this week")) return "本周变化";
  if (text.includes("requires manual approval")) return "需要人工审批";
  if (text.includes("last 24 hours")) return "近 24 小时";
  if (text.includes("devnet rpc")) return "开发网 RPC";
  if (text.includes("review blockers")) return "暂无审批阻塞";
  if (text.includes("waiting for signer")) {
    return text.replace("waiting for signer", "个等待签名人处理");
  }
  if (text.includes("vault operations tracked")) return "密钥金库操作已记录";

  return text;
}

export function zhPolicyName(name = "") {
  const map = {
    "Daily transfer ceiling": "每日转账上限",
    "Unknown recipient review": "陌生收款地址审核",
    "Program deploy cooldown": "程序部署冷却",
    "Secret export": "密钥导出限制",
  };

  return map[name] || name;
}

export function zhPolicyValue(value = "") {
  const map = {
    "≤ 10,000 RIAL": "≤ 10,000 RIAL",
    "Manual approval": "需要人工审批",
    "15 min delay": "延迟 15 分钟",
    Blocked: "禁止导出",
  };

  return map[value] || value;
}

export function zhPolicyStatus(status = "") {
  const map = {
    Active: "已启用",
    Strict: "严格",
  };

  return map[status] || status;
}

export function zhTimelineTitle(title = "") {
  const map = {
    "Transaction simulated": "交易模拟完成",
    "Policy engine completed": "策略检查完成",
    "MFA request created": "多重验证请求已创建",
    "Transfer request created": "转账请求已创建",
    "Airdrop requested": "测试币请求已创建",
    "Secret encrypted": "密钥已加密",
    "Operation approved": "操作已批准",
    "Operation rejected": "操作已拒绝",
  };

  return map[title] || title;
}

export function zhTimelineBody(body = "") {
  return String(body)
    .replace("No account write conflict detected.", "未发现账户写入冲突。")
    .replace("2 checks passed, 1 review required.", "2 项检查通过，1 项需要人工审批。")
    .replace("Waiting for signer group Treasury-2.", "等待 Treasury-2 签名组处理。")
    .replace("Stored encrypted preview for", "已保存加密预览：")
    .replace("RIAL to", "RIAL 转至")
    .replace("was approved", "已批准")
    .replace("was rejected", "已拒绝");
}