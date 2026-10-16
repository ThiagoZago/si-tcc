import "server-only";
import { randomUUID } from "node:crypto";
import { all, run, transaction } from "@/server/db/connection";
import { AppError } from "@/server/errors";
import { TOKEN_LENGTH, randomToken, tokenHash } from "@/server/security/crypto";
import { generateSlots } from "@/shared/availability";
import { minutes, localDate, localTime } from "@/shared/format";
import { bookingSchema, futureDateSchema, type BookingInput } from "@/shared/validation";
import type { Appointment } from "@/shared/types";
import { appointmentByManageHash } from "./appointments";
import { requireBusiness } from "./businesses";
import { bookable } from "./catalog";
import { customerByPhone } from "./customers";

export function availableSlots(
  businessId: string,
  professionalId: string,
  serviceId: string,
  date: string,
  excludeId = "",
  duration?: number,
) {
  futureDateSchema.parse(date);
  const { business, professional, service } = bookable(businessId, professionalId, serviceId);
  const occupied = all<{ startMinutes: number; duration: number }>(
    "SELECT start_minutes AS startMinutes,duration FROM appointments WHERE professional_id=? AND date=? AND id<>? AND status NOT IN ('cancelled','no_show')",
    professionalId,
    date,
    excludeId,
  );
  return generateSlots({
    date,
    duration: duration ?? service.duration,
    availability: professional.availability,
    businessHours: business.hours,
    exceptions: professional.exceptions,
    occupied,
  });
}
export function createBooking(input: BookingInput) {
  const data = bookingSchema.parse(input);
  const manageToken = randomToken();
  return transaction(() => {
    const { service, professional } = bookable(
      data.businessId,
      data.professionalId,
      data.serviceId,
    );
    if (
      !availableSlots(data.businessId, data.professionalId, data.serviceId, data.date).includes(
        data.time,
      )
    )
      throw new AppError(409, "Esse horário acabou de ser ocupado. Escolha outro horário.");
    let customer = customerByPhone(data.businessId, data.customerPhone);
    if (!customer) {
      customer = { id: randomUUID() };
      run(
        "INSERT INTO customers(id,business_id,name,phone,email) VALUES(?,?,?,?,?)",
        customer.id,
        data.businessId,
        data.customerName,
        data.customerPhone,
        data.customerEmail,
      );
    }
    const id = randomUUID();
    run(
      "INSERT INTO appointments(id,business_id,customer_id,professional_id,service_id,date,start_minutes,duration,price,notes,service_name,professional_name,manage_hash,customer_name,customer_phone) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      id,
      data.businessId,
      customer.id,
      professional.id,
      service.id,
      data.date,
      minutes(data.time),
      service.duration,
      service.price,
      data.notes,
      service.name,
      professional.name,
      tokenHash(manageToken),
      data.customerName,
      data.customerPhone,
    );
    return { id, manageToken, message: "Agendamento confirmado!" };
  });
}
export function managedAppointment(token: string) {
  if (token.length !== TOKEN_LENGTH) throw new AppError(404, "Agendamento não encontrado.");
  const appointment = appointmentByManageHash(tokenHash(token));
  if (!appointment) throw new AppError(404, "Agendamento não encontrado.");
  return appointment;
}
export function managedBooking(token: string) {
  const appointment = managedAppointment(token);
  return {
    appointment,
    business: requireBusiness(appointment.businessId),
    canManage: canManage(appointment),
  };
}
export function findManagedBooking(token: string) {
  try {
    return managedBooking(token);
  } catch (error) {
    if (error instanceof AppError && error.status === 404) return null;
    throw error;
  }
}
function canManage(a: Appointment) {
  return (
    ["pending", "confirmed"].includes(a.status) &&
    (a.date > localDate() || (a.date === localDate() && a.time > localTime()))
  );
}
export function rescheduleSlots(token: string, date: string | null) {
  const a = managedAppointment(token);
  if (!canManage(a)) throw new AppError(409, "Este agendamento não pode mais ser alterado.");
  return availableSlots(
    a.businessId,
    a.professionalId,
    a.serviceId,
    futureDateSchema.parse(date),
    a.id,
    a.duration,
  );
}
export function cancelBooking(token: string) {
  const a = managedAppointment(token);
  if (!canManage(a))
    throw new AppError(
      409,
      "Este agendamento não pode mais ser cancelado pelo link. Entre em contato com a barbearia.",
    );
  run("UPDATE appointments SET status='cancelled' WHERE id=?", a.id);
}
export function rescheduleBooking(token: string, date: string, time: string) {
  const a = managedAppointment(token);
  if (!canManage(a)) throw new AppError(409, "Este agendamento não pode mais ser alterado.");
  transaction(() => {
    if (
      !availableSlots(a.businessId, a.professionalId, a.serviceId, date, a.id, a.duration).includes(
        time,
      )
    )
      throw new AppError(409, "Horário indisponível.");
    run("UPDATE appointments SET date=?,start_minutes=? WHERE id=?", date, minutes(time), a.id);
  });
}
