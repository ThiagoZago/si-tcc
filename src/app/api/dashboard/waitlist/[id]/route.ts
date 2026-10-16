import { privateRoute } from "@/server/http/handler";
import { readJson } from "@/server/http/request";
import { json } from "@/server/http/response";
import { updateWaitlistStatus } from "@/server/modules/waitlist";
import { waitlistStatusSchema } from "@/shared/validation";

export const PATCH = privateRoute(
  async (request, { business }, { params }: RouteContext<"/api/dashboard/waitlist/[id]">) => {
    const { id } = await params;
    const data = waitlistStatusSchema.parse(await readJson(request));
    updateWaitlistStatus(business.id, id, data.status);
    return json({ message: "Lista de espera atualizada." });
  },
);
