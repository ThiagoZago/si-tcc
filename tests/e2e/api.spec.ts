import { test, expect, type APIRequestContext } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { defaultAvailability } from "@/shared/availability";
import { localDate, addDays } from "@/shared/format";
import type { DashboardData } from "@/shared/types";

let owner: APIRequestContext;
let outsider: APIRequestContext;
let publicApi: APIRequestContext;
let data: DashboardData;
let professionalId: string;
let serviceId: string;
let token: string;
let appointmentId: string;
const suffix = randomUUID();
const email = `teste-${suffix}@example.com`;
const password = "TesteSeguro2026!";
let date = addDays(localDate(), 15);
if (new Date(`${date}T12:00:00Z`).getUTCDay() === 0) date = addDays(date, 1);
const booking = () => ({
  businessId: data.business.id,
  professionalId,
  serviceId,
  date,
  time: "09:00",
  customerName: "Cliente Fictício",
  customerPhone: "11987654321",
  customerEmail: "",
  notes: "Teste automatizado",
  consent: true,
});

test.beforeAll(async ({ playwright, baseURL }) => {
  owner = await playwright.request.newContext({ baseURL });
  outsider = await playwright.request.newContext({ baseURL });
  publicApi = await playwright.request.newContext({ baseURL });
  expect(
    (
      await owner.post("/api/auth/register", {
        data: {
          name: "Gestor Teste",
          businessName: `Barbearia Teste ${suffix}`,
          email,
          password,
          consent: true,
        },
      })
    ).status(),
  ).toBe(201);
  expect(
    (
      await outsider.post("/api/auth/register", {
        data: {
          name: "Outro Gestor",
          businessName: `Outro Negócio ${suffix}`,
          email: `outro-${email}`,
          password,
          consent: true,
        },
      })
    ).status(),
  ).toBe(201);
  data = await (await owner.get("/api/dashboard/data")).json();
  expect(
    (
      await owner.patch("/api/dashboard/business", {
        data: {
          name: data.business.name,
          description: "Barbearia de teste",
          phone: "11912345678",
          email,
          address: "Rua de Teste, 100",
          city: "São Paulo, SP",
          hours: defaultAvailability(),
        },
      })
    ).ok(),
  ).toBe(true);
  const prof = await owner.post("/api/dashboard/professionals", {
    data: {
      name: "Profissional Teste",
      role: "Barbeiro",
      bio: "Teste",
      color: "#b92b32",
      active: true,
      availability: defaultAvailability(),
      exceptions: [],
    },
  });
  expect(prof.status()).toBe(201);
  professionalId = (await prof.json()).id;
  const service = await owner.post("/api/dashboard/services", {
    data: {
      name: "Corte + barba",
      description: "Teste",
      price: 8500,
      duration: 60,
      active: true,
      professionalIds: [professionalId],
    },
  });
  expect(service.status()).toBe(201);
  serviceId = (await service.json()).id;
});
test.afterAll(async () => {
  await owner?.dispose();
  await outsider?.dispose();
  await publicApi?.dispose();
});

test("rotas privadas exigem sessão válida", async () => {
  expect((await publicApi.get("/api/dashboard/data")).status()).toBe(401);
  const response = await publicApi.get("/painel", { maxRedirects: 0 });
  expect(response.status()).toBe(307);
  expect(response.headers().location).toContain("/acesso");
});
test("painel renderiza os dados do banco sem erro de serialização", async () => {
  const response = await owner.get("/painel");
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain(data.business.name);
  expect(html).toContain("Olá,");
  expect(html).not.toContain("Only plain objects");
});
test("login rejeita credenciais inválidas e cookie é HttpOnly", async () => {
  expect(
    (await publicApi.post("/api/auth/login", { data: { email, password: "errada" } })).status(),
  ).toBe(401);
  const response = await owner.post("/api/auth/login", { data: { email, password } });
  expect(response.ok()).toBe(true);
  expect(response.headers()["set-cookie"]).toContain("HttpOnly");
  expect(response.headers()["set-cookie"]).toContain("SameSite=lax");
});
test("origem externa não pode executar alterações", async () => {
  expect(
    (
      await owner.patch("/api/dashboard/account", {
        headers: { Origin: "https://invasor.example" },
        data: { name: "Alteração indevida" },
      })
    ).status(),
  ).toBe(403);
});
test("ambiente sem demonstração rejeita acesso rápido", async () => {
  expect((await publicApi.post("/api/auth/demo")).status()).toBe(404);
});
test("validação de horário e consentimento ocorre no servidor", async () => {
  expect(
    (await publicApi.post("/api/bookings", { data: { ...booking(), consent: false } })).status(),
  ).toBe(400);
  expect(
    (
      await publicApi.get(
        `/api/slots?businessId=${data.business.id}&professionalId=${professionalId}&serviceId=${serviceId}&date=2026-02-30`,
      )
    ).status(),
  ).toBe(400);
});
test("reservas concorrentes resultam em uma confirmação e um conflito", async () => {
  const responses = await Promise.all([
    publicApi.post("/api/bookings", { data: booking() }),
    publicApi.post("/api/bookings", { data: booking() }),
  ]);
  expect(responses.map((r) => r.status()).sort()).toEqual([201, 409]);
  const result = await responses.find((r) => r.status() === 201)!.json();
  token = result.manageToken;
  appointmentId = result.id;
  const slots = await (
    await publicApi.get(
      `/api/slots?businessId=${data.business.id}&professionalId=${professionalId}&serviceId=${serviceId}&date=${date}`,
    )
  ).json();
  expect(slots.slots).not.toContain("09:30");
});
test("dados de um estabelecimento ficam isolados", async () => {
  const other = await (await outsider.get("/api/dashboard/data")).json();
  expect(other.appointments).toHaveLength(0);
  expect(
    (
      await outsider.patch(`/api/dashboard/appointments/${appointmentId}`, {
        data: { status: "cancelled" },
      })
    ).status(),
  ).toBe(404);
  expect((await outsider.delete(`/api/dashboard/services/${serviceId}`)).status()).toBe(404);
  expect(
    (
      await outsider.patch(
        `/api/dashboard/customers/${(await (await owner.get("/api/dashboard/data")).json()).customers[0].id}`,
        { data: { name: "Intruso", phone: "11912345678", email: "", notes: "" } },
      )
    ).status(),
  ).toBe(404);
});
test("link exclusivo permite consulta e remarcação", async () => {
  const response = await publicApi.get(`/api/manage/${token}`);
  expect(response.ok()).toBe(true);
  expect((await response.json()).appointment.price).toBe(8500);
  expect(
    (await publicApi.patch(`/api/manage/${token}`, { data: { date, time: "10:00" } })).ok(),
  ).toBe(true);
  expect((await (await publicApi.get(`/api/manage/${token}`)).json()).appointment.time).toBe(
    "10:00",
  );
  expect((await publicApi.get(`/api/manage/${"A".repeat(43)}`)).status()).toBe(404);
  expect(
    (
      await publicApi.patch(`/api/manage/${"A".repeat(43)}`, { data: { date: "invalida" } })
    ).status(),
  ).toBe(404);
  expect((await publicApi.get(`/api/manage/${"A".repeat(43)}/slots`)).status()).toBe(404);
});
test("cancelamento libera horário e mantém registro", async () => {
  expect((await publicApi.post(`/api/manage/${token}/cancel`)).ok()).toBe(true);
  const result = await (await publicApi.get(`/api/manage/${token}`)).json();
  expect(result.appointment.status).toBe("cancelled");
  expect(result.canManage).toBe(false);
  expect(
    (await publicApi.patch(`/api/manage/${token}`, { data: { date, time: "11:00" } })).status(),
  ).toBe(409);
});
test("lista de espera persiste e evita duplicatas", async () => {
  const payload = {
    businessId: data.business.id,
    professionalId,
    serviceId,
    date,
    customerName: "Cliente da Espera",
    customerPhone: "11912345678",
    consent: true,
  };
  expect((await publicApi.post("/api/waitlist", { data: payload })).status()).toBe(201);
  expect((await publicApi.post("/api/waitlist", { data: payload })).status()).toBe(201);
  const result = await (await owner.get("/api/dashboard/data")).json();
  expect(result.waitlist).toHaveLength(1);
  expect(
    (
      await owner.patch(`/api/dashboard/waitlist/${result.waitlist[0].id}`, {
        data: { status: "contacted" },
      })
    ).ok(),
  ).toBe(true);
});
test("exportação é privada e contém dados persistidos", async () => {
  expect((await publicApi.get("/api/dashboard/export")).status()).toBe(401);
  const response = await owner.get("/api/dashboard/export");
  expect(response.headers()["content-type"]).toContain("text/csv");
  expect([...(await response.body()).subarray(0, 3)]).toEqual([0xef, 0xbb, 0xbf]);
  expect(await response.text()).toContain("Cliente Fictício");
});
test("arquivamento preserva histórico e remove catálogo público", async () => {
  expect((await owner.delete(`/api/dashboard/services/${serviceId}`)).ok()).toBe(true);
  const result = await (await publicApi.get(`/api/catalog/${data.business.id}`)).json();
  expect(result.services).toHaveLength(0);
  expect((await (await owner.get("/api/dashboard/data")).json()).appointments).toHaveLength(1);
});
test("troca de senha revoga outras sessões", async ({ playwright, baseURL }) => {
  const oldSession = await playwright.request.newContext({ baseURL });
  await oldSession.post("/api/auth/login", { data: { email, password } });
  expect(
    (
      await owner.patch("/api/dashboard/password", {
        data: { currentPassword: password, newPassword: "OutraSenhaSegura2026!" },
      })
    ).ok(),
  ).toBe(true);
  expect((await oldSession.get("/api/dashboard/data")).status()).toBe(401);
  expect((await owner.get("/api/dashboard/data")).ok()).toBe(true);
  await oldSession.dispose();
});
