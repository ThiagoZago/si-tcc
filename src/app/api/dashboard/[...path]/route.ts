import { privateRoute, resourceNotFound } from "@/server/http/handler";

const handler = privateRoute(resourceNotFound);
export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };
