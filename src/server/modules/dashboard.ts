import "server-only";
import type { Business, DashboardData, User } from "@/shared/types";
import { listAppointments } from "./appointments";
import { listCustomers } from "./customers";
import { listProfessionals } from "./professionals";
import { listServices } from "./services";
import { listWaitlist } from "./waitlist";

export function dashboardData(user: User, business: Business): DashboardData {
  return {
    user,
    business,
    appointments: listAppointments(business.id),
    customers: listCustomers(business.id),
    services: listServices(business.id),
    professionals: listProfessionals(business.id),
    waitlist: listWaitlist(business.id),
  };
}
