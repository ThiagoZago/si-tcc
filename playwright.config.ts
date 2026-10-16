import { defineConfig } from "@playwright/test";
import { randomUUID } from "node:crypto";

const port = Number(process.env.E2E_PORT || 3100);
const baseURL = `http://127.0.0.1:${port}`;
process.env.E2E_DATABASE_PATH ??= `./data/e2e-${randomUUID()}.sqlite`;

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  reporter: "list",
  use: { baseURL },
  webServer: {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 90000,
    env: {
      DATABASE_PATH: process.env.E2E_DATABASE_PATH,
      APP_URL: baseURL,
      ENABLE_DEMO: "false",
      NEXT_DIST_DIR: ".next-test",
    },
  },
});
