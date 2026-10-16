import { privateRoute } from "@/server/http/handler";
import { readJson } from "@/server/http/request";
import { json } from "@/server/http/response";
import { saveService } from "@/server/modules/services";
import { serviceSchema } from "@/shared/validation";

export const POST = privateRoute(async (request, { business }) => {
  const data = serviceSchema.parse(await readJson(request));
  return json({ id: saveService(business.id, data), message: "Serviço salvo." }, 201);
});
