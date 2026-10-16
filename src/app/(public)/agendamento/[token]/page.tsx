import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findManagedBooking } from "@/server/modules/bookings";
import { ManageBooking } from "@/features/booking/screens/manage-booking";
export const metadata: Metadata = {
  title: "Seu agendamento",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export const dynamic = "force-dynamic";
export default async function ManagePage({ params }: PageProps<"/agendamento/[token]">) {
  const { token } = await params;
  const booking = findManagedBooking(token);
  if (!booking) notFound();
  return (
    <ManageBooking
      token={token}
      initialAppointment={booking.appointment}
      business={booking.business}
      editable={booking.canManage}
    />
  );
}
