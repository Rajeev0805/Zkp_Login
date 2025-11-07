// =============================================================
// ZKP Login System Frontend - by Rajeev
// =============================================================

const API_BASE = "http://localhost:4000"; // backend URL

// cryptographic parameters (shared between Prover and Verifier)
const p = BigInt("0xffffffffffc5");
const g = 2n;

let x, y, k, r, c, s; // working variables

// ========== Helper Functions ==========
function saveSecretLocally(username, x) {
  localStorage.setItem("zkp_" + username, x.toString());
}

function getSecretLocally(username) {
  const v = localStorage.getItem("zkp_" + username);
  return v ? BigInt(v) : null;
}

function modPow(base, exp, mod) {
  if (base === undefined || exp === undefined || mod === undefined) {
    console.error("modPow called with undefined value:", { base, exp, mod });
    throw new Error("Undefined input in modPow()");
  }
  base = BigInt(base);
  exp = BigInt(exp);
  mod = BigInt(mod);
  let result = 1n;
  base %= mod;
  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % mod;
    exp >>= 1n;
    base = (base * base) % mod;
  }
  return result;
}

function getSecureRandomBigInt(bits = 64) {
  // bits = number of random bits you want, 64 bits default
  const bytes = Math.ceil(bits / 8);
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  
  let hex = "0x";
  array.forEach(byte => {
    hex += byte.toString(16).padStart(2, "0");
  });
  
  return BigInt(hex);
}



// animation for message transfer between Prover & Verifier
function animate(label, from, to) {
  const packet = document.createElement("div");
  packet.className = "packet";
  packet.textContent = label;
  packet.style.left = from === "Prover" ? "20%" : "70%";
  document.getElementById("animation-area").appendChild(packet);
  setTimeout(() => (packet.style.left = to === "Prover" ? "20%" : "70%"), 100);
  setTimeout(() => packet.remove(), 1500);
}

// update status message on verifier panel
function setStatus(message, color = "#0ff") {
  const result = document.getElementById("result");
  result.textContent = "Status: " + message;
  result.style.color = color;
}
function logVerifierStep(text, color = "#ccc") {
  const log = document.getElementById("verifier-log");
  const p = document.createElement("p");
  p.textContent = text;
  p.style.color = color;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
}


// hash password (simple SHA-256 → BigInt)
async function hashPassword(password) {
  const enc = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-256", enc.encode(password));
  const hashArray = Array.from(new Uint8Array(buffer));
  const hex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return BigInt("0x" + hex);
}

// =============================================================
// ================ BUTTON EVENT HANDLERS =======================
// =============================================================

// ---------- Register new user ----------
document.getElementById("register").onclick = async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  // Derive secret x from password
  x = await hashPassword(password);
  y = modPow(g, x, p);
  saveSecretLocally(username, x);
  alert("Registered successfully! You’ll never need to type the password again 😎");
  // Send y to backend for registration
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, y: y.toString() }),
  });

  const data = await res.json();
  alert(data.message);
};

// ---------- Send Commitment (r) ----------
document.getElementById("commit").onclick = async () => {
  const username = document.getElementById("username").value.trim();

  
  let xStored = getSecretLocally(username);
  if (!xStored) {
    alert("Secret not found locally. Please register first.");
    return;
  }
  x = xStored;

  k = getSecureRandomBigInt(64); // 64-bit secure random value
  r = modPow(BigInt(g), BigInt(k), BigInt(p));

  // send r to backend
  const res = await fetch(`${API_BASE}/commit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, r: r.toString() }),
  });

  const data = await res.json();
  c = BigInt(data.c); // challenge received

  animate("r", "Prover", "Verifier");
  animate("c", "Verifier", "Prover");
  setStatus(`Challenge received: c = ${c}`);
};


// ---------- Send Response (s) ----------
document.getElementById("respond").onclick = async () => {
  const username = document.getElementById("username").value.trim();
  if (!username || !c) {
    alert("Please complete previous steps first.");
    return;
  }
   if (!y) {
    y = modPow(g, x, p);
  }

  s = (k + c * x) % (p - 1n);

  // send s to backend for verification
  const res = await fetch(`${API_BASE}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, s: s.toString() }),
  });

  animate("s", "Prover", "Verifier");

  const data = await res.json();
  logVerifierStep("Verifier checking...");
  const lhs = modPow(g, s, p);
  const rhs = (r * modPow(y, c, p)) % p;

  logVerifierStep(`g^s mod p = ${lhs}`);
  logVerifierStep(`r * y^c mod p = ${rhs}`);

  if (lhs === rhs) {
    logVerifierStep("✅ Proof verified: user knows the secret!", "#0f0");
    setStatus("✅ Login Verified! " + data.message, "#0f0");
  } else {
    logVerifierStep("❌ Proof failed!", "#f00");
    setStatus("❌ Verification Failed. " + data.message, "#f00");
  }

};

// ---------- Send Challenge (for UI only) ----------
document.getElementById("challenge").onclick = () => {
  animate("c", "Verifier", "Prover");
  setStatus("Challenge Sent!");
};

// ---------- Verify (for UI only) ----------
document.getElementById("verify").onclick = () => {
  setStatus("Waiting for Prover response...");
};

// ---------- Clear Verifier Log ----------
document.getElementById("clear-log").onclick = () => {
  const log = document.getElementById("verifier-log");
  log.innerHTML = ""; // clear all log messages
  setStatus("Log cleared. Ready for new proof.", "#0ff");
};
