import fs from "fs";
import path from "path";

const HISTORY_FILE = path.join(process.cwd(), "chat_history.json");
const EXPIRE = 30 * 24 * 60 * 60; // 30 days in seconds

function ensureFile() {
  if (!fs.existsSync(HISTORY_FILE)) fs.writeFileSync(HISTORY_FILE, "{}");
}

export function readHistory() {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, "utf8") || "{}");
  } catch (e) {
    fs.writeFileSync(HISTORY_FILE, "{}");
    return {};
  }
}

export function writeHistory(data) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2));
}

export function cleanupHistory() {
  const data = readHistory();
  const now = Math.floor(Date.now() / 1000);
  for (const uid of Object.keys(data)) {
    data[uid] = data[uid].filter((m) => now - (m.timestamp || now) <= EXPIRE);
    if (data[uid].length === 0) delete data[uid];
  }
  writeHistory(data);
}

export function saveMessage(uid, role, content) {
  const data = readHistory();
  if (!data[uid]) data[uid] = [];
  data[uid].push({ role, content, timestamp: Math.floor(Date.now() / 1000) });
  writeHistory(data);
}

export function ensureHistoryFile() {
  ensureFile();
}
