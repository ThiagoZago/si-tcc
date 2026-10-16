import { createSession } from "@/server/auth/session";
import { demoEnabled } from "@/server/config";
import { AppError } from "@/server/errors";
import { publicRoute } from "@/server/http/handler";
import { json } from "@/server/http/response";
import { demoAccount } from "@/server/modules/accounts";
import { rateLimit } from "@/server/security/rate-limit";

export const POST = publicRoute(async () => {
  if (!demoEnabled()) throw new AppError(404, "Demonstração indisponível.");
  rateLimit("auth:demo", 30, 60);
  const user = demoAccount();
  await createSession(user.id);
  return json({ user });
});
