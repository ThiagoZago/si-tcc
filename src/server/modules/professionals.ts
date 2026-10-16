import "server-only";
import { randomUUID } from "node:crypto";
import { all, one, run } from "@/server/db/connection";
import { AppError } from "@/server/errors";
import type { Professional } from "@/shared/types";
import type { ProfessionalInput } from "@/shared/validation";

const professionalSelect =
  "SELECT id, business_id AS businessId, name, role, bio, color, active, availability, exceptions FROM professionals";
type RawProfessional = Omit<Professional, "availability" | "exceptions" | "active"> & {
  availability: string;
  exceptions: string;
  active: number;
};

export function listProfessionals(businessId: string, onlyActive = false) {
  return all<RawProfessional>(
    `${professionalSelect} WHERE business_id=? ${onlyActive ? "AND active=1" : ""} ORDER BY name`,
    businessId,
  ).map((p) => ({
    ...p,
    active: !!p.active,
    availability: JSON.parse(p.availability),
    exceptions: JSON.parse(p.exceptions),
  })) as Professional[];
}
export function saveProfessional(businessId: string, data: ProfessionalInput, id?: string) {
  if (id && !one("SELECT id FROM professionals WHERE id=? AND business_id=?", id, businessId))
    throw new AppError(404, "Profissional não encontrado.");
  const key = id ?? randomUUID();
  const values = [
    data.name,
    data.role,
    data.bio,
    data.color,
    Number(data.active),
    JSON.stringify(data.availability),
    JSON.stringify(data.exceptions),
  ];
  if (id)
    run(
      "UPDATE professionals SET name=?,role=?,bio=?,color=?,active=?,availability=?,exceptions=? WHERE id=? AND business_id=?",
      ...values,
      key,
      businessId,
    );
  else
    run(
      "INSERT INTO professionals(name,role,bio,color,active,availability,exceptions,id,business_id) VALUES(?,?,?,?,?,?,?,?,?)",
      ...values,
      key,
      businessId,
    );
  return key;
}
export function archiveProfessional(businessId: string, id: string) {
  if (
    !run("UPDATE professionals SET active=0 WHERE id=? AND business_id=?", id, businessId).changes
  )
    throw new AppError(404, "Registro não encontrado.");
}
