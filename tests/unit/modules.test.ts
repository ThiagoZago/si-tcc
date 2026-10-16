import { before, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { database, run, one } from "@/server/db/connection";
import { seedDemo } from "@/server/demo";
import { AppError } from "@/server/errors";
import { listBusinesses } from "@/server/modules/businesses";
import { listServices, saveService } from "@/server/modules/services";
import { listProfessionals } from "@/server/modules/professionals";
import { changeAppointmentStatus } from "@/server/modules/appointments";
import {
  availableSlots,
  createBooking,
  cancelBooking,
  rescheduleBooking,
  managedAppointment,
} from "@/server/modules/bookings";
import { localDate, addDays } from "@/shared/format";
import { randomToken, tokenHash } from "@/server/security/crypto";

process.env.DATABASE_PATH = ":memory:";
process.env.ENABLE_DEMO = "false";
let fixture: {
  businessId: string;
  professionalId: string;
  serviceId: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string;
  consent: true;
};
before(() => {
  database();
  seedDemo();
  const business = listBusinesses()[0];
  const professional = listProfessionals(business.id)[0];
  const service = listServices(business.id).find((s) => s.duration === 60)!;
  let date = addDays(localDate(), 10);
  if (new Date(`${date}T12:00:00Z`).getUTCDay() === 0) date = addDays(date, 1);
  fixture = {
    businessId: business.id,
    professionalId: professional.id,
    serviceId: service.id,
    date,
    time: "09:00",
    customerName: "Cliente teste",
    customerPhone: "11987654321",
    customerEmail: "",
    notes: "",
    consent: true,
  };
});
beforeEach(() => {
  run("DELETE FROM appointments");
});
test("reserva e remove o intervalo inteiro da disponibilidade", () => {
  const booking = createBooking(fixture);
  const slots = availableSlots(
    fixture.businessId,
    fixture.professionalId,
    fixture.serviceId,
    fixture.date,
  );
  assert.ok(!slots.includes("09:30"));
  assert.equal(managedAppointment(booking.manageToken).duration, 60);
});
test("duas reservas no mesmo horário geram conflito", () => {
  createBooking(fixture);
  assert.throws(
    () => createBooking(fixture),
    (e) => e instanceof AppError && e.status === 409,
  );
});
test("trigger do banco impede sobreposição quando a validação é contornada", () => {
  const booking = createBooking(fixture);
  const row = one<{ customer: string }>(
    "SELECT customer_id AS customer FROM appointments WHERE id=?",
    booking.id,
  )!;
  assert.throws(
    () =>
      run(
        "INSERT INTO appointments(id,business_id,customer_id,professional_id,service_id,date,start_minutes,duration,price,service_name,professional_name,manage_hash) VALUES(?,?,?,?,?,?,?,30,1000,'Teste','Teste',?)",
        randomUUID(),
        fixture.businessId,
        row.customer,
        fixture.professionalId,
        fixture.serviceId,
        fixture.date,
        570,
        tokenHash(randomToken()),
      ),
    /appointment_overlap/,
  );
});
test("cancelamento libera o horário e preserva o histórico", () => {
  const booking = createBooking(fixture);
  cancelBooking(booking.manageToken);
  assert.ok(
    availableSlots(
      fixture.businessId,
      fixture.professionalId,
      fixture.serviceId,
      fixture.date,
    ).includes("09:00"),
  );
  assert.equal(managedAppointment(booking.manageToken).status, "cancelled");
});
test("remarcação preserva duração e preço da reserva", () => {
  const booking = createBooking(fixture);
  run("UPDATE services SET duration=30,price=10000 WHERE id=?", fixture.serviceId);
  rescheduleBooking(booking.manageToken, fixture.date, "10:00");
  const appointment = managedAppointment(booking.manageToken);
  assert.equal(appointment.duration, 60);
  assert.equal(appointment.price, 8500);
  run("UPDATE services SET duration=60,price=8500 WHERE id=?", fixture.serviceId);
});
test("um negócio não pode alterar serviços ou agendamentos de outro", () => {
  const booking = createBooking(fixture);
  assert.throws(
    () => changeAppointmentStatus("outro-negocio", booking.id, "cancelled"),
    (e) => e instanceof AppError && e.status === 404,
  );
  const service = listServices(fixture.businessId).find((s) => s.id === fixture.serviceId)!;
  assert.throws(
    () => saveService("outro-negocio", service, service.id),
    (e) => e instanceof AppError && e.status === 404,
  );
});
test("status final não pode ser reaberto", () => {
  const booking = createBooking(fixture);
  changeAppointmentStatus(fixture.businessId, booking.id, "completed");
  assert.throws(
    () => changeAppointmentStatus(fixture.businessId, booking.id, "confirmed"),
    (e) => e instanceof AppError && e.status === 409,
  );
});
test("link inválido não revela informações do agendamento", () => {
  createBooking(fixture);
  assert.throws(
    () => managedAppointment(randomToken()),
    (e) => e instanceof AppError && e.status === 404,
  );
});
test("nova reserva não expõe o cadastro de um cliente com o mesmo telefone", () => {
  run(
    "UPDATE customers SET name='Nome privado da ficha' WHERE business_id=? AND phone=?",
    fixture.businessId,
    fixture.customerPhone,
  );
  const booking = createBooking({ ...fixture, customerName: "Nome informado na reserva" });
  assert.equal(managedAppointment(booking.manageToken).customerName, "Nome informado na reserva");
});
test("registros do banco podem ser serializados pelo React", () => {
  const row = one("SELECT id,name FROM users LIMIT 1");
  assert.equal(Object.getPrototypeOf(row), Object.prototype);
});
