import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/features/auth/screens/auth-form";
import { currentUser } from "@/server/auth/session";
import { demoEnabled } from "@/server/config";
export const metadata: Metadata = { title: "Acesse sua conta", robots: { index: false } };
export default async function LoginPage() {
  if (await currentUser()) redirect("/painel");
  return <AuthForm demo={demoEnabled()} />;
}
