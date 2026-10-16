import { privateRoute } from "@/server/http/handler";
import { readJson } from "@/server/http/request";
import { json } from "@/server/http/response";
import { changeAppointmentStatus } from "@/server/modules/appointments";
import { statusSchema } from "@/shared/validation";

export const PATCH = privateRoute(
  async (request, { business }, { params }: RouteContext<"/api/dashboard/appointments/[id]">) => {
    const { id } = await params;
    const data = statusSchema.parse(await readJson(request));
    changeAppointmentStatus(business.id, id, data.status);
    return json({ message: "Agendamento atualizado." });
  },
);
