import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "../../journal.db");

const db = new Database(dbPath);

console.log("Connected to SQLite database");

db.exec(`
CREATE TABLE IF NOT EXISTS journal_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT NOT NULL,
  ambience TEXT,
  text TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS journal_analysis (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  journalId INTEGER NOT NULL,
  emotion TEXT,
  keywords TEXT,
  summary TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (journalId) REFERENCES journal_entries(id)
);
`);

console.log("Database tables ready");

export default db;