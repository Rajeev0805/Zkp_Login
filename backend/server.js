const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const { modPow } = require("bigint-crypto-utils");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

const p = BigInt("0xffffffffffc5");
const g = 2n;

let users = {};
if (fs.existsSync("users.json")) {
  users = JSON.parse(fs.readFileSync("users.json"));
}

app.post("/register", (req, res) => {
  const { username, y } = req.body;
  if (users[username]) return res.status(400).json({ message: "User already exists" });

  users[username] = y;
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
  res.json({ message: "User registered successfully" });
});

let session = {};

app.post("/commit", (req, res) => {
  const { username, r } = req.body;
  if (!users[username]) return res.status(400).json({ message: "User not found" });

  const c = BigInt(Math.floor(Math.random() * 100000));
  session[username] = { r: BigInt(r), c };
  res.json({ c: c.toString() });
});

app.post("/verify", (req, res) => {
  const { username, s } = req.body;
  const user = users[username];
  const sess = session[username];
  if (!sess || !user) return res.status(400).json({ message: "Session or user missing" });

  const r = sess.r;
  const c = sess.c;
  const y = BigInt(user);

  const lhs = modPow(g, BigInt(s), p);
  const rhs = (r * modPow(y, c, p)) % p;

  if (lhs === rhs) {
    delete session[username];
    return res.json({ verified: true, message: "Login successful!" });
  } else {
    return res.json({ verified: false, message: "Verification failed!" });
  }
});

app.listen(PORT, () => console.log(`ZKP Server running on http://localhost:${PORT}`));
