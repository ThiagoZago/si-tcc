import { privateRoute } from "@/server/http/handler";
import { readJson } from "@/server/http/request";
import { json } from "@/server/http/response";
import { renameAccount } from "@/server/modules/accounts";
import { accountSchema } from "@/shared/validation";

export const PATCH = privateRoute(async (request, { user }) => {
  renameAccount(user.id, accountSchema.parse(await readJson(request)).name);
  return json({ message: "Perfil atualizado." });
});
