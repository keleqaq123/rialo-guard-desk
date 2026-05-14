use std::{env, net::SocketAddr, str::FromStr, sync::Arc};

use anyhow::Context;
use axum::{
    extract::{Path, State},
    http::Method,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use base64::{engine::general_purpose::STANDARD as BASE64, Engine as _};
use chrono::{DateTime, Utc};
use rialo_cdk::rpc::types::Pubkey;
use rialo_cdk::rpc::HttpRpcClient;
use rialo_cdk::secret_encryption::encrypt_secret;
use rialo_cdk::RpcClient;
use rialo_types::PublicKey;
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing::{info, warn};
use uuid::Uuid;

#[derive(Clone)]
struct AppState {
    config: AppConfig,
    dashboard: Arc<RwLock<DashboardState>>,
}

#[derive(Clone)]
struct AppConfig {
    server_addr: String,
    network_name: String,
    rpc_url: String,
    signer_pubkey: String,
    secret_sharing_pubkey_hex: Option<String>,
    real_execution_enabled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct DashboardState {
    network: NetworkInfo,
    signer: SignerInfo,
    metrics: Vec<Metric>,
    operations: Vec<OperationItem>,
    policies: Vec<PolicyRule>,
    timeline: Vec<TimelineEvent>,
    vault: VaultPreview,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct NetworkInfo {
    name: String,
    rpc_url: String,
    rpc_status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct SignerInfo {
    pubkey: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Metric {
    label: String,
    value: String,
    note: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct OperationItem {
    id: String,
    #[serde(rename = "type")]
    op_type: String,
    target: String,
    amount: String,
    risk: String,
    state: String,
    time: String,
    created_at: DateTime<Utc>,
    recipient_raw: Option<String>,
    amount_raw: Option<u64>,
    tx_signature: Option<String>,
    execution_mode: Option<String>,
    error: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct PolicyRule {
    name: String,
    value: String,
    status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct TimelineEvent {
    title: String,
    body: String,
    time: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct VaultPreview {
    name: String,
    preview: String,
}

#[derive(Debug, Serialize)]
struct ApiError {
    ok: bool,
    error: String,
}

#[derive(Debug, Deserialize)]
struct TransferRequest {
    recipient: String,
    amount: u64,
    memo: Option<String>,
}

#[derive(Debug, Serialize)]
struct TransferResponse {
    operation: OperationItem,
    policy_result: PolicyReview,
    message: String,
}

#[derive(Debug, Serialize)]
struct PolicyReview {
    risk: String,
    review_required: bool,
    reasons: Vec<String>,
}

#[derive(Debug, Deserialize)]
struct AirdropRequest {
    recipient: String,
    amount: u64,
}

#[derive(Debug, Serialize)]
struct AirdropResponse {
    operation: OperationItem,
    message: String,
}

#[derive(Debug, Deserialize)]
struct EncryptSecretRequest {
    name: String,
    secret: String,
}

#[derive(Debug, Serialize)]
struct EncryptSecretResponse {
    name: String,
    preview: String,
    bytes_len: usize,
    mode: String,
}

#[derive(Debug, Serialize)]
struct RpcStatusResponse {
    ok: bool,
    network: String,
    rpc_url: String,
    message: String,
    checked_at: String,
}

#[derive(Debug, Serialize)]
struct BalanceResponse {
    ok: bool,
    network: String,
    rpc_url: String,
    pubkey: String,
    balance_raw: String,
    checked_at: String,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();

    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        .init();

    let config = load_config()?;
    let state = AppState {
        config: config.clone(),
        dashboard: Arc::new(RwLock::new(seed_state(&config))),
    };

    let cors = CorsLayer::new()
        .allow_origin(tower_http::cors::Any)
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(tower_http::cors::Any);

    let app = Router::new()
        .route("/health", get(health))
        .route("/state", get(get_state))
        .route("/rpc-status", get(rpc_status))
        .route("/balance/:pubkey", get(get_balance))
        .route("/balance/{pubkey}", get(get_balance))
        .route("/transfer", post(create_transfer))
        .route("/airdrop", post(request_airdrop))
        .route("/encrypt-secret", post(encrypt_secret_handler))
        .route("/operations/:id/approve", post(approve_operation))
        .route("/operations/{id}/approve", post(approve_operation))
        .route("/operations/:id/reject", post(reject_operation))
        .route("/operations/{id}/reject", post(reject_operation))
        .with_state(state)
        .layer(cors)
        .layer(TraceLayer::new_for_http());

    let addr: SocketAddr = config.server_addr.parse().context("invalid SERVER_ADDR")?;
    info!("starting rialo guard desk backend on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

fn load_config() -> anyhow::Result<AppConfig> {
    Ok(AppConfig {
        server_addr: env::var("SERVER_ADDR").unwrap_or_else(|_| "127.0.0.1:8080".to_string()),
        network_name: env::var("RIALO_NETWORK_NAME").unwrap_or_else(|_| "Rialo Devnet".to_string()),
        rpc_url: env::var("RIALO_RPC_URL").unwrap_or_else(|_| "https://api.devnet.rialo.xyz".to_string()),
        signer_pubkey: env::var("RIALO_SIGNER_PUBKEY")
            .unwrap_or_else(|_| "5TAJ9oAsfZD4XccMFMA5KqkW1PyC89nqS89msHi7CcT".to_string()),
        secret_sharing_pubkey_hex: env::var("RIALO_SECRET_SHARING_PUBKEY_HEX")
            .ok()
            .filter(|s| !s.trim().is_empty()),
        real_execution_enabled: env::var("RIALO_ENABLE_REAL_EXECUTION")
            .unwrap_or_else(|_| "false".to_string())
            .eq_ignore_ascii_case("true"),
    })
}

fn seed_state(config: &AppConfig) -> DashboardState {
    DashboardState {
        network: NetworkInfo {
            name: config.network_name.clone(),
            rpc_url: config.rpc_url.clone(),
            rpc_status: "Ready".to_string(),
        },
        signer: SignerInfo {
            pubkey: config.signer_pubkey.clone(),
        },
        metrics: vec![
            Metric {
                label: "Treasury Balance".into(),
                value: "Query via RPC".into(),
                note: "Use Devnet Wallet panel".into(),
            },
            Metric {
                label: "Pending Reviews".into(),
                value: "2".into(),
                note: "1 requires manual approval".into(),
            },
            Metric {
                label: "Policy Pass Rate".into(),
                value: "94.6%".into(),
                note: "last 24 hours".into(),
            },
            Metric {
                label: "Median Finality".into(),
                value: "RPC".into(),
                note: "devnet rpc connected".into(),
            },
        ],
        operations: vec![
            OperationItem {
                id: "op_seed_001".into(),
                op_type: "Transfer".into(),
                target: shorten(&config.signer_pubkey),
                amount: "1 RIAL".into(),
                risk: "Medium".into(),
                state: "Waiting approval".into(),
                time: "2m ago".into(),
                created_at: Utc::now(),
                recipient_raw: Some(config.signer_pubkey.clone()),
                amount_raw: Some(1),
                tx_signature: None,
                execution_mode: Some("approval-only".into()),
                error: None,
            },
            OperationItem {
                id: "op_seed_002".into(),
                op_type: "Secret encryption".into(),
                target: "agent-pay-key".into(),
                amount: "—".into(),
                risk: "Low".into(),
                state: "Encrypted".into(),
                time: "18m ago".into(),
                created_at: Utc::now(),
                recipient_raw: None,
                amount_raw: None,
                tx_signature: None,
                execution_mode: Some("secret-vault".into()),
                error: None,
            },
        ],
        policies: vec![
            PolicyRule {
                name: "Daily transfer ceiling".into(),
                value: "≤ 10,000 RIAL".into(),
                status: "Active".into(),
            },
            PolicyRule {
                name: "Unknown recipient review".into(),
                value: "Manual approval".into(),
                status: "Active".into(),
            },
            PolicyRule {
                name: "Program deploy cooldown".into(),
                value: "15 min delay".into(),
                status: "Active".into(),
            },
            PolicyRule {
                name: "Secret export".into(),
                value: "Blocked".into(),
                status: "Strict".into(),
            },
        ],
        timeline: vec![
            TimelineEvent {
                title: "RPC integration ready".into(),
                body: format!("Connected target: {}", config.rpc_url),
                time: now_hms(),
            },
            TimelineEvent {
                title: "Transaction simulated".into(),
                body: "No account write conflict detected.".into(),
                time: now_hms(),
            },
            TimelineEvent {
                title: "Policy engine completed".into(),
                body: "2 checks passed, 1 review required.".into(),
                time: now_hms(),
            },
        ],
        vault: VaultPreview {
            name: "agent-pay-key".into(),
            preview: "No encrypted secret yet".into(),
        },
    }
}

async fn health() -> impl IntoResponse {
    Json(serde_json::json!({
        "ok": true,
        "service": "rialo-guard-desk-backend",
        "version": "0.2-devnet-rpc"
    }))
}

async fn get_state(State(state): State<AppState>) -> impl IntoResponse {
    let dashboard = state.dashboard.read().await;
    Json(dashboard.clone())
}

async fn rpc_status(State(state): State<AppState>) -> impl IntoResponse {
    Json(RpcStatusResponse {
        ok: true,
        network: state.config.network_name.clone(),
        rpc_url: state.config.rpc_url.clone(),
        message: "Rialo RPC URL configured. Use /balance/:pubkey for real devnet balance query.".into(),
        checked_at: now_hms(),
    })
}

async fn get_balance(
    Path(pubkey): Path<String>,
    State(state): State<AppState>,
) -> impl IntoResponse {
    match query_rialo_balance(&state.config.rpc_url, &pubkey).await {
        Ok(balance) => Json(BalanceResponse {
            ok: true,
            network: state.config.network_name.clone(),
            rpc_url: state.config.rpc_url.clone(),
            pubkey,
            balance_raw: balance.to_string(),
            checked_at: now_hms(),
        })
        .into_response(),
        Err(error) => (
            axum::http::StatusCode::BAD_REQUEST,
            Json(ApiError {
                ok: false,
                error: format!("failed to query Rialo devnet balance: {error}"),
            }),
        )
            .into_response(),
    }
}

async fn query_rialo_balance(rpc_url: &str, pubkey: &str) -> anyhow::Result<u64> {
    let client = HttpRpcClient::new(rpc_url.to_string());
    let wallet_pubkey = Pubkey::from_str(pubkey).context("invalid Rialo public key")?;
    let balance = client.get_balance(&wallet_pubkey).await?;
    Ok(balance)
}

async fn create_transfer(
    State(state): State<AppState>,
    Json(payload): Json<TransferRequest>,
) -> impl IntoResponse {
    if payload.recipient.trim().is_empty() || payload.amount == 0 {
        return (
            axum::http::StatusCode::BAD_REQUEST,
            Json(ApiError {
                ok: false,
                error: "recipient and amount are required".into(),
            }),
        )
            .into_response();
    }

    let review = assess_transfer_risk(&payload.recipient, payload.amount);
    let operation = OperationItem {
        id: format!("op_{}", Uuid::new_v4().simple()),
        op_type: "Transfer".into(),
        target: shorten(&payload.recipient),
        amount: format!("{} RIAL", payload.amount),
        risk: review.risk.clone(),
        state: if review.review_required {
            "Waiting approval".into()
        } else {
            "Approved".into()
        },
        time: "just now".into(),
        created_at: Utc::now(),
        recipient_raw: Some(payload.recipient.clone()),
        amount_raw: Some(payload.amount),
        tx_signature: None,
        execution_mode: Some("approval-only".into()),
        error: None,
    };

    {
        let mut dashboard = state.dashboard.write().await;
        dashboard.operations.insert(0, operation.clone());
        dashboard.timeline.insert(
            0,
            TimelineEvent {
                title: "Transfer request created".into(),
                body: format!(
                    "{} RIAL to {}{}",
                    payload.amount,
                    shorten(&payload.recipient),
                    payload
                        .memo
                        .as_ref()
                        .map(|m| format!(" | memo: {}", m))
                        .unwrap_or_default()
                ),
                time: now_hms(),
            },
        );
        update_metrics(&mut dashboard);
    }

    Json(TransferResponse {
        operation,
        policy_result: review,
        message: "Transfer request created. Approval-first execution flow is ready.".into(),
    })
    .into_response()
}

async fn request_airdrop(
    State(state): State<AppState>,
    Json(payload): Json<AirdropRequest>,
) -> impl IntoResponse {
    if payload.recipient.trim().is_empty() || payload.amount == 0 {
        return (
            axum::http::StatusCode::BAD_REQUEST,
            Json(ApiError {
                ok: false,
                error: "recipient and amount are required".into(),
            }),
        )
            .into_response();
    }

    let operation = OperationItem {
        id: format!("op_{}", Uuid::new_v4().simple()),
        op_type: "Airdrop".into(),
        target: shorten(&payload.recipient),
        amount: format!("{} RIAL", payload.amount),
        risk: "Low".into(),
        state: "Broadcasted".into(),
        time: "just now".into(),
        created_at: Utc::now(),
        recipient_raw: Some(payload.recipient.clone()),
        amount_raw: Some(payload.amount),
        tx_signature: None,
        execution_mode: Some("local-record".into()),
        error: None,
    };

    {
        let mut dashboard = state.dashboard.write().await;
        dashboard.operations.insert(0, operation.clone());
        dashboard.timeline.insert(
            0,
            TimelineEvent {
                title: "Airdrop requested".into(),
                body: format!(
                    "{} RIAL to {} | Real faucet is handled by Rialo Playground.",
                    payload.amount,
                    shorten(&payload.recipient)
                ),
                time: now_hms(),
            },
        );
        update_metrics(&mut dashboard);
    }

    Json(AirdropResponse {
        operation,
        message: format!(
            "Local request recorded. Real devnet faucet should be requested from Rialo Playground. RPC: {}",
            state.config.rpc_url
        ),
    })
    .into_response()
}

async fn encrypt_secret_handler(
    State(state): State<AppState>,
    Json(payload): Json<EncryptSecretRequest>,
) -> impl IntoResponse {
    if payload.name.trim().is_empty() || payload.secret.trim().is_empty() {
        return (
            axum::http::StatusCode::BAD_REQUEST,
            Json(ApiError {
                ok: false,
                error: "name and secret are required".into(),
            }),
        )
            .into_response();
    }

    let (preview, bytes_len, mode) = match try_encrypt_with_rialo(&state.config, &payload.secret) {
        Ok(bytes) => (
            format_preview(&bytes),
            bytes.len(),
            "rialo_cdk::encrypt_secret".to_string(),
        ),
        Err(err) => {
            warn!(error = %err, "falling back to mock encryption preview");
            let fallback = BASE64.encode(payload.secret.as_bytes()).into_bytes();
            (
                format!("demo-encrypted:{}", format_preview(&fallback)),
                fallback.len(),
                "demo-base64-preview".to_string(),
            )
        }
    };

    {
        let mut dashboard = state.dashboard.write().await;
        dashboard.vault = VaultPreview {
            name: payload.name.clone(),
            preview: preview.clone(),
        };
        dashboard.operations.insert(
            0,
            OperationItem {
                id: format!("op_{}", Uuid::new_v4().simple()),
                op_type: "Secret encryption".into(),
                target: payload.name.clone(),
                amount: "—".into(),
                risk: "Low".into(),
                state: "Encrypted".into(),
                time: "just now".into(),
                created_at: Utc::now(),
                recipient_raw: None,
                amount_raw: None,
                tx_signature: None,
                execution_mode: Some(mode.clone()),
                error: None,
            },
        );
        dashboard.timeline.insert(
            0,
            TimelineEvent {
                title: "Secret encrypted".into(),
                body: format!("Stored encrypted preview for {}", payload.name),
                time: now_hms(),
            },
        );
        update_metrics(&mut dashboard);
    }

    Json(EncryptSecretResponse {
        name: payload.name,
        preview,
        bytes_len,
        mode,
    })
    .into_response()
}

async fn approve_operation(
    Path(id): Path<String>,
    State(state): State<AppState>,
) -> impl IntoResponse {
    let mut dashboard = state.dashboard.write().await;

    let Some(operation) = dashboard.operations.iter_mut().find(|op| op.id == id) else {
        return (
            axum::http::StatusCode::NOT_FOUND,
            Json(ApiError {
                ok: false,
                error: format!("operation not found: {}", id),
            }),
        )
            .into_response();
    };

    if operation.op_type == "Transfer" && state.config.real_execution_enabled {
        operation.state = "Approved".to_string();
        operation.execution_mode = Some("real-execution-requested".into());
        operation.error = Some("Real transfer broadcast requires backend-controlled signing key integration. v0.2 enables real balance query first.".into());
    } else {
        operation.state = "Approved".to_string();
        operation.execution_mode = Some("approval-only".into());
        operation.error = None;
    }

    operation.time = "just now".to_string();
    let cloned = operation.clone();

    dashboard.timeline.insert(
        0,
        TimelineEvent {
            title: "Operation approved".into(),
            body: format!(
                "{} {} was approved | mode: {}",
                cloned.op_type,
                cloned.id,
                cloned.execution_mode.clone().unwrap_or_default()
            ),
            time: now_hms(),
        },
    );

    update_metrics(&mut dashboard);

    Json(serde_json::json!({
        "ok": true,
        "operation": cloned,
        "message": "Operation approved. v0.2 supports real Rialo RPC balance query; true transaction broadcast is gated behind a backend-controlled signing key."
    }))
    .into_response()
}

async fn reject_operation(
    Path(id): Path<String>,
    State(state): State<AppState>,
) -> impl IntoResponse {
    let mut dashboard = state.dashboard.write().await;

    let Some(operation) = dashboard.operations.iter_mut().find(|op| op.id == id) else {
        return (
            axum::http::StatusCode::NOT_FOUND,
            Json(ApiError {
                ok: false,
                error: format!("operation not found: {}", id),
            }),
        )
            .into_response();
    };

    operation.state = "Rejected".to_string();
    operation.time = "just now".to_string();
    operation.execution_mode = Some("blocked-by-review".into());
    let cloned = operation.clone();

    dashboard.timeline.insert(
        0,
        TimelineEvent {
            title: "Operation rejected".into(),
            body: format!("{} {} was rejected", cloned.op_type, cloned.id),
            time: now_hms(),
        },
    );

    update_metrics(&mut dashboard);

    Json(serde_json::json!({
        "ok": true,
        "operation": cloned,
        "message": format!("Operation {} is now rejected", id)
    }))
    .into_response()
}

fn assess_transfer_risk(recipient: &str, amount: u64) -> PolicyReview {
    let mut reasons = Vec::new();
    let mut risk = "Low".to_string();
    let mut review_required = false;

    if amount > 10_000 {
        risk = "High".into();
        review_required = true;
        reasons.push("Transfer exceeds the daily default threshold".into());
    } else if amount > 2_000 {
        risk = "Medium".into();
        review_required = true;
        reasons.push("Transfer amount requires manual treasury review".into());
    }

    if recipient.len() > 16 {
        reasons.push("Recipient is treated as a new external address".into());
        if risk == "Low" {
            risk = "Medium".into();
            review_required = true;
        }
    }

    if reasons.is_empty() {
        reasons.push("Policy checks passed".into());
    }

    PolicyReview {
        risk,
        review_required,
        reasons,
    }
}

fn try_encrypt_with_rialo(config: &AppConfig, secret: &str) -> anyhow::Result<Vec<u8>> {
    let secret_sharing_hex = config
        .secret_sharing_pubkey_hex
        .clone()
        .context("RIALO_SECRET_SHARING_PUBKEY_HEX not set")?;

    let creator_pubkey = Pubkey::from_str(&config.signer_pubkey)
        .context("invalid RIALO_SIGNER_PUBKEY for creator pubkey")?;

    let pubkey_bytes = hex::decode(secret_sharing_hex).context("invalid hex for secret sharing pubkey")?;
    let pk_array: [u8; 32] = pubkey_bytes
        .try_into()
        .map_err(|_| anyhow::anyhow!("secret sharing pubkey must be 32 bytes"))?;

    let sharing_pubkey = PublicKey::from_bytes(pk_array);
    let encrypted = encrypt_secret(secret.to_string(), &creator_pubkey, &sharing_pubkey)?;

    Ok(encrypted)
}

fn format_preview(bytes: &[u8]) -> String {
    let hexed = hex::encode(bytes);
    let take = hexed.len().min(40);
    format!(
        "{}{}",
        &hexed[..take],
        if hexed.len() > take { "..." } else { "" }
    )
}

fn shorten(value: &str) -> String {
    if value.len() <= 12 {
        value.to_string()
    } else {
        format!("{}...{}", &value[..4], &value[value.len() - 4..])
    }
}

fn now_hms() -> String {
    Utc::now().format("%H:%M:%S").to_string()
}

fn update_metrics(dashboard: &mut DashboardState) {
    let pending_count = dashboard
        .operations
        .iter()
        .filter(|op| op.state.to_lowercase().contains("waiting"))
        .count();

    let encrypted_count = dashboard
        .operations
        .iter()
        .filter(|op| op.op_type == "Secret encryption")
        .count();

    dashboard.metrics = vec![
        Metric {
            label: "Treasury Balance".into(),
            value: "Query via RPC".into(),
            note: "Use Devnet Wallet panel".into(),
        },
        Metric {
            label: "Pending Reviews".into(),
            value: pending_count.to_string(),
            note: if pending_count == 0 {
                "No review blockers".into()
            } else {
                format!("{} waiting for signer", pending_count)
            },
        },
        Metric {
            label: "Policy Pass Rate".into(),
            value: "94.6%".into(),
            note: "last 24 hours".into(),
        },
        Metric {
            label: "Secrets Encrypted".into(),
            value: encrypted_count.to_string(),
            note: "vault operations tracked".into(),
        },
    ];

    if dashboard.timeline.len() > 10 {
        dashboard.timeline.truncate(10);
    }

    if dashboard.operations.len() > 14 {
        dashboard.operations.truncate(14);
    }
}
