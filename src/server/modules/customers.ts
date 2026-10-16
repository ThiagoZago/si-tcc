import "server-only";
import { randomUUID } from "node:crypto";
import { all, one, run } from "@/server/db/connection";
import { AppError } from "@/server/errors";
import type { Customer } from "@/shared/types";
import type { CustomerInput } from "@/shared/validation";

export function listCustomers(businessId: string) {
  return all<Customer>(
    `SELECT c.id, c.business_id AS businessId, c.name, c.phone, c.email, c.notes, c.created_at AS createdAt, COUNT(CASE WHEN a.status='completed' THEN 1 END) AS visits, COALESCE(SUM(CASE WHEN a.status='completed' THEN a.price ELSE 0 END),0) AS totalSpent, MAX(CASE WHEN a.status='completed' THEN a.date END) AS lastVisit FROM customers c LEFT JOIN appointments a ON a.customer_id=c.id WHERE c.business_id=? GROUP BY c.id ORDER BY c.name`,
    businessId,
  );
}
export function customerByPhone(businessId: string, phone: string) {
  return one<{ id: string }>(
    "SELECT id FROM customers WHERE business_id=? AND phone=?",
    businessId,
    phone,
  );
}
export function saveCustomer(businessId: string, data: CustomerInput, id?: string) {
  if (id && !one("SELECT id FROM customers WHERE id=? AND business_id=?", id, businessId))
    throw new AppError(404, "Cliente não encontrado.");
  const existing = customerByPhone(businessId, data.phone);
  if (existing && existing.id !== id)
    throw new AppError(409, "Já existe um cliente com este telefone.");
  const customerId = id ?? randomUUID();
  if (id)
    run(
      "UPDATE customers SET name=?,phone=?,email=?,notes=? WHERE id=? AND business_id=?",
      data.name,
      data.phone,
      data.email,
      data.notes,
      customerId,
      businessId,
    );
  else
    run(
      "INSERT INTO customers(id,business_id,name,phone,email,notes) VALUES(?,?,?,?,?,?)",
      customerId,
      businessId,
      data.name,
      data.phone,
      data.email,
      data.notes,
    );
  return customerId;
}
