import { privateRoute } from "@/server/http/handler";
import { json } from "@/server/http/response";
import { dashboardData } from "@/server/modules/dashboard";

export const GET = privateRoute((_request, { user, business }) =>
  json(dashboardData(user, business)),
);
