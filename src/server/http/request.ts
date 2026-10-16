import "server-only";
import type { NextRequest } from "next/server";
import { configuredOrigin } from "@/server/config";
import { AppError } from "@/server/errors";

const MAX_BODY_LENGTH = 32000;

export async function readJson(request: NextRequest): Promise<unknown> {
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new AppError(415, "Envie os dados em JSON.");
  const text = await request.text();
  if (text.length > MAX_BODY_LENGTH) throw new AppError(413, "Dados muito extensos.");
  try {
    return JSON.parse(text);
  } catch {
    throw new AppError(400, "Dados inválidos.");
  }
}
export function checkOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const requestUrl = new URL(request.url);
  const expected =
    configuredOrigin() ??
    `${requestUrl.protocol}//${request.headers.get("host") || requestUrl.host}`;
  if (origin && origin !== expected) throw new AppError(403, "Origem da requisição não permitida.");
}
