import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import usersRouter from "./routes/usersRouter.js";
import orderRoutes from "./modules/orders/orderRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import { ensureSuperAdmin } from "./controllers/initAdmin.js";


const app = express();


app.use(cors({
  origin: "*", // for now (demo)
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const logFile = path.join(__dirname, "duka2_logs.txt");


app.use(cors());
app.use(express.json());

(async () => {
  try {
    await ensureSuperAdmin();
    console.log("✅ Super admin ensured");
  } catch (err) {
    console.error("❌ Super admin init failed:", err.message);
  }
})();


app.use("/api/users", loginRoutes);

// ❌ REMOVE THIS
// await initDB();

app.get("/", (req, res) => {
  res.send("API running");
});

/* ===================== */
/* USERS */
/* ===================== */
app.use("/api/users", usersRouter);

/* ===================== */
/* ORDERS */
/* ===================== */
app.use("/api/orders", orderRoutes);

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
/* START */
/* ===================== */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("ENV CHECK:", process.env.DB_NAME);
});