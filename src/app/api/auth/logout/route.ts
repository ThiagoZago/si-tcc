import { deleteSession } from "@/server/auth/session";
import { publicRoute } from "@/server/http/handler";
import { json } from "@/server/http/response";

export const POST = publicRoute(async () => {
  await deleteSession();
  return json({ message: "Você saiu da sua conta." });
});
