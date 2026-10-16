import "server-only";
import { randomUUID } from "node:crypto";
import { all, run } from "@/server/db/connection";
import { AppError } from "@/server/errors";
import type { WaitlistEntry } from "@/shared/types";
import type { WaitlistInput, WaitlistStatus } from "@/shared/validation";
import { bookable } from "./catalog";

export function listWaitlist(businessId: string) {
  return all<WaitlistEntry>(
    "SELECT w.id, w.business_id AS businessId, w.customer_name AS customerName, w.phone, w.date, w.service_id AS serviceId, s.name AS serviceName, w.professional_id AS professionalId, p.name AS professionalName, w.status, w.created_at AS createdAt FROM waitlist w JOIN services s ON s.id=w.service_id JOIN professionals p ON p.id=w.professional_id WHERE w.business_id=? ORDER BY w.date,w.created_at",
    businessId,
  );
}
export function joinWaitlist(data: WaitlistInput) {
  bookable(data.businessId, data.professionalId, data.serviceId);
  run(
    "INSERT INTO waitlist(id,business_id,customer_name,phone,date,service_id,professional_id) VALUES(?,?,?,?,?,?,?) ON CONFLICT(business_id,phone,date,service_id,professional_id) DO UPDATE SET status='waiting'",
    randomUUID(),
    data.businessId,
    data.customerName,
    data.customerPhone,
    data.date,
    data.serviceId,
    data.professionalId,
  );
}
export function updateWaitlistStatus(businessId: string, id: string, status: WaitlistStatus) {
  if (
    !run("UPDATE waitlist SET status=? WHERE id=? AND business_id=?", status, id, businessId)
      .changes
  )
    throw new AppError(404, "Registro não encontrado.");
}
