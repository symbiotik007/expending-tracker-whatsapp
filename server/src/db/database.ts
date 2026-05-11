import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DB_PATH = process.env.DB_PATH ?? path.join(__dirname, '../../../data/spendybot.db')

// ensure data dir exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })

export const db = new Database(DB_PATH)

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    phone      TEXT UNIQUE NOT NULL,
    name       TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id      INTEGER NOT NULL REFERENCES users(id),
    amount       REAL NOT NULL,
    currency     TEXT DEFAULT 'ARS',
    category     TEXT,
    description  TEXT,
    raw_message  TEXT,
    expense_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_expenses_user ON expenses(user_id);
  CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
`)

export function upsertUser(phone: string, name?: string): number {
  const existing = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone) as { id: number } | undefined
  if (existing) return existing.id

  const result = db.prepare('INSERT INTO users (phone, name) VALUES (?, ?)').run(phone, name ?? null)
  return result.lastInsertRowid as number
}

export function insertExpense(data: {
  user_id: number
  amount: number
  currency: string
  category: string
  description: string
  raw_message: string
}): number {
  const result = db.prepare(`
    INSERT INTO expenses (user_id, amount, currency, category, description, raw_message)
    VALUES (@user_id, @amount, @currency, @category, @description, @raw_message)
  `).run(data)
  return result.lastInsertRowid as number
}
