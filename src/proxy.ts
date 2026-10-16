import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, hasActiveSession } from "@/server/auth/session-store";

export function proxy(request: NextRequest) {
  if (!hasActiveSession(request.cookies.get(SESSION_COOKIE)?.value)) {
    const response = NextResponse.redirect(new URL("/acesso", request.url));
    response.headers.set("Cache-Control", "no-store, private");
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, private");
  return response;
}

export const config = { matcher: ["/painel/:path*"] };
