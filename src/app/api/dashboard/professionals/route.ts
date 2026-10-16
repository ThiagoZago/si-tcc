import { privateRoute } from "@/server/http/handler";
import { readJson } from "@/server/http/request";
import { json } from "@/server/http/response";
import { saveProfessional } from "@/server/modules/professionals";
import { professionalSchema } from "@/shared/validation";

export const POST = privateRoute(async (request, { business }) => {
  const data = professionalSchema.parse(await readJson(request));
  return json({ id: saveProfessional(business.id, data), message: "Profissional salvo." }, 201);
});
