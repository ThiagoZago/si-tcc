import "server-only";
import type { NextRequest } from "next/server";
import { unstable_rethrow } from "next/navigation";
import { requireUser } from "@/server/auth/session";
import { AppError } from "@/server/errors";
import { requireBusinessByOwner } from "@/server/modules/businesses";
import type { Business, User } from "@/shared/types";
import { checkOrigin } from "./request";
import { errorResponse } from "./response";

type Result = Response | Promise<Response>;
type Owner = { user: User; business: Business };

export function publicRoute<Context = unknown>(
  handler: (request: NextRequest, context: Context) => Result,
) {
  return async (request: NextRequest, context: Context) => {
    try {
      if (request.method !== "GET") checkOrigin(request);
      return await handler(request, context);
    } catch (error) {
      unstable_rethrow(error);
      return errorResponse(error);
    }
  };
}
export function privateRoute<Context = unknown>(
  handler: (request: NextRequest, owner: Owner, context: Context) => Result,
) {
  return publicRoute<Context>(async (request, context) => {
    const user = await requireUser();
    return handler(request, { user, business: requireBusinessByOwner(user.id) }, context);
  });
}
export function resourceNotFound(): never {
  throw new AppError(404, "Recurso não encontrado.");
}
