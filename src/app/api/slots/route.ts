import { publicRoute } from "@/server/http/handler";
import { json } from "@/server/http/response";
import { availableSlots } from "@/server/modules/bookings";

export const GET = publicRoute((request) => {
  const query = request.nextUrl.searchParams;
  return json({
    slots: availableSlots(
      query.get("businessId") || "",
      query.get("professionalId") || "",
      query.get("serviceId") || "",
      query.get("date") || "",
    ),
  });
});
