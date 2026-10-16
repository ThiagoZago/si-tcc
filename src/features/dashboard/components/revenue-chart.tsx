"use client";
import { money, localDate, displayDate } from "@/shared/format";

export function RevenueChart({ days, values }: { days: string[]; values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="revenue-chart" aria-label="Faturamento por dia">
      <div className="chart-axis">
        <span>{money(max)}</span>
        <span>{money(max / 2)}</span>
        <span>R$ 0</span>
      </div>
      <div className="chart-bars">
        {days.map((day, i) => (
          <div key={day} className="chart-column">
            <div className="chart-bar-track">
              <div
                className={`chart-bar ${day === localDate() ? "chart-bar-today" : ""}`}
                style={{ height: `${Math.max((values[i] / max) * 100, values[i] ? 3 : 0)}%` }}
                title={`${displayDate(day)}: ${money(values[i])}`}
              >
                <span>{money(values[i])}</span>
              </div>
            </div>
            <small>
              {days.length <= 7
                ? displayDate(day, { weekday: "short" }).replace(".", "")
                : day.slice(8)}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
