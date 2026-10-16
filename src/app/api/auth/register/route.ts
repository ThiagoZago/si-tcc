import { createSession } from "@/server/auth/session";
import { publicRoute } from "@/server/http/handler";
import { readJson } from "@/server/http/request";
import { json } from "@/server/http/response";
import { registerAccount } from "@/server/modules/accounts";
import { rateLimit } from "@/server/security/rate-limit";
import { registerSchema } from "@/shared/validation";

export const POST = publicRoute(async (request) => {
  const data = registerSchema.parse(await readJson(request));
  rateLimit("register:global", 15, 3600);
  const user = registerAccount(data);
  await createSession(user.id);
  return json({ message: "Sua conta está pronta!", user }, 201);
});
