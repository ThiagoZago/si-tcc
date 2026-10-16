import { privateRoute } from "@/server/http/handler";
import { readJson } from "@/server/http/request";
import { json } from "@/server/http/response";
import { updateBusiness } from "@/server/modules/businesses";
import { businessSchema } from "@/shared/validation";

export const PATCH = privateRoute(async (request, { user, business }) => {
  updateBusiness(business.id, user.id, businessSchema.parse(await readJson(request)));
  return json({ message: "Estabelecimento atualizado." });
});
