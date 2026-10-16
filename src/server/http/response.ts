import "server-only";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "@/server/errors";

const PRIVATE_CACHE = "no-store, private";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": PRIVATE_CACHE } });
}
export function csv(content: string, filename: string) {
  return new NextResponse(`\uFEFF${content}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": PRIVATE_CACHE,
    },
  });
}
export function errorResponse(error: unknown) {
  if (error instanceof ZodError)
    return json(
      {
        message: error.issues[0]?.message || "Verifique os dados informados.",
        errors: error.flatten().fieldErrors,
      },
      400,
    );
  if (error instanceof AppError) return json({ message: error.message }, error.status);
  if (error instanceof Error && error.message.includes("appointment_overlap"))
    return json({ message: "Esse horário acabou de ser ocupado. Escolha outro." }, 409);
  console.error("Falha na API:", error instanceof Error ? error.name : "UnknownError");
  return json({ message: "Não foi possível concluir a operação. Tente novamente." }, 500);
}
