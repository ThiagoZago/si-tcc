import { z } from "zod";
import { localDate, addDays } from "@/shared/format";

const name = z.string().trim().min(2, "Informe pelo menos 2 caracteres.").max(100);
const email = z.email("Informe um e-mail válido.").trim().toLowerCase().max(254);
export const phoneSchema = z
  .string()
  .transform((s) => s.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, ""))
  .pipe(z.string().regex(/^[1-9]{2}[2-9]\d{7,8}$/, "Informe um telefone brasileiro com DDD."));
export const passwordSchema = z
  .string()
  .min(10, "A senha deve ter pelo menos 10 caracteres.")
  .max(128)
  .regex(/[a-zA-Z]/, "Inclua uma letra.")
  .regex(/[0-9]/, "Inclua um número.");
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário inválido.");
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((s) => {
    const d = new Date(`${s}T12:00:00Z`);
    return !Number.isNaN(d.valueOf()) && d.toISOString().slice(0, 10) === s;
  }, "Data inválida.");
export const futureDateSchema = dateSchema.refine(
  (s) => s >= localDate() && s <= addDays(localDate(), 90),
  "Escolha uma data entre hoje e os próximos 90 dias.",
);
const hours = z
  .object({
    active: z.boolean(),
    start: time,
    end: time,
    breakStart: z.union([time, z.literal("")]),
    breakEnd: z.union([time, z.literal("")]),
  })
  .refine((h) => !h.active || h.start < h.end, "O fim deve ser depois do início.")
  .refine(
    (h) =>
      !h.active ||
      (!h.breakStart && !h.breakEnd) ||
      (!!h.breakStart &&
        !!h.breakEnd &&
        h.breakStart < h.breakEnd &&
        h.breakStart >= h.start &&
        h.breakEnd <= h.end),
    "O intervalo deve estar dentro do expediente.",
  );
export const availabilitySchema = z.array(hours).length(7);
export const loginSchema = z.object({ email, password: z.string().min(1).max(128) });
export const registerSchema = z.object({
  name,
  email,
  password: passwordSchema,
  businessName: name,
  consent: z.literal(true, "Aceite os termos para continuar."),
});
export const businessSchema = z.object({
  name,
  description: z.string().trim().max(1000),
  phone: phoneSchema,
  email,
  address: z.string().trim().min(3).max(250),
  city: z.string().trim().min(2).max(100),
  hours: availabilitySchema,
});
export const serviceSchema = z.object({
  name,
  description: z.string().trim().max(500),
  price: z.number().int().min(0).max(1000000),
  duration: z.number().int().min(15).max(240).multipleOf(15),
  active: z.boolean(),
  professionalIds: z
    .array(z.string().min(1))
    .min(1, "Selecione pelo menos um profissional.")
    .max(100),
});
export const professionalSchema = z.object({
  name,
  role: name,
  bio: z.string().trim().max(500),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  active: z.boolean(),
  availability: availabilitySchema,
  exceptions: z.array(dateSchema).max(365),
});
export const bookingSchema = z.object({
  businessId: z.string().min(1),
  serviceId: z.string().min(1),
  professionalId: z.string().min(1),
  date: futureDateSchema,
  time,
  customerName: name,
  customerPhone: phoneSchema,
  customerEmail: z.union([email, z.literal("")]).default(""),
  notes: z.string().trim().max(500).default(""),
  consent: z.literal(true, "Autorize o uso dos dados para seu agendamento."),
});
export const waitlistSchema = bookingSchema.omit({ time: true, customerEmail: true, notes: true });
export const customerSchema = z.object({
  name,
  phone: phoneSchema,
  email: z.union([email, z.literal("")]),
  notes: z.string().trim().max(1000),
});
export const accountSchema = z.object({ name });
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: passwordSchema,
});
export const statusSchema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled", "no_show"]),
});
export const waitlistStatusSchema = z.object({
  status: z.enum(["waiting", "contacted", "closed"]),
});
export const rescheduleSchema = z.object({ date: futureDateSchema, time });
export type RegisterInput = z.infer<typeof registerSchema>;
export type BusinessInput = z.infer<typeof businessSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type ProfessionalInput = z.infer<typeof professionalSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type WaitlistInput = z.infer<typeof waitlistSchema>;
export type WaitlistStatus = z.infer<typeof waitlistStatusSchema>["status"];
