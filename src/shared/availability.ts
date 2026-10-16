import type { Availability } from "@/shared/types";
import { minutes, timeOf, localDate, localTime } from "@/shared/format";

export type Occupied = { startMinutes: number; duration: number };
export function overlaps(start: number, duration: number, other: Occupied) {
  return start < other.startMinutes + other.duration && start + duration > other.startMinutes;
}
export function generateSlots({
  date,
  duration,
  availability,
  businessHours,
  exceptions = [],
  occupied = [],
  now = new Date(),
}: {
  date: string;
  duration: number;
  availability: Availability;
  businessHours: Availability;
  exceptions?: string[];
  occupied?: Occupied[];
  now?: Date;
}) {
  if (
    !Number.isInteger(duration) ||
    duration < 15 ||
    duration > 240 ||
    exceptions.includes(date) ||
    date < localDate(now)
  )
    return [];
  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
  const professional = availability[weekday];
  const business = businessHours[weekday];
  if (!professional?.active || !business?.active) return [];
  const start = Math.max(minutes(professional.start), minutes(business.start));
  const end = Math.min(minutes(professional.end), minutes(business.end));
  const breaks = [professional, business]
    .filter((h) => h.breakStart && h.breakEnd)
    .map((h) => ({
      startMinutes: minutes(h.breakStart),
      duration: minutes(h.breakEnd) - minutes(h.breakStart),
    }));
  const slots: string[] = [];
  for (let cursor = start; cursor + duration <= end; cursor += 15) {
    if (date === localDate(now) && cursor <= minutes(localTime(now))) continue;
    if ([...breaks, ...occupied].some((o) => overlaps(cursor, duration, o))) continue;
    slots.push(timeOf(cursor));
  }
  return slots;
}
export function defaultAvailability() {
  return Array.from({ length: 7 }, (_, i) => ({
    active: i !== 0,
    start: "09:00",
    end: i === 6 ? "16:00" : "19:00",
    breakStart: "12:00",
    breakEnd: "13:00",
  }));
}
