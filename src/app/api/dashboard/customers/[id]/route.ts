import { privateRoute } from "@/server/http/handler";
import { readJson } from "@/server/http/request";
import { json } from "@/server/http/response";
import { saveCustomer } from "@/server/modules/customers";
import { customerSchema } from "@/shared/validation";

export const PATCH = privateRoute(
  async (request, { business }, { params }: RouteContext<"/api/dashboard/customers/[id]">) => {
    const { id } = await params;
    const data = customerSchema.parse(await readJson(request));
    return json({ id: saveCustomer(business.id, data, id), message: "Cliente salvo." });
  },
);
