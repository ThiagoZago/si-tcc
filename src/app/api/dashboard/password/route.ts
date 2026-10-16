import { createSession } from "@/server/auth/session";
import { privateRoute } from "@/server/http/handler";
import { readJson } from "@/server/http/request";
import { json } from "@/server/http/response";
import { changePassword } from "@/server/modules/accounts";
import { rateLimit } from "@/server/security/rate-limit";
import { passwordChangeSchema } from "@/shared/validation";

export const PATCH = privateRoute(async (request, { user }) => {
  const data = passwordChangeSchema.parse(await readJson(request));
  rateLimit(`password:${user.id}`, 5, 900);
  changePassword(user.id, data.currentPassword, data.newPassword);
  await createSession(user.id);
  return json({ message: "Senha alterada. As outras sessões foram encerradas." });
});
