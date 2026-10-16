import { test } from "node:test";
import assert from "node:assert/strict";
import { defaultAvailability, generateSlots, overlaps } from "@/shared/availability";
import { dateSchema, professionalSchema, bookingSchema } from "@/shared/validation";
import { money, localDate, localTime, csvCell, displayDate, addDays } from "@/shared/format";

const now = new Date("2026-10-14T14:00:00Z");
const base = {
  date: "2026-10-15",
  duration: 30,
  availability: defaultAvailability(),
  businessHours: defaultAvailability(),
  now,
};
test("gera slots a cada 15 minutos e respeita o expediente", () => {
  const slots = generateSlots(base);
  assert.equal(slots[0], "09:00");
  assert.equal(slots.at(-1), "18:30");
  assert.ok(slots.includes("09:15"));
});
test("remove intervalos que cruzam o almoço", () => {
  const slots = generateSlots({ ...base, duration: 60 });
  assert.ok(!slots.includes("11:15"));
  assert.ok(!slots.includes("12:45"));
  assert.ok(slots.includes("11:00"));
  assert.ok(slots.includes("13:00"));
});
test("bloqueia sobreposição mesmo com horários de início diferentes", () => {
  const slots = generateSlots({ ...base, occupied: [{ startMinutes: 600, duration: 60 }] });
  assert.ok(!slots.includes("09:45"));
  assert.ok(!slots.includes("10:30"));
  assert.ok(slots.includes("09:30"));
  assert.ok(slots.includes("11:00"));
});
test("permite atendimentos adjacentes", () => {
  assert.equal(overlaps(570, 30, { startMinutes: 600, duration: 60 }), false);
  assert.equal(overlaps(660, 30, { startMinutes: 600, duration: 60 }), false);
});
test("aplica o expediente da empresa junto à disponibilidade do profissional", () => {
  const hours = defaultAvailability();
  hours[4] = { ...hours[4], start: "10:00", end: "15:00" };
  const slots = generateSlots({ ...base, businessHours: hours });
  assert.equal(slots[0], "10:00");
  assert.equal(slots.at(-1), "14:30");
});
test("respeita datas bloqueadas e dias sem expediente", () => {
  assert.deepEqual(generateSlots({ ...base, exceptions: [base.date] }), []);
  assert.deepEqual(generateSlots({ ...base, date: "2026-10-18" }), []);
});
test("rejeita durações zero e datas passadas sem loop infinito", () => {
  assert.deepEqual(generateSlots({ ...base, duration: 0 }), []);
  assert.deepEqual(generateSlots({ ...base, date: "2026-10-13" }), []);
});
test("remove horários passados no fuso de Brasília", () => {
  const slots = generateSlots({ ...base, date: "2026-10-14" });
  assert.equal(slots[0], "11:15");
  assert.equal(localDate(new Date("2026-10-15T01:30:00Z")), "2026-10-14");
  assert.equal(localTime(now), "11:00");
});
test("valida datas reais, inclusive fevereiro", () => {
  assert.equal(dateSchema.safeParse("2026-02-30").success, false);
  assert.equal(dateSchema.safeParse("2028-02-29").success, true);
  assert.equal(dateSchema.safeParse("2026-99-01").success, false);
});
test("valida intervalos e expediente no servidor", () => {
  const availability = defaultAvailability();
  availability[1].end = "08:00";
  assert.equal(
    professionalSchema.safeParse({
      name: "Rafael",
      role: "Barbeiro",
      bio: "",
      color: "#b92b32",
      active: true,
      availability,
      exceptions: [],
    }).success,
    false,
  );
});
test("consentimento é obrigatório", () => {
  const input = {
    businessId: "test",
    serviceId: "test",
    professionalId: "test",
    date: addDays(localDate(), 1),
    time: "09:00",
    customerName: "Cliente teste",
    customerPhone: "11987654321",
    consent: true,
  };
  assert.equal(bookingSchema.safeParse(input).success, true);
  assert.equal(bookingSchema.safeParse({ ...input, consent: false }).success, false);
});
test("limpar o campo de data não quebra a interface", () => {
  assert.equal(displayDate(""), "—");
  assert.equal(displayDate("data-invalida"), "—");
  assert.match(addDays("", 1), /^\d{4}-\d{2}-\d{2}$/);
});
test("formata centavos sem imprecisão na persistência e protege exportação CSV", () => {
  assert.ok(money(5500).includes("55,00"));
  assert.equal(csvCell("=SUM(A1:A2)"), '"\'=SUM(A1:A2)"');
  assert.equal(csvCell('a"b'), '"a""b"');
});
