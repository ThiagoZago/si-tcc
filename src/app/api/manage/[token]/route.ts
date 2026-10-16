import { publicRoute } from "@/server/http/handler";
import { readJson } from "@/server/http/request";
import { json } from "@/server/http/response";
import { managedAppointment, managedBooking, rescheduleBooking } from "@/server/modules/bookings";
import { rescheduleSchema } from "@/shared/validation";

type Context = RouteContext<"/api/manage/[token]">;

export const GET = publicRoute(async (_request, { params }: Context) =>
  json(managedBooking((await params).token)),
);
export const PATCH = publicRoute(async (request, { params }: Context) => {
  const { token } = await params;
  managedAppointment(token);
  const data = rescheduleSchema.parse(await readJson(request));
  rescheduleBooking(token, data.date, data.time);
  return json({ message: "Agendamento remarcado." });
});
