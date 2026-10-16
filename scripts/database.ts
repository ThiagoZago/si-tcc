import { existsSync } from "node:fs";
import { database } from "@/server/db/connection";
import { DEMO_EMAIL, DEMO_PASSWORD, seedDemo } from "@/server/demo";

for (const file of [".env.local", ".env"]) if (existsSync(file)) process.loadEnvFile(file);
database();
if (process.argv.includes("--seed")) {
  seedDemo();
  console.log(`Dados de demonstração criados. Acesso: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
} else console.log("Banco inicializado. Use npm run db:seed para carregar a demonstração.");
