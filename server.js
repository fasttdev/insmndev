const express = require("express");
const path = require("path");

// Router utama (sama persis dengan api/index.js)
const apiRouter = require("./api/index");

const app = express();
const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));

// Block file sensitif
const BLOCKED = ["server.js", "package.json", "package-lock.json", ".env"];
app.use((req, res, next) => {
  const p = req.path.toLowerCase();
  if (p.startsWith("/api/") && p.endsWith(".js")) return res.status(403).send("Forbidden");
  if (BLOCKED.some((f) => p.includes(f))) return res.status(403).send("Forbidden");
  next();
});

// Lempar semua request /api ke router
app.all("/api/*", (req, res) => apiRouter(req, res));

// Serve file statis (HTML/CSS/JS)
app.use(express.static(path.join(__dirname), { index: "beranda.html", extensions: ["html"] }));

app.use((req, res) => res.status(404).send("Halaman tidak ditemukan."));

app.listen(PORT, () => {
  console.log(`\n  Insomnia Dev — Server Lokal Aktif`);
  console.log(`  → http://localhost:${PORT}\n`);
});