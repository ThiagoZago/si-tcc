import "server-only";
import type { DatabaseSync } from "node:sqlite";

const schema = `
CREATE TABLE IF NOT EXISTS migrations (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE COLLATE NOCASE, password_hash TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS sessions (hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS businesses (id TEXT PRIMARY KEY, owner_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, description TEXT NOT NULL DEFAULT '', phone TEXT NOT NULL DEFAULT '', email TEXT NOT NULL DEFAULT '', address TEXT NOT NULL DEFAULT '', city TEXT NOT NULL DEFAULT '', hours TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS professionals (id TEXT PRIMARY KEY, business_id TEXT NOT NULL REFERENCES businesses(id), name TEXT NOT NULL, role TEXT NOT NULL, bio TEXT NOT NULL DEFAULT '', color TEXT NOT NULL DEFAULT '#b92b32', active INTEGER NOT NULL DEFAULT 1, availability TEXT NOT NULL, exceptions TEXT NOT NULL DEFAULT '[]');
CREATE TABLE IF NOT EXISTS services (id TEXT PRIMARY KEY, business_id TEXT NOT NULL REFERENCES businesses(id), name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', price INTEGER NOT NULL CHECK(price >= 0), duration INTEGER NOT NULL CHECK(duration BETWEEN 15 AND 240), active INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS service_professionals (service_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE, professional_id TEXT NOT NULL REFERENCES professionals(id) ON DELETE CASCADE, PRIMARY KEY (service_id, professional_id));
CREATE TABLE IF NOT EXISTS customers (id TEXT PRIMARY KEY, business_id TEXT NOT NULL REFERENCES businesses(id), name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT NOT NULL DEFAULT '', notes TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT (datetime('now')), UNIQUE(business_id, phone));
CREATE TABLE IF NOT EXISTS appointments (id TEXT PRIMARY KEY, business_id TEXT NOT NULL REFERENCES businesses(id), customer_id TEXT NOT NULL REFERENCES customers(id), professional_id TEXT NOT NULL REFERENCES professionals(id), service_id TEXT NOT NULL REFERENCES services(id), date TEXT NOT NULL, start_minutes INTEGER NOT NULL CHECK(start_minutes >= 0 AND start_minutes < 1440), duration INTEGER NOT NULL CHECK(duration > 0), price INTEGER NOT NULL CHECK(price >= 0), status TEXT NOT NULL DEFAULT 'confirmed' CHECK(status IN ('pending','confirmed','completed','cancelled','no_show')), notes TEXT NOT NULL DEFAULT '', service_name TEXT NOT NULL, professional_name TEXT NOT NULL, manage_hash TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS waitlist (id TEXT PRIMARY KEY, business_id TEXT NOT NULL REFERENCES businesses(id), customer_name TEXT NOT NULL, phone TEXT NOT NULL, date TEXT NOT NULL, service_id TEXT NOT NULL REFERENCES services(id), professional_id TEXT NOT NULL REFERENCES professionals(id), status TEXT NOT NULL DEFAULT 'waiting' CHECK(status IN ('waiting','contacted','closed')), created_at TEXT NOT NULL DEFAULT (datetime('now')), UNIQUE(business_id, phone, date, service_id, professional_id));
CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, reset_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS appointments_business_date ON appointments(business_id, date);
CREATE INDEX IF NOT EXISTS appointments_professional_date ON appointments(professional_id, date, start_minutes);
CREATE INDEX IF NOT EXISTS professionals_business ON professionals(business_id);
CREATE INDEX IF NOT EXISTS services_business ON services(business_id);
CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires_at);
CREATE TRIGGER IF NOT EXISTS prevent_appointment_overlap BEFORE INSERT ON appointments
  WHEN NEW.status <> 'cancelled' AND NEW.status <> 'no_show' BEGIN
  SELECT RAISE(ABORT, 'appointment_overlap') WHERE EXISTS (SELECT 1 FROM appointments a WHERE a.professional_id = NEW.professional_id AND a.date = NEW.date AND a.status NOT IN ('cancelled','no_show') AND a.start_minutes < NEW.start_minutes + NEW.duration AND a.start_minutes + a.duration > NEW.start_minutes);
END;
CREATE TRIGGER IF NOT EXISTS prevent_appointment_overlap_update BEFORE UPDATE ON appointments
  WHEN NEW.status <> 'cancelled' AND NEW.status <> 'no_show' BEGIN
  SELECT RAISE(ABORT, 'appointment_overlap') WHERE EXISTS (SELECT 1 FROM appointments a WHERE a.id <> NEW.id AND a.professional_id = NEW.professional_id AND a.date = NEW.date AND a.status NOT IN ('cancelled','no_show') AND a.start_minutes < NEW.start_minutes + NEW.duration AND a.start_minutes + a.duration > NEW.start_minutes);
END;
INSERT OR IGNORE INTO migrations(version) VALUES (1);
`;

const migrations = [
  {
    version: 2,
    sql: `
      ALTER TABLE appointments ADD COLUMN customer_name TEXT NOT NULL DEFAULT '';
      ALTER TABLE appointments ADD COLUMN customer_phone TEXT NOT NULL DEFAULT '';
      UPDATE appointments SET customer_name=(SELECT name FROM customers WHERE id=appointments.customer_id), customer_phone=(SELECT phone FROM customers WHERE id=appointments.customer_id);
    `,
  },
];

export function migrate(db: DatabaseSync) {
  db.exec(schema);
  db.exec("BEGIN IMMEDIATE");
  try {
    for (const migration of migrations) {
      if (db.prepare("SELECT version FROM migrations WHERE version=?").get(migration.version))
        continue;
      db.exec(migration.sql);
      db.prepare("INSERT INTO migrations(version) VALUES (?)").run(migration.version);
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
