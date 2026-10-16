import { publicRoute, resourceNotFound } from "@/server/http/handler";

const handler = publicRoute(resourceNotFound);
export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };
