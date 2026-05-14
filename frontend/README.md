# Rialo Guard Desk React Frontend

React + Vite frontend for **Rialo Guard Desk: on-chain policy execution and team treasury control console**.

This is the componentized version of the static prototype. It connects to the Rust backend from the previous full-stack version.

## Run

```bash
npm install
npm run dev
```

Open:

```txt
http://127.0.0.1:5173
```

## Backend

Start your Rust backend first:

```bash
cd ../rialo-guard-desk/backend
cp .env.example .env
cargo run
```

Default API base:

```txt
http://127.0.0.1:8080
```

To change it:

```bash
cp .env.example .env
```

Edit:

```env
VITE_API_BASE_URL=http://127.0.0.1:8080
```

## API routes used

- `GET /state`
- `POST /transfer`
- `POST /airdrop`
- `POST /encrypt-secret`

## Directory

```txt
src/
├─ api/
│  └─ rialo.js
├─ components/
│  ├─ dashboard/
│  │  ├─ ActionPipeline.jsx
│  │  ├─ AuditTimeline.jsx
│  │  ├─ MetricCards.jsx
│  │  ├─ OperationTable.jsx
│  │  ├─ PolicyPanel.jsx
│  │  ├─ ReviewPanel.jsx
│  │  └─ SecretVault.jsx
│  ├─ forms/
│  │  └─ ActionForms.jsx
│  ├─ layout/
│  │  ├─ Header.jsx
│  │  └─ Sidebar.jsx
│  └─ shared/
│     ├─ RiskBar.jsx
│     └─ StatusPill.jsx
├─ lib/
│  ├─ mockState.js
│  └─ utils.js
├─ App.jsx
├─ index.css
└─ main.jsx
```

## Design direction

No “AI-looking” hero page. The interface is designed as an internal security console:

- off-white background
- black and gray visual system
- table-first operation review
- policy and audit trail modules
- minimal accent colors for status only
