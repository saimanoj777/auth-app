import express from "express";
import session from "express-session";
import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const db = new sqlite3.Database("./db.sqlite");

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);

// Create users table
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password TEXT
)`);

// Register
app.post("/api/register", (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
    if (row) return res.status(400).json({ message: "Email already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword], function (err) {
      if (err) return res.status(500).json({ message: "Error saving user" });
      res.json({ message: "User registered successfully" });
    });
  });
});

// Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });
    req.session.userId = user.id;
    res.json({ message: "Login successful" });
  });
});

// Check session
app.get("/api/session", (req, res) => {
  if (req.session.userId) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

// Logout
app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out successfully" });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
