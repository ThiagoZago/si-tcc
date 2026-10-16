import "server-only";
import { one, run, transaction } from "@/server/db/connection";
import { AppError } from "@/server/errors";

export function rateLimit(key: string, max: number, seconds: number) {
  const now = Math.floor(Date.now() / 1000);
  transaction(() => {
    run("DELETE FROM rate_limits WHERE reset_at<?", now);
    const row = one<{ count: number; resetAt: number }>(
      "SELECT count,reset_at AS resetAt FROM rate_limits WHERE key=?",
      key,
    );
    if (row && row.count >= max)
      throw new AppError(429, "Muitas tentativas. Aguarde alguns minutos e tente novamente.");
    run(
      "INSERT INTO rate_limits(key,count,reset_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1",
      key,
      now + seconds,
    );
  });
}
