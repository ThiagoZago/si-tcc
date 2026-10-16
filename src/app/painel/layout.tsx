import type { Metadata } from "next";
import { requirePageUser } from "@/server/auth/session";
import { requireBusinessByOwner } from "@/server/modules/businesses";
import { dashboardData } from "@/server/modules/dashboard";
import { DashboardProvider } from "@/features/dashboard/context";
import { DashboardShell } from "@/features/dashboard/components/shell";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Painel da barbearia",
  robots: { index: false, follow: false },
};
export default async function DashboardLayout({ children }: LayoutProps<"/painel">) {
  const user = await requirePageUser();
  const business = requireBusinessByOwner(user.id);
  return (
    <DashboardProvider initial={dashboardData(user, business)}>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  );
}
