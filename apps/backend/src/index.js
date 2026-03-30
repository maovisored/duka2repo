import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import usersRouter from "./routes/usersRouter.js";
import orderRoutes from "./routes/productsRouter.js";
import productsRouter from "./routes/productsRouter.js";

import loginRoutes from "./routes/loginRoutes.js";
import { ensureSuperAdmin } from "./controllers/initAdmin.js";

const app = express();

/* ===================== */
/* CONFIG */
/* ===================== */
app.use(cors({ origin: "*" }));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080;
const logFile = path.join(__dirname, "duka2_logs.txt");

/* ===================== */
/* INIT */
/* ===================== */
(async () => {
  try {
    await ensureSuperAdmin();
    console.log("✅ Super admin ensured");
  } catch (err) {
    console.error("❌ Super admin init failed:", err.message);
  }
})();

/* ===================== */
/* ROUTES */
/* ===================== */
app.get("/", (req, res) => {
  res.send("API running");
});

app.get("/test", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/users", loginRoutes);
app.use("/api/users", usersRouter);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productsRouter);

/* ===================== */
/* LOGGER */
/* ===================== */
app.post("/log", (req, res) => {
  const { level = "INFO", message = "", data } = req.body;

  const entry = `[${new Date().toISOString()}] [${level}] ${message} ${JSON.stringify(data || {})}\n`;

  fs.appendFileSync(logFile, entry);
  console.log(entry.trim());

  res.json({ status: "ok" });
});

/* ===================== */
/* SAFE SERVER START */
/* ===================== */
if (!global._serverStarted) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log("ENV CHECK:", process.env.DB_NAME);
  });

  global._serverStarted = true;
}