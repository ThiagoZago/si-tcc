import { privateRoute } from "@/server/http/handler";
import { readJson } from "@/server/http/request";
import { json } from "@/server/http/response";
import { archiveService, saveService } from "@/server/modules/services";
import { serviceSchema } from "@/shared/validation";

type Context = RouteContext<"/api/dashboard/services/[id]">;

export const PATCH = privateRoute(async (request, { business }, { params }: Context) => {
  const { id } = await params;
  const data = serviceSchema.parse(await readJson(request));
  return json({ id: saveService(business.id, data, id), message: "Serviço salvo." });
});
export const DELETE = privateRoute(async (_request, { business }, { params }: Context) => {
  archiveService(business.id, (await params).id);
  return json({ message: "Serviço arquivado. O histórico foi preservado." });
});
