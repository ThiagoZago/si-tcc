import { publicRoute } from "@/server/http/handler";
import { json } from "@/server/http/response";
import { rescheduleSlots } from "@/server/modules/bookings";

export const GET = publicRoute(
  async (request, { params }: RouteContext<"/api/manage/[token]/slots">) =>
    json({
      slots: rescheduleSlots((await params).token, request.nextUrl.searchParams.get("date")),
    }),
);
