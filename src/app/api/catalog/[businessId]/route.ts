import { publicRoute } from "@/server/http/handler";
import { json } from "@/server/http/response";
import { catalog } from "@/server/modules/catalog";

export const GET = publicRoute(
  async (_request, { params }: RouteContext<"/api/catalog/[businessId]">) =>
    json(catalog((await params).businessId)),
);
