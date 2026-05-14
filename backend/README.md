# Rialo Guard Desk Backend

Rust + Axum backend for the Rialo Guard Desk UI.

## Run

```bash
cp .env.example .env
cargo run
```

## API

- `GET /health`
- `GET /state`
- `POST /transfer`
- `POST /airdrop`
- `POST /encrypt-secret`

## Why this structure

The Rialo CDK documents core support for:

- wallet/keyring management
- transaction building and signing
- RPC communication
- program deployment / invocation
- secret encryption

This backend therefore exposes product-oriented API routes around those capabilities, while keeping the UI easy to wire.

## Security note

Do not commit real private keys or production secrets.
