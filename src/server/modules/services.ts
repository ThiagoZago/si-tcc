import "server-only";
import { randomUUID } from "node:crypto";
import { all, one, run, transaction } from "@/server/db/connection";
import { AppError } from "@/server/errors";
import type { Service } from "@/shared/types";
import type { ServiceInput } from "@/shared/validation";

const serviceSelect =
  "SELECT id, business_id AS businessId, name, description, price, duration, active FROM services";

export function listServices(businessId: string, onlyActive = false): Service[] {
  return all<Omit<Service, "professionalIds" | "active"> & { active: number }>(
    `${serviceSelect} WHERE business_id=? ${onlyActive ? "AND active=1" : ""} ORDER BY name`,
    businessId,
  ).map((s) => ({
    ...s,
    active: !!s.active,
    professionalIds: all<{ id: string }>(
      "SELECT professional_id AS id FROM service_professionals WHERE service_id=?",
      s.id,
    ).map((p) => p.id),
  }));
}
export function saveService(businessId: string, data: ServiceInput, id?: string) {
  if (id && !one("SELECT id FROM services WHERE id=? AND business_id=?", id, businessId))
    throw new AppError(404, "Serviço não encontrado.");
  for (const professionalId of data.professionalIds)
    if (
      !one(
        "SELECT id FROM professionals WHERE id=? AND business_id=? AND active=1",
        professionalId,
        businessId,
      )
    )
      throw new AppError(400, "Selecione profissionais ativos do seu estabelecimento.");
  return transaction(() => {
    const key = id ?? randomUUID();
    if (id)
      run(
        "UPDATE services SET name=?,description=?,price=?,duration=?,active=? WHERE id=? AND business_id=?",
        data.name,
        data.description,
        data.price,
        data.duration,
        Number(data.active),
        key,
        businessId,
      );
    else
      run(
        "INSERT INTO services(id,business_id,name,description,price,duration,active) VALUES(?,?,?,?,?,?,?)",
        key,
        businessId,
        data.name,
        data.description,
        data.price,
        data.duration,
        Number(data.active),
      );
    run("DELETE FROM service_professionals WHERE service_id=?", key);
    for (const p of new Set(data.professionalIds))
      run("INSERT INTO service_professionals VALUES(?,?)", key, p);
    return key;
  });
}
export function archiveService(businessId: string, id: string) {
  if (!run("UPDATE services SET active=0 WHERE id=? AND business_id=?", id, businessId).changes)
    throw new AppError(404, "Registro não encontrado.");
}
