import { publicRoute } from "@/server/http/handler";
import { json } from "@/server/http/response";
import { searchBusinesses } from "@/server/modules/businesses";

export const GET = publicRoute((request) =>
  json(searchBusinesses(request.nextUrl.searchParams.get("q") ?? "")),
);
