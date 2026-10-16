import "server-only";
import { all, one, run } from "@/server/db/connection";
import { AppError } from "@/server/errors";
import type { Business } from "@/shared/types";
import type { BusinessInput } from "@/shared/validation";

const businessSelect =
  "SELECT id, owner_id AS ownerId, name, slug, description, phone, email, address, city, hours, created_at AS createdAt FROM businesses";
type RawBusiness = Omit<Business, "hours"> & { hours: string };
const toBusiness = (b: RawBusiness) => ({ ...b, hours: JSON.parse(b.hours) }) as Business;

function businessById(id: string) {
  const b = one<RawBusiness>(`${businessSelect} WHERE id=?`, id);
  return b ? toBusiness(b) : undefined;
}
export function requireBusiness(id: string) {
  const business = businessById(id);
  if (!business) throw new AppError(404, "Barbearia não encontrada.");
  return business;
}
export function requireBusinessByOwner(ownerId: string) {
  const b = one<RawBusiness>(`${businessSelect} WHERE owner_id=?`, ownerId);
  if (!b) throw new AppError(404, "Estabelecimento não encontrado.");
  return toBusiness(b);
}
export function listBusinesses() {
  return all<RawBusiness>(`${businessSelect} ORDER BY name`).map(toBusiness);
}
export function searchBusinesses(query: string) {
  return listBusinesses()
    .filter((b) => b.name.toLowerCase().includes(query.toLowerCase()))
    .map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      description: b.description,
      address: b.address,
      city: b.city,
      phone: b.phone,
    }));
}
export function updateBusiness(businessId: string, ownerId: string, data: BusinessInput) {
  run(
    "UPDATE businesses SET name=?,description=?,phone=?,email=?,address=?,city=?,hours=? WHERE id=? AND owner_id=?",
    data.name,
    data.description,
    data.phone,
    data.email,
    data.address,
    data.city,
    JSON.stringify(data.hours),
    businessId,
    ownerId,
  );
}
