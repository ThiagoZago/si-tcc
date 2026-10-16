import "server-only";
import { AppError } from "@/server/errors";
import { requireBusiness } from "./businesses";
import { listProfessionals } from "./professionals";
import { listServices } from "./services";
import type { Catalog } from "@/shared/types";

export function catalog(businessId: string): Catalog {
  const business = requireBusiness(businessId);
  return {
    business,
    services: listServices(businessId, true),
    professionals: listProfessionals(businessId, true),
  };
}
export function bookable(businessId: string, professionalId: string, serviceId: string) {
  const c = catalog(businessId);
  const professional = c.professionals.find((p) => p.id === professionalId);
  const service = c.services.find((s) => s.id === serviceId);
  if (!professional || !service || !service.professionalIds.includes(professionalId))
    throw new AppError(400, "Esse serviço não está disponível com o profissional selecionado.");
  return { business: c.business, professional, service };
}
