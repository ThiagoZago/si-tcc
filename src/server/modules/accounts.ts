import "server-only";
import { randomUUID } from "node:crypto";
import { one, run, transaction } from "@/server/db/connection";
import { DEMO_EMAIL, isDemoLocked, seedDemo } from "@/server/demo";
import { AppError } from "@/server/errors";
import { closeUserSessions } from "@/server/auth/session-store";
import { hashPassword, verifyPassword } from "@/server/security/crypto";
import { defaultAvailability } from "@/shared/availability";
import type { RegisterInput } from "@/shared/validation";
import type { User } from "@/shared/types";

const UNKNOWN_USER_HASH = `00000000000000000000000000000000:${"0".repeat(128)}`;

function slugify(text: string) {
  return (
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "barbearia"
  );
}
export function registerAccount(data: RegisterInput) {
  if (one("SELECT id FROM users WHERE email=?", data.email))
    throw new AppError(409, "Já existe uma conta com este e-mail.");
  const userId = randomUUID();
  const businessId = randomUUID();
  const passwordHash = hashPassword(data.password);
  const slug = slugify(data.businessName);
  transaction(() => {
    run(
      "INSERT INTO users(id,name,email,password_hash) VALUES(?,?,?,?)",
      userId,
      data.name,
      data.email,
      passwordHash,
    );
    run(
      "INSERT INTO businesses(id,owner_id,name,slug,email,hours) VALUES(?,?,?,?,?,?)",
      businessId,
      userId,
      data.businessName,
      `${slug}-${businessId.slice(0, 8)}`,
      data.email,
      JSON.stringify(defaultAvailability()),
    );
  });
  return { id: userId, name: data.name, email: data.email };
}
export function authenticate(email: string, password: string) {
  const user = one<User & { passwordHash: string }>(
    "SELECT id,name,email,created_at AS createdAt,password_hash AS passwordHash FROM users WHERE email=?",
    email,
  );
  const valid = verifyPassword(password, user?.passwordHash ?? UNKNOWN_USER_HASH);
  if (!user || !valid || isDemoLocked(user.email))
    throw new AppError(401, "E-mail ou senha incorretos.");
  return { id: user.id, name: user.name, email: user.email };
}
export function demoAccount() {
  seedDemo();
  const user = one<Pick<User, "id" | "name" | "email">>(
    "SELECT id,name,email FROM users WHERE email=?",
    DEMO_EMAIL,
  );
  if (!user) throw new AppError(404, "Demonstração não configurada.");
  return user;
}
export function renameAccount(userId: string, name: string) {
  run("UPDATE users SET name=? WHERE id=?", name, userId);
}
export function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const row = one<{ hash: string }>("SELECT password_hash AS hash FROM users WHERE id=?", userId);
  if (!row || !verifyPassword(currentPassword, row.hash))
    throw new AppError(400, "Senha atual incorreta.");
  transaction(() => {
    run("UPDATE users SET password_hash=? WHERE id=?", hashPassword(newPassword), userId);
    closeUserSessions(userId);
  });
}
