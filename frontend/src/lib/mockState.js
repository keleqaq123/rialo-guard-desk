export const mockState = {
  network: {
    name: "Rialo Devnet",
    rpc_url: "https://api.devnet.rialo.xyz",
  },
  signer: {
    pubkey: "9h1HyLCW5dZnBVap8C5egQ9Z6pHyjsh5MNy83iPqqRuq",
  },
  metrics: [
    { label: "Treasury Balance", value: "84,210.44 RIAL", note: "+2.8% this week" },
    { label: "Pending Reviews", value: "2", note: "1 requires manual approval" },
    { label: "Policy Pass Rate", value: "94.6%", note: "last 24 hours" },
    { label: "Median Finality", value: "1.8s", note: "devnet rpc" },
  ],
  operations: [
    {
      id: "op_demo_001",
      type: "Transfer",
      target: "7Vkw...31hP",
      amount: "2,400 RIAL",
      risk: "Medium",
      state: "Waiting approval",
      time: "2m ago",
    },
    {
      id: "op_demo_002",
      type: "Program invoke",
      target: "policy_guard_v2",
      amount: "0.08 RIAL",
      risk: "Low",
      state: "Ready to sign",
      time: "9m ago",
    },
    {
      id: "op_demo_003",
      type: "Secret encryption",
      target: "agent-pay-key",
      amount: "—",
      risk: "Low",
      state: "Encrypted",
      time: "18m ago",
    },
  ],
  policies: [
    { name: "Daily transfer ceiling", value: "≤ 10,000 RIAL", status: "Active" },
    { name: "Unknown recipient review", value: "Manual approval", status: "Active" },
    { name: "Program deploy cooldown", value: "15 min delay", status: "Active" },
    { name: "Secret export", value: "Blocked", status: "Strict" },
  ],
  timeline: [
    { title: "Transaction simulated", body: "No account write conflict detected.", time: "14:22:08" },
    { title: "Policy engine completed", body: "2 checks passed, 1 review required.", time: "14:22:09" },
    { title: "MFA request created", body: "Waiting for signer group Treasury-2.", time: "14:22:13" },
  ],
  vault: {
    name: "agent-pay-key",
    preview: "No encrypted secret yet",
  },
};
