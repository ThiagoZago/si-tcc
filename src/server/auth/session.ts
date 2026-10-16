import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { secureCookies } from "@/server/config";
import { isDemoLocked } from "@/server/demo";
import { AppError } from "@/server/errors";
import type { User } from "@/shared/types";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  closeSession,
  isSessionToken,
  openSession,
  sessionUser,
} from "./session-store";

export async function currentUser(): Promise<User | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!isSessionToken(token)) return null;
  const user = sessionUser(token);
  return isDemoLocked(user?.email) ? null : user;
}
export async function requireUser() {
  const user = await currentUser();
  if (!user) throw new AppError(401, "Sua sessão terminou. Entre novamente.");
  return user;
}
export async function requirePageUser() {
  const user = await currentUser();
  if (!user) redirect("/acesso");
  return user;
}
export async function createSession(userId: string) {
  const token = openSession(userId);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: secureCookies(),
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}
export async function deleteSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) closeSession(token);
  jar.delete(SESSION_COOKIE);
}
