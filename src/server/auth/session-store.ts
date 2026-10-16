import "server-only";
import { one, run } from "@/server/db/connection";
import { TOKEN_LENGTH, randomToken, tokenHash } from "@/server/security/crypto";
import type { User } from "@/shared/types";

export const SESSION_COOKIE = "barbapp_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export function isSessionToken(token: string | undefined): token is string {
  return token?.length === TOKEN_LENGTH;
}
export function hasActiveSession(token: string | undefined) {
  return (
    isSessionToken(token) &&
    !!one("SELECT hash FROM sessions WHERE hash=? AND expires_at>?", tokenHash(token), Date.now())
  );
}
export function sessionUser(token: string) {
  return (
    one<User>(
      "SELECT u.id,u.name,u.email,u.created_at AS createdAt FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.hash=? AND s.expires_at>?",
      tokenHash(token),
      Date.now(),
    ) ?? null
  );
}
export function openSession(userId: string) {
  const token = randomToken();
  run("DELETE FROM sessions WHERE expires_at<?", Date.now());
  run(
    "INSERT INTO sessions(hash,user_id,expires_at) VALUES(?,?,?)",
    tokenHash(token),
    userId,
    Date.now() + SESSION_MAX_AGE * 1000,
  );
  return token;
}
export function closeSession(token: string) {
  run("DELETE FROM sessions WHERE hash=?", tokenHash(token));
}
export function closeUserSessions(userId: string) {
  run("DELETE FROM sessions WHERE user_id=?", userId);
}
