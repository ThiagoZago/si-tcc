"use client";
import { DAYS } from "@/shared/format";
import type { Availability } from "@/shared/types";

export function HoursEditor({
  value,
  onChange,
}: {
  value: Availability;
  onChange: (value: Availability) => void;
}) {
  const order = [1, 2, 3, 4, 5, 6, 0];
  function update(index: number, field: string, input: string | boolean) {
    onChange(value.map((day, i) => (i === index ? { ...day, [field]: input } : day)));
  }
  return (
    <div className="hours-editor">
      <div className="hours-heading">
        <span>Dia da semana</span>
        <span>Expediente</span>
        <span>
          Pausa <small>(opcional)</small>
        </span>
      </div>
      {order.map((index) => {
        const day = value[index];
        return (
          <div className={`hours-row ${!day.active ? "hours-inactive" : ""}`} key={index}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={day.active}
                onChange={(e) => update(index, "active", e.target.checked)}
              />
              {DAYS[index]}
            </label>
            <div>
              <input
                type="time"
                aria-label={`Início ${DAYS[index]}`}
                value={day.start}
                disabled={!day.active}
                onChange={(e) => update(index, "start", e.target.value)}
                required={day.active}
              />
              <span>–</span>
              <input
                type="time"
                aria-label={`Fim ${DAYS[index]}`}
                value={day.end}
                disabled={!day.active}
                onChange={(e) => update(index, "end", e.target.value)}
                required={day.active}
              />
            </div>
            <div>
              <input
                type="time"
                aria-label={`Pausa início ${DAYS[index]}`}
                value={day.breakStart}
                disabled={!day.active}
                onChange={(e) => update(index, "breakStart", e.target.value)}
              />
              <span>–</span>
              <input
                type="time"
                aria-label={`Pausa fim ${DAYS[index]}`}
                value={day.breakEnd}
                disabled={!day.active}
                onChange={(e) => update(index, "breakEnd", e.target.value)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
