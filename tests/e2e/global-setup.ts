import { existsSync, readdirSync, rmSync } from "node:fs";
import { basename, join } from "node:path";

export default function globalSetup() {
  if (!existsSync("data")) return;
  const current = basename(process.env.E2E_DATABASE_PATH ?? "");
  for (const name of readdirSync("data"))
    if (/^e2e-.+\.sqlite(-wal|-shm)?$/.test(name) && !name.startsWith(current))
      rmSync(join("data", name), { force: true });
}
