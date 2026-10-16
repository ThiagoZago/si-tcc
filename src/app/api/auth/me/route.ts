import { currentUser } from "@/server/auth/session";
import { publicRoute } from "@/server/http/handler";
import { json } from "@/server/http/response";

export const GET = publicRoute(async () => json({ user: await currentUser() }));
