import "server-only";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { databasePath } from "@/server/config";
import { migrate } from "./schema";

const globalDb = globalThis as unknown as { barbappDb?: DatabaseSync };
export function database() {
  if (globalDb.barbappDb) return globalDb.barbappDb;
  const path = databasePath();
  if (path !== ":memory:")
    mkdirSync(dirname(resolve(/* turbopackIgnore: true */ path)), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;");
  try {
    migrate(db);
  } catch (error) {
    db.close();
    throw error;
  }
  globalDb.barbappDb = db;
  return db;
}
export function all<T>(sql: string, ...args: SQLInputValue[]): T[] {
  return database()
    .prepare(sql)
    .all(...args)
    .map((row) => ({ ...row })) as unknown as T[];
}
export function one<T>(sql: string, ...args: SQLInputValue[]): T | undefined {
  const row = database()
    .prepare(sql)
    .get(...args);
  return row ? ({ ...row } as unknown as T) : undefined;
}
export function run(sql: string, ...args: SQLInputValue[]) {
  return database()
    .prepare(sql)
    .run(...args);
}
export function transaction<T>(fn: () => T): T {
  const db = database();
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
