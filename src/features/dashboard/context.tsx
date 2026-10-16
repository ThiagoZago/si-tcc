"use client";
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { DashboardData } from "@/shared/types";
import { api } from "@/lib/api-client";

const DashboardContext = createContext<{
  data: DashboardData;
  refresh: () => Promise<void>;
} | null>(null);
export function DashboardProvider({
  initial,
  children,
}: {
  initial: DashboardData;
  children: ReactNode;
}) {
  const [data, setData] = useState(initial);
  const refresh = useCallback(async () => {
    setData(await api<DashboardData>("dashboard/data"));
  }, []);
  return (
    <DashboardContext.Provider value={{ data, refresh }}>{children}</DashboardContext.Provider>
  );
}
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("DashboardProvider ausente.");
  return context;
}
