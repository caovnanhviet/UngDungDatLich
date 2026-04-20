const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "secret123";

// ===== DB =====
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "110307",
  database: "bookingDB"
});

db.connect(err => {
  if (err) console.log(err);
  else console.log("✅ MySQL connected");
});

// ===== JWT =====
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(403).json("No token");

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json("Invalid token");
    req.user = decoded;
    next();
  });
};

// ===== AUTH =====
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hash],
    (err) => {
      if (err) return res.status(500).json("User exists");
      res.json("Register success");
    }
  );
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM users WHERE username=?", [username], async (err, result) => {
    if (result.length === 0) return res.status(400).json("User not found");

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(400).json("Wrong password");

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ token });
  });
});

// ===== APPOINTMENTS =====
app.get("/appointments", verifyToken, (req, res) => {
  db.query("SELECT * FROM appointments", (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
});

app.post("/appointments", verifyToken, (req, res) => {
  const { name, date, time } = req.body;

  db.query(
    "INSERT INTO appointments (name,date,time,status) VALUES (?,?,?,?)",
    [name, date, time, "pending"],
    (err) => {
      if (err) return res.json(err);
      res.json("OK");
    }
  );
});

app.put("/appointments/:id", verifyToken, (req, res) => {
  const { name, date, time } = req.body;

  db.query(
    "UPDATE appointments SET name=?,date=?,time=? WHERE id=?",
    [name, date, time, req.params.id],
    (err) => {
      if (err) return res.json(err);
      res.json("Updated");
    }
  );
});

app.delete("/appointments/:id", verifyToken, (req, res) => {
  db.query(
    "DELETE FROM appointments WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.json(err);
      res.json("Deleted");
    }
  );
});

// ===== PAYMENT =====
app.post("/payment", verifyToken, (req, res) => {
  const { id } = req.body;

  db.query(
    "UPDATE appointments SET status='paid' WHERE id=?",
    [id],
    (err) => {
      if (err) return res.json(err);
      res.json("Paid");
    }
  );
});

// ===== CANCEL =====
app.put("/appointments/:id/cancel", verifyToken, (req, res) => {
  db.query(
    "UPDATE appointments SET status='cancelled' WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.json(err);
      res.json("Cancelled");
    }
  );
});

app.listen(5000, () => {
  console.log("🚀 Server http://localhost:5000");
});