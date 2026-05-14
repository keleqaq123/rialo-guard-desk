const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8080";
async function parseResponse(res){const contentType=res.headers.get("content-type")||"";const data=contentType.includes("application/json")?await res.json():await res.text();if(!res.ok){const message=typeof data==="object"&&data?.error?data.error:`Request failed: ${res.status}`;throw new Error(message)}return data}
export async function getState(){return parseResponse(await fetch(`${API_BASE}/state`))}
export async function getRpcStatus(){return parseResponse(await fetch(`${API_BASE}/rpc-status`))}
export async function getBalance(pubkey){return parseResponse(await fetch(`${API_BASE}/balance/${encodeURIComponent(pubkey)}`))}
export async function createTransfer(payload){return parseResponse(await fetch(`${API_BASE}/transfer`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)}))}
export async function requestAirdrop(payload){return parseResponse(await fetch(`${API_BASE}/airdrop`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)}))}
export async function encryptSecret(payload){return parseResponse(await fetch(`${API_BASE}/encrypt-secret`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)}))}
export async function approveOperation(id){return parseResponse(await fetch(`${API_BASE}/operations/${encodeURIComponent(id)}/approve`,{method:"POST"}))}
export async function rejectOperation(id){return parseResponse(await fetch(`${API_BASE}/operations/${encodeURIComponent(id)}/reject`,{method:"POST"}))}
