"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  MapPin,
  Phone,
  Scissors,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { displayDate, money, localDate, addDays, statusLabels } from "@/shared/format";
import type { Appointment, Business } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ErrorMessage } from "@/components/ui/error-message";

export function ManageBooking({
  token,
  initialAppointment,
  business,
  editable,
}: {
  token: string;
  initialAppointment: Appointment;
  business: Business;
  editable: boolean;
}) {
  const [appointment, setAppointment] = useState(initialAppointment);
  const [canEdit, setCanEdit] = useState(editable);
  const [modal, setModal] = useState<"cancel" | "reschedule" | null>(null);
  const [date, setDate] = useState(appointment.date);
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<{ date: string; slots: string[]; error: string }>({
    date: "",
    slots: [],
    error: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (modal !== "reschedule") return;
    const controller = new AbortController();
    api<{ slots: string[] }>(`manage/${token}/slots?date=${date}`, { signal: controller.signal })
      .then((data) => setSlots({ date, slots: data.slots, error: "" }))
      .catch((err) => {
        if (err.name !== "AbortError") setSlots({ date, slots: [], error: err.message });
      });
    return () => controller.abort();
  }, [date, modal, token]);
  async function update() {
    setBusy(true);
    setError("");
    try {
      await api(`manage/${token}${modal === "cancel" ? "/cancel" : ""}`, {
        method: modal === "cancel" ? "POST" : "PATCH",
        body: modal === "reschedule" ? JSON.stringify({ date, time }) : undefined,
      });
      const result = await api<{ appointment: Appointment; canManage: boolean }>(`manage/${token}`);
      setAppointment(result.appointment);
      setCanEdit(result.canManage);
      toast.success(modal === "cancel" ? "Agendamento cancelado." : "Novo horário confirmado!");
      setModal(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function downloadCalendar() {
    const start = `${appointment.date.replaceAll("-", "")}T${appointment.time.replace(":", "")}00`;
    const endDate = new Date(`${appointment.date}T${appointment.time}:00-03:00`);
    endDate.setMinutes(endDate.getMinutes() + appointment.duration);
    const end = endDate
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z/, "Z");
    const escape = (s: string) =>
      s
        .replaceAll("\\", "\\\\")
        .replaceAll(";", "\\;")
        .replaceAll(",", "\\,")
        .replaceAll("\n", "\\n");
    const text = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//BarbApp//Agendamento//PT",
      "BEGIN:VEVENT",
      `UID:${appointment.id}@barbapp`,
      `DTSTAMP:${new Date()
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}Z/, "Z")}`,
      `DTSTART;TZID=America/Sao_Paulo:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${escape(`${appointment.serviceName} · ${business.name}`)}`,
      `LOCATION:${escape(business.address)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "meu-agendamento.ics";
    link.click();
    URL.revokeObjectURL(url);
  }
  return (
    <section className="confirmation-section">
      <div className="confirmation-card">
        <div
          className={`confirmation-icon ${appointment.status === "cancelled" ? "cancelled" : ""}`}
        >
          <CheckCircle2 size={36} strokeWidth={1.5} />
        </div>
        <div className="eyebrow">{statusLabels[appointment.status].toUpperCase()}</div>
        <h1>
          {appointment.status === "cancelled"
            ? "Até o próximo encontro."
            : appointment.status === "completed"
              ? "Obrigado pela visita!"
              : "Seu momento está reservado."}
        </h1>
        <p>
          {appointment.status === "cancelled"
            ? "Seu horário foi liberado. Você pode reservar novamente quando quiser."
            : `Tudo certo, ${appointment.customerName.split(" ")[0]}! Aqui estão os detalhes do seu atendimento.`}
        </p>
        <div className="confirmation-details">
          <div className="summary-business">
            <span className="business-avatar">
              <Scissors size={24} />
            </span>
            <div>
              <strong>{business.name}</strong>
              <small>
                <MapPin size={13} />
                {business.address}
                {business.city && ` · ${business.city}`}
              </small>
            </div>
          </div>
          <div className="confirmation-info">
            <span>
              <CalendarDays size={18} />
              <div>
                Data e horário
                <strong>
                  {displayDate(appointment.date, { day: "numeric", month: "long" })} ·{" "}
                  {appointment.time}
                </strong>
              </div>
            </span>
            <span>
              <Scissors size={18} />
              <div>
                Serviço<strong>{appointment.serviceName}</strong>
              </div>
            </span>
            <span>
              <Clock3 size={18} />
              <div>
                Profissional · {appointment.duration} min
                <strong>{appointment.professionalName}</strong>
              </div>
            </span>
            <span>
              <Check size={18} />
              <div>
                Valor do serviço<strong>{money(appointment.price)}</strong>
              </div>
            </span>
          </div>
        </div>
        <div className="confirmation-link">
          <strong>Guarde este link. Ele é seu acesso à reserva.</strong>
          <p>
            Você pode consultar, remarcar e cancelar por aqui. Compartilhe apenas com pessoas de
            confiança.
          </p>
          <Button
            variant="secondary"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Link copiado!");
              } catch {
                toast.error("Copie o link na barra de endereço do navegador.");
              }
            }}
          >
            <Copy size={16} /> Copiar link do agendamento
          </Button>
        </div>
        <div className="confirmation-actions">
          {canEdit && (
            <>
              <Button
                onClick={() => {
                  setError("");
                  setTime("");
                  setModal("reschedule");
                }}
                variant="secondary"
              >
                <CalendarDays size={16} /> Remarcar
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setError("");
                  setModal("cancel");
                }}
              >
                Cancelar agendamento
              </Button>
            </>
          )}
          {appointment.status !== "cancelled" && (
            <Button variant="ghost" onClick={downloadCalendar}>
              <Download size={16} /> Salvar no calendário
            </Button>
          )}
        </div>
        {business.phone && (
          <a
            className="text-link"
            href={`https://wa.me/55${business.phone}`}
            target="_blank"
            rel="noreferrer"
          >
            <Phone size={16} /> Falar com a barbearia
          </a>
        )}
        <Link href="/agendar" className="text-link">
          Fazer outro agendamento
        </Link>
      </div>
      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal === "cancel" ? "Cancelar este agendamento?" : "Escolha seu novo horário"}
      >
        <ErrorMessage message={error} />
        {modal === "cancel" ? (
          <>
            <p>
              Seu horário será liberado para outra pessoa. Você poderá fazer uma nova reserva quando
              quiser.
            </p>
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setModal(null)}>
                Manter agendamento
              </Button>
              <Button variant="danger" loading={busy} onClick={update}>
                Sim, cancelar
              </Button>
            </div>
          </>
        ) : (
          <>
            <label className="form-stack">
              Nova data
              <input
                type="date"
                min={localDate()}
                max={addDays(localDate(), 90)}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setTime("");
                }}
              />
            </label>
            <div className="time-options">
              {slots.date === date &&
                slots.slots.map((s) => (
                  <button
                    key={s}
                    className={time === s ? "selected" : ""}
                    onClick={() => setTime(s)}
                  >
                    {s}
                  </button>
                ))}
            </div>
            {slots.date !== date && <p>Consultando horários…</p>}
            {slots.date === date && slots.error && <ErrorMessage message={slots.error} />}
            {slots.date === date && !slots.slots.length && !slots.error && (
              <p>Não há horários livres nesta data. Escolha outro dia.</p>
            )}
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setModal(null)}>
                Voltar
              </Button>
              <Button loading={busy} disabled={!time} onClick={update}>
                Confirmar novo horário
              </Button>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
