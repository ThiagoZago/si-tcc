import { publicRoute } from "@/server/http/handler";
import { json } from "@/server/http/response";
import { cancelBooking } from "@/server/modules/bookings";

export const POST = publicRoute(
  async (_request, { params }: RouteContext<"/api/manage/[token]/cancel">) => {
    cancelBooking((await params).token);
    return json({ message: "Agendamento cancelado." });
  },
);
