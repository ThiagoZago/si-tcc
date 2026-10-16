import { privateRoute } from "@/server/http/handler";
import { readJson } from "@/server/http/request";
import { json } from "@/server/http/response";
import { saveCustomer } from "@/server/modules/customers";
import { customerSchema } from "@/shared/validation";

export const POST = privateRoute(async (request, { business }) => {
  const data = customerSchema.parse(await readJson(request));
  return json({ id: saveCustomer(business.id, data), message: "Cliente salvo." });
});
