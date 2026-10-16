import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/features/auth/screens/auth-form";
import { currentUser } from "@/server/auth/session";
export const metadata: Metadata = { title: "Cadastre sua barbearia" };
export default async function RegisterPage() {
  if (await currentUser()) redirect("/painel");
  return <AuthForm register />;
}
