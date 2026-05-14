# Rialo Guard Desk

**Rialo Guard Desk** is a full-stack demo I built for the Rialo ecosystem. It is designed as a **policy execution console** for team treasuries, AI-agent operations, and automated on-chain workflows.

Instead of building a simple wallet page, I wanted to explore a more practical problem:

> How can teams review, control, approve, reject, encrypt, and audit operations before they are executed on-chain?

Rialo Guard Desk is my answer to that question.

---

## Overview

Rialo Guard Desk is not a normal wallet dashboard. It is a guarded execution layer for teams and agents.

The core idea is simple:

> Review first.  
> Apply policy before signing.  
> Protect secrets before use.  
> Make every operation traceable.

The current version includes a React frontend and a Rust backend. It supports operation review, transfer request creation, approval/rejection flow, policy display, Secret Vault, audit timeline, backend response logs, and a Rialo Devnet RPC query module.

---

## Why I Built This

As more on-chain actions become automated, teams and AI agents need more than a basic wallet interface.

A normal wallet answers:

> How do I sign this transaction?

Rialo Guard Desk focuses on a different question:

> Should this operation be allowed to execute in the first place?

I built this demo to explore how Rialo can be used for:

- team treasury safety
- AI-agent payment control
- automated workflow review
- policy-based execution
- secret management
- operation auditing

The goal is to make on-chain operations safer before they reach the execution stage.

---

## Product Concept

Rialo Guard Desk is a team treasury and policy console for:

- reviewing transfers before execution
- surfacing policy and risk alerts
- approving or rejecting operations
- keeping a clear audit trail
- recording devnet airdrop requests
- encrypting secrets for AI-agent or TEE-style workflows
- querying a Rialo Devnet public key through the RPC module

It is designed for teams that want more control over sensitive on-chain operations.

---

## Current Features

### Operation Queue

All operations first enter the operation queue.

Supported operation types include:

- transfer requests
- devnet airdrop request records
- secret encryption
- program invocation records
- automation-style operation records

Each operation shows:

- operation type
- target address
- amount
- risk level
- current status
- created time
- operation ID

---

### Review Panel

When an operation is selected, the review panel shows its details.

The panel includes:

- instruction type
- target address
- amount
- risk information
- simulation result
- manual review prompt
- approve button
- reject button

The approval and rejection buttons are connected to backend APIs.

---

### Approval / Rejection Flow

The demo supports real backend state updates for approval and rejection.

When an operation is approved:

- the operation status changes to `Approved`
- the pending review count updates
- the audit timeline records the approval
- the backend response log shows the API result

When an operation is rejected:

- the operation status changes to `Rejected`
- the audit timeline records the rejection
- the backend response log shows the API result

---

### Policy Rules

The policy panel displays team-level execution rules.

Current demo rules include:

- daily transfer ceiling
- unknown recipient review
- program deployment cooldown
- secret export restriction

These rules are currently displayed as demo policies, but the long-term goal is to make them editable and enforceable.

---

### Execution Pipeline

The execution pipeline shows the expected lifecycle of a guarded operation:

1. Draft
2. Simulate
3. Policy Check
4. Sign
5. Broadcast



### Secret Vault

The Secret Vault module is designed for sensitive credentials such as:

- agent keys
- API keys
- webhook secrets
- service tokens
- automation credentials

The current version supports secret encryption requests. When a secret is submitted:

- the backend creates an encrypted preview
- the Secret Vault updates
- a new operation is added to the queue
- the audit timeline records the action

If a real secret-sharing public key is not configured, the backend falls back to a demo encryption preview.

---

### Audit Timeline

The audit timeline records key actions, including:

- transfer request creation
- policy review
- approval
- rejection
- airdrop request record
- secret encryption
- RPC query activity


### Rialo Devnet RPC Query

The current version includes a Rialo Devnet RPC query module.

It can:

- check the configured Rialo RPC endpoint
- query a Rialo Playground public key
- display the raw devnet balance result
- write the response to the backend log panel

The default RPC endpoint used in the demo is:

```txt
https://api.devnet.rialo.xyz
```

The default public key used in my demo is a Rialo Playground devnet wallet address:

```txt
5TAJ9oAsfZD4XccMFMA5KqkW1PyC89nqS89msHi7CcT
```

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Lucide Icons

### Backend

- Rust
- Axum
- Tokio
- Serde
- Rialo CDK
- Rialo Devnet RPC

---

## Project Structure

```txt
rialo-guard-desk/
├─ frontend/
│  ├─ src/
│  │  ├─ api/
│  │  │  └─ rialo.js
│  │  ├─ components/
│  │  │  ├─ dashboard/
│  │  │  ├─ forms/
│  │  │  └─ shared/
│  │  ├─ lib/
│  │  ├─ App.jsx
│  │  ├─ index.css
│  │  └─ main.jsx
│  ├─ package.json
│  └─ vite.config.js
│
├─ backend/
│  ├─ src/
│  │  └─ main.rs
│  ├─ Cargo.toml
│  └─ .env.example
│
├─ README.md
└─ .gitignore
```

---

## Quick Start

### Backend

On Windows, I recommend running the backend from **Developer Command Prompt for VS 2022**.

```bash
cd /d D:\py\rialo-guard-desk\backend
cargo run
```

If GitHub or Rialo RPC access needs a proxy:

```bash
cd /d D:\py\rialo-guard-desk\backend
set HTTP_PROXY=http://127.0.0.1:10808
set HTTPS_PROXY=http://127.0.0.1:10808
set ALL_PROXY=socks5://127.0.0.1:10808
set CARGO_NET_GIT_FETCH_WITH_CLI=true
cargo run
```

The backend runs at:

```txt
http://127.0.0.1:8080
```

Test the backend:

```txt
http://127.0.0.1:8080/health
```

Expected response:

```json
{
  "ok": true,
  "service": "rialo-guard-desk-backend",
  "version": "0.2-devnet-rpc"
}
```

---

### Frontend

Open another terminal window:

```bash
cd /d D:\py\rialo-guard-desk\frontend
npm run dev
```

If the Vite cache causes problems:

```bash
cd /d D:\py\rialo-guard-desk\frontend
rmdir /s /q node_modules\.vite
npm run dev
```

Open:

```txt
http://127.0.0.1:5173
```

---

## API Endpoints

```txt
GET  /health
GET  /state
GET  /rpc-status
GET  /balance/:pubkey
POST /transfer
POST /airdrop
POST /encrypt-secret
POST /operations/:id/approve
POST /operations/:id/reject
```

---

## Environment Variables

Example backend `.env`:

```env
SERVER_ADDR=127.0.0.1:8080
RIALO_NETWORK_NAME=Rialo Devnet
RIALO_RPC_URL=https://api.devnet.rialo.xyz

# Public key used for demo display and balance query
RIALO_SIGNER_PUBKEY=5TAJ9oAsfZD4XccMFMA5KqkW1PyC89nqS89msHi7CcT

# Keep this false unless a backend-controlled test wallet is configured
RIALO_ENABLE_REAL_EXECUTION=false

# Future real transaction execution requires a backend-controlled test wallet private key
RIALO_SIGNING_KEY_HEX=

# Optional secret sharing public key
RIALO_SECRET_SHARING_PUBKEY_HEX=
```


## Demo Flow

A typical demo flow:

1. Open the dashboard.
2. Check the Rialo Devnet RPC module.
3. Query a Rialo Playground public key balance.
4. Create a transfer request.
5. Let the system classify the operation risk.
6. Approve or reject the operation.
7. Encrypt an `agent-pay-key`.
8. Show the Secret Vault update.
9. Show the audit timeline update.
10. Explain the future plan for real transaction signing and broadcasting.

---

## Current Limitation

This version is a working local demo with real backend APIs and a Rialo Devnet RPC query module.

However, real transaction broadcasting is not enabled by default.

The current Rialo Playground wallet is custodial. I can see the public key and balance, but I do not have a private key that my local backend can use for signing.

Because of that, the current version supports:

- transfer request creation
- approval and rejection
- audit logging
- secret encryption demo
- real RPC balance query

But it does not yet broadcast real transfer transactions from the local backend.

The next step is to connect a backend-controlled devnet test wallet. After that, approving a transfer can build, sign, and broadcast a real Rialo Devnet transaction.

---

## Future Roadmap

Planned improvements:

- real Rialo Devnet wallet integration
- live balance and transaction history
- approval-triggered transaction signing and broadcasting
- transaction hash written back to the audit timeline
- multi-signer approval workflow
- visual policy editor
- agent budget and permission control
- real Secret Vault integration with Rialo secret encryption
- real-time alerts through Discord, Telegram, or email
- team roles and permission management
- guarded multisig-style treasury workflow
- AI-agent operation budget control
- program invocation review and approval flow

The long-term goal is to make Rialo Guard Desk a safety layer for team treasuries, AI agents, and automated workflows on Rialo.

---

## Development Notes

I built this project as a small Rialo ecosystem demo.

During development, I focused on three things:

1. Making the UI feel like a real security console instead of a generic Web3 landing page.
2. Building a working backend flow with Rust and Axum.
3. Exploring how Rialo RPC, policy review, approval flow, Secret Vault, and audit logging can fit together.

The current version is still an early demo, but it already demonstrates the main workflow I wanted to build: reviewing operations before execution and keeping every action auditable.

I also prepared both Chinese and English frontend UI versions, so the demo can be easier to understand for community members from different regions.


## Security Notes

Do not commit:

```txt
.env
private keys
seed phrases
API keys
production secrets
node_modules
target
```

This project is currently intended for devnet testing and product demonstration only.

<img width="701" height="875" alt="bbfaa00c28c372e3a6becfda1657c212" src="https://github.com/user-attachments/assets/3c117b71-94f1-4ff4-835a-60a2685f997a" />


---

## One-Line Summary

**Rialo Guard Desk is a policy execution console for Rialo teams, designed to review, approve, encrypt, and audit operations before they are executed on-chain.**
