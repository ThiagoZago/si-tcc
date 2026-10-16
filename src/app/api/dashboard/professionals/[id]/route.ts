import { privateRoute } from "@/server/http/handler";
import { readJson } from "@/server/http/request";
import { json } from "@/server/http/response";
import { archiveProfessional, saveProfessional } from "@/server/modules/professionals";
import { professionalSchema } from "@/shared/validation";

type Context = RouteContext<"/api/dashboard/professionals/[id]">;

export const PATCH = privateRoute(async (request, { business }, { params }: Context) => {
  const { id } = await params;
  const data = professionalSchema.parse(await readJson(request));
  return json({ id: saveProfessional(business.id, data, id), message: "Profissional salvo." });
});
export const DELETE = privateRoute(async (_request, { business }, { params }: Context) => {
  archiveProfessional(business.id, (await params).id);
  return json({ message: "Profissional arquivado. O histórico foi preservado." });
});
