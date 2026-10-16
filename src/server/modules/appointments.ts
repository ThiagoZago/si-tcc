import "server-only";
import { all, one, run } from "@/server/db/connection";
import { AppError } from "@/server/errors";
import { csvCell, money, statusLabels, timeOf } from "@/shared/format";
import type { Appointment, AppointmentStatus } from "@/shared/types";

const appointmentSelect = `SELECT a.id, a.business_id AS businessId, a.customer_id AS customerId, a.professional_id AS professionalId, a.service_id AS serviceId, a.date, a.start_minutes AS startMinutes, a.duration, a.price, a.status, a.notes, COALESCE(NULLIF(a.customer_name,''),c.name) AS customerName, COALESCE(NULLIF(a.customer_phone,''),c.phone) AS customerPhone, a.service_name AS serviceName, a.professional_name AS professionalName, p.color AS professionalColor, a.created_at AS createdAt FROM appointments a JOIN customers c ON c.id=a.customer_id JOIN professionals p ON p.id=a.professional_id`;
const transitions: Record<AppointmentStatus, AppointmentStatus[]> = {
  pending: ["confirmed", "cancelled", "completed", "no_show"],
  confirmed: ["completed", "cancelled", "no_show"],
  completed: [],
  cancelled: [],
  no_show: [],
};

function withTime(a: Omit<Appointment, "time">): Appointment {
  return { ...a, time: timeOf(a.startMinutes) };
}
export function listAppointments(businessId: string) {
  return all<Omit<Appointment, "time">>(
    `${appointmentSelect} WHERE a.business_id=? ORDER BY a.date DESC, a.start_minutes ASC`,
    businessId,
  ).map(withTime);
}
export function appointmentByManageHash(hash: string) {
  const a = one<Omit<Appointment, "time">>(`${appointmentSelect} WHERE a.manage_hash=?`, hash);
  return a ? withTime(a) : undefined;
}
export function changeAppointmentStatus(businessId: string, id: string, status: AppointmentStatus) {
  const a = one<{ status: AppointmentStatus }>(
    "SELECT status FROM appointments WHERE id=? AND business_id=?",
    id,
    businessId,
  );
  if (!a) throw new AppError(404, "Agendamento não encontrado.");
  if (!transitions[a.status].includes(status))
    throw new AppError(409, "Essa alteração de status não é permitida.");
  run("UPDATE appointments SET status=? WHERE id=? AND business_id=?", status, id, businessId);
}
export function appointmentsCsv(businessId: string) {
  return [
    ["Data", "Hora", "Cliente", "Telefone", "Serviço", "Profissional", "Valor", "Status"],
    ...listAppointments(businessId).map((a) => [
      a.date,
      a.time,
      a.customerName,
      a.customerPhone,
      a.serviceName,
      a.professionalName,
      money(a.price),
      statusLabels[a.status],
    ]),
  ]
    .map((row) => row.map(csvCell).join(";"))
    .join("\r\n");
}
