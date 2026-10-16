import "server-only";

export function databasePath() {
  return process.env.DATABASE_PATH || "./data/barbapp.sqlite";
}
export function demoEnabled() {
  return (
    process.env.ENABLE_DEMO === "true" ||
    (process.env.ENABLE_DEMO !== "false" && process.env.NODE_ENV === "development")
  );
}
export function configuredOrigin() {
  return process.env.APP_URL ? new URL(process.env.APP_URL).origin : null;
}
export function secureCookies() {
  return (process.env.APP_URL ?? "").startsWith("https://");
}
