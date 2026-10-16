import { publicRoute } from "@/server/http/handler";
import { readJson } from "@/server/http/request";
import { json } from "@/server/http/response";
import { createBooking } from "@/server/modules/bookings";
import { rateLimit } from "@/server/security/rate-limit";
import { tokenHash } from "@/server/security/crypto";
import { bookingSchema } from "@/shared/validation";

export const POST = publicRoute(async (request) => {
  const data = bookingSchema.parse(await readJson(request));
  rateLimit(`book:${tokenHash(data.customerPhone)}`, 10, 3600);
  return json(createBooking(data), 201);
});
