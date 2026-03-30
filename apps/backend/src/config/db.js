// src/config/db.js
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();



const { Pool } = pg;

// Create a single Pool instance
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Test connection
db.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => console.error("❌ DB connection error:", err.message));

console.log("DB URL:", process.env.DATABASE_URL);

// Export the Pool as default
export default db;