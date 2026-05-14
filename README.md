# Rialo Guard Desk

**Rialo Guard Desk** is a full-stack demo I built for the Rialo ecosystem. It is designed as a **policy execution console** for team treasuries, AI-agent operations, and automated on-chain workflows.

Instead of building a simple wallet page, I wanted to explore a more practical problem:  
**how teams can review, control, approve, reject, encrypt, and audit operations before they are executed on-chain.**

---

## What is included

- **frontend/** — React / Vite dashboard with a security-console style UI
- **backend/** — Rust + Axum API for state management, transfer review, approval/rejection, airdrop request records, secret encryption, and Rialo Devnet RPC query
- **policy flow** — operation queue, risk review, approval / rejection, policy rules, Secret Vault, and audit timeline

The product direction is inspired by Rialo’s documented capabilities around wallet/keyring management, transaction building/signing, RPC communication, program deployment/invocation, workflow automation, and secret encryption.

---

## Product concept

**Rialo Guard Desk** is a team treasury and policy console for:

- reviewing transfers before execution
- surfacing policy and risk alerts
- approving or rejecting operations
- keeping a clear audit trail
- recording devnet airdrop requests
- encrypting secrets for AI-agent or TEE-style workflows
- querying a Rialo Devnet public key through the RPC module

The main idea is:

> Review first.  
> Apply policy before signing.  
> Protect secrets before use.  
> Make every operation traceable.

---

## Why I built this

As more on-chain actions become automated, teams and AI agents need more than a basic wallet interface.

A normal wallet answers:

> How do I sign this transaction?

Rialo Guard Desk focuses on a different question:

> Should this operation be allowed to execute in the first place?

This demo explores how a Rialo-based team could manage treasury actions, agent permissions, secret usage, and review workflows in a safer way.

---

## Current features

- Operation queue
- Transfer request creation
- Risk level display
- Approval / rejection flow
- Policy rule panel
- Execution pipeline view
- Secret Vault for agent keys or API credentials
- Audit timeline
- Backend response log
- Rialo Devnet RPC status endpoint
- Public key balance query endpoint
- React frontend + Rust backend

---

## Quick start

### Backend

On Windows, I recommend running the backend from **Developer Command Prompt for VS 2022**:

```bash
cd /d D:\py\rialo-guard-desk\backend
cargo run
