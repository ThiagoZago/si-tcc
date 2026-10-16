import type { Metadata } from "next";
import { listBusinesses } from "@/server/modules/businesses";
import { BookingFlow } from "@/features/booking/screens/booking-flow";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Agende seu horário" };
export default async function BookingPage({ searchParams }: PageProps<"/agendar">) {
  const { barbearia } = await searchParams;
  return (
    <BookingFlow
      businesses={listBusinesses()}
      initialBusiness={typeof barbearia === "string" ? barbearia : undefined}
    />
  );
}
