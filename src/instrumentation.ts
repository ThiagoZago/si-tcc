export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.NEXT_PHASE === "phase-production-build")
    return;
  const { initialize } = await import("@/server/bootstrap");
  try {
    initialize();
  } catch (error) {
    console.error(
      "Falha ao inicializar o banco:",
      error instanceof Error ? error.name : "UnknownError",
    );
  }
}
