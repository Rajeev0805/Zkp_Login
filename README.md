# 🔐 Zero Knowledge Proof (ZKP) Passwordless Authentication System

### 👨‍💻 Author: Rajeev Keshetty  
**Institution:** Indian Institute of Information Technology Tiruchirappalli  

---

## 🧩 Overview

This project implements a **Passwordless Authentication System** using **Zero Knowledge Proofs (ZKPs)** — specifically, the **Schnorr Identification Protocol**.

The system demonstrates how a **Prover** (user) can prove their identity to a **Verifier** (server) without revealing their password or any secret information.

The full project includes a **frontend visualization** showing real-time Prover–Verifier interactions, and a **Node.js backend** performing all cryptographic checks.

---

## ⚙️ Features

- ✅ Passwordless authentication (no password transmission or storage)
- 🔄 Real-time visualization of ZKP protocol (Commit → Challenge → Respond → Verify)
- 🔢 Cryptographically secure random number generation using Web Crypto API
- 🧮 Modular arithmetic with JavaScript `BigInt`
- 🌐 Backend API built with Express.js for handling proof verification
- 🧠 Implementation of **Schnorr’s Zero Knowledge Proof** protocol
- 🔒 Security based on the **Discrete Logarithm Problem**

---

## 🧠 How It Works

The authentication follows the classic **3-phase ZKP structure:**

| Step | Phase | Description |
|------|--------|-------------|
| 1️⃣ | **Commitment** | Prover sends `r = g^k mod p` |
| 2️⃣ | **Challenge** | Verifier sends a random number `c` |
| 3️⃣ | **Response** | Prover sends `s = k + c*x mod (p-1)` |
| ✅ | **Verification** | Verifier checks if `g^s ≡ r * y^c mod p` |

If the equality holds, the verifier confirms the prover knows the secret `x` without revealing it.

---

## 🏗️ Project Structure

zkp-login/
├── backend/ # Node.js + Express server
│ ├── server.js
│ ├── package.json
│ └── users.json
│
├── frontend/ (or docs/) # HTML, CSS, JS frontend
│ ├── index.html
│ ├── script.js
│ └── style.css
│
└── README.md # This file


---

## 🧰 Tech Stack

| Layer               | Technology                               |
|---------------------|------------------------------------------|
| **Frontend**        | HTML, CSS, JavaScript                    |
| **Backend**         | Node.js, Express.js                      |
| **Libraries**       | bigint-crypto-utils, cors, body-parser   |
| **Crypto API**      | WebCryptoAPI(`crypto.getRandomValues()`) |
| **Version Control** | Git + GitHub                             |
| **Editor**          | Visual Studio Code                       |


---

## ⚡ Running Locally

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Rajeev0805/Zkp_Login.git
cd Zkp_Login

2️⃣ Setup Backend
cd backend
npm install
node server.js

Backend starts on http://localhost:4000

3️⃣ Run Frontend

You can open the frontend/index.html file directly in a browser,
or run it via VS Code Live Server.

📸 Demo Highlights

Animated data transfer between Prover ↔ Verifier

Verifier log showing computations (g^s, r*y^c)

Status indicator (✅ Verified / ❌ Failed)

Secure random generation confirmation messages

🧪 Future Enhancements

Real-time two-way communication (WebSockets)

Multi-user registration and verification

Integration with WebAuthn / Biometrics

zk-SNARK or zk-STARK based advanced protocols

Blockchain-backed credential verification

📚 References

C. Schnorr, Efficient Identification and Signatures for Smart Cards, CRYPTO 1989.

S. Goldwasser, S. Micali, and C. Rackoff, The Knowledge Complexity of Interactive Proof Systems, 1989.

MDN Web Docs – Web Crypto API

🏁 Status
✅ Working Locally
🎨 UI Enhancements & Real-Time Features In Progress

“Prove that you know something — without revealing it.”
– Zero Knowledge at its finest.