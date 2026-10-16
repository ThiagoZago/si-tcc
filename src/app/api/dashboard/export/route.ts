import { privateRoute } from "@/server/http/handler";
import { csv } from "@/server/http/response";
import { appointmentsCsv } from "@/server/modules/appointments";

export const GET = privateRoute((_request, { business }) =>
  csv(appointmentsCsv(business.id), "barbapp-agendamentos.csv"),
);
