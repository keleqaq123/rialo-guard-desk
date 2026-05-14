# Rialo Guard Desk

A full-stack starter for a **Rialo policy execution console**.

## What is included

- **frontend/** — static HTML/CSS/JS dashboard with a real SaaS-style control-console UI
- **backend/** — Rust + Axum API with endpoints for state, transfer review, airdrop request, and secret encryption

The product direction is based on the Rialo CDK's documented capabilities: wallet/keyring management, transaction building/signing, RPC communication, program deployment/invocation, and secret encryption.

## Product concept

**Rialo Guard Desk** is a team treasury and policy console for:

- reviewing transfers before execution
- surfacing policy alerts
- keeping an audit trail
- handling airdrops in devnet
- encrypting secrets for TEE-style workflows

## Quick start

### Frontend

```bash
cd frontend
python -m http.server 5173
```

Open: `http://127.0.0.1:5173`

### Backend

```bash
cd backend
cp .env.example .env
cargo run
```

API will start on: `http://127.0.0.1:8080`

## Endpoints

- `GET /health`
- `GET /state`
- `POST /transfer`
- `POST /airdrop`
- `POST /encrypt-secret`

## Notes

- The backend is structured so you can replace mock review logic with deeper on-chain execution logic.
- The UI intentionally avoids “AI-looking” hero sections and instead follows an internal tool / security console aesthetic.
- Do **not** commit `.env`, private keys, seed phrases, or production secrets.
