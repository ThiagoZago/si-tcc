import { createSession } from "@/server/auth/session";
import { publicRoute } from "@/server/http/handler";
import { readJson } from "@/server/http/request";
import { json } from "@/server/http/response";
import { authenticate } from "@/server/modules/accounts";
import { rateLimit } from "@/server/security/rate-limit";
import { tokenHash } from "@/server/security/crypto";
import { loginSchema } from "@/shared/validation";

export const POST = publicRoute(async (request) => {
  const data = loginSchema.parse(await readJson(request));
  rateLimit(`login:${tokenHash(data.email)}`, 8, 900);
  rateLimit("login:global", 100, 60);
  const user = authenticate(data.email, data.password);
  await createSession(user.id);
  return json({ user });
});
