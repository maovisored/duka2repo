import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFile = path.join(__dirname, "duka2_logs.txt");

if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, "", "utf-8");
}

function write(level, message, data = null) {
  const timestamp = new Date().toISOString();

  const entry = [
    "===================================",
    `[${timestamp}] [${level}]`,
    message,
    data ? JSON.stringify(data, null, 2) : "",
    "\n"
  ].join("\n");

  fs.appendFile(logFile, entry, (err) => {
    if (err) console.error("[LOGGER ERROR]", err);
  });

  console.log(entry);
}

export const logger = {
  info: (msg, data) => write("INFO", msg, data),
  error: (msg, data) => write("ERROR", msg, data),
  warn: (msg, data) => write("WARN", msg, data),
};