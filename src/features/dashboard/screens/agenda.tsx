"use client";
import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  ArrowUpRight,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { useDashboard } from "@/features/dashboard/context";
import {
  localDate,
  addDays,
  displayDate,
  money,
  statusLabels,
  phoneDisplay,
  initials,
} from "@/shared/format";
import type { Appointment, AppointmentStatus } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { ErrorMessage } from "@/components/ui/error-message";

export function Agenda() {
  const { data, refresh } = useDashboard();
  const [date, setDate] = useState(localDate());
  const [allDates, setAllDates] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [professional, setProfessional] = useState("");
  const [detail, setDetail] = useState<Appointment | null>(null);
  const [pending, setPending] = useState<{
    appointment: Appointment;
    status: AppointmentStatus;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const appointments = data.appointments
    .filter(
      (a) =>
        (allDates || a.date === date) &&
        (status === "all" || a.status === status) &&
        (!professional || a.professionalId === professional) &&
        `${a.customerName} ${a.customerPhone} ${a.serviceName}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    )
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  async function change() {
    if (!pending) return;
    setBusy(true);
    setError("");
    try {
      await api(`dashboard/appointments/${pending.appointment.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: pending.status }),
      });
      await refresh();
      toast.success("Agendamento atualizado.");
      setPending(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">CADA HORÁRIO, UMA NOVA CONEXÃO</span>
          <h1>
            Sua agenda<span className="text-red">.</span>
          </h1>
          <p>Organize o dia e acompanhe cada atendimento.</p>
        </div>
        <div className="title-actions">
          <a href="/api/dashboard/export" download className="btn btn-secondary">
            <Download size={16} /> Exportar
          </a>
          <Link
            href={`/agendar?barbearia=${data.business.id}`}
            className="btn btn-primary"
            target="_blank"
          >
            <CalendarDays size={17} /> Agendar <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
      <section className="panel">
        <div className="agenda-toolbar">
          <div className="date-nav">
            <button
              className="icon-btn"
              disabled={allDates}
              onClick={() => setDate(addDays(date, -1))}
              aria-label="Dia anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <label>
              <CalendarDays size={17} />
              <input
                type="date"
                aria-label="Data da agenda"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setAllDates(false);
                }}
              />
            </label>
            <button
              className="icon-btn"
              disabled={allDates}
              onClick={() => setDate(addDays(date, 1))}
              aria-label="Próximo dia"
            >
              <ChevronRight size={18} />
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setDate(localDate());
                setAllDates(false);
              }}
            >
              Hoje
            </button>
          </div>
          <div className="segmented-control">
            <button className={!allDates ? "active" : ""} onClick={() => setAllDates(false)}>
              Por dia
            </button>
            <button className={allDates ? "active" : ""} onClick={() => setAllDates(true)}>
              Todos
            </button>
          </div>
        </div>
        <div className="table-filters">
          <div className="search-input">
            <Search size={17} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente ou serviço…"
              aria-label="Buscar agendamentos"
            />
          </div>
          <select
            aria-label="Filtrar por profissional"
            value={professional}
            onChange={(e) => setProfessional(e.target.value)}
          >
            <option value="">Todos os profissionais</option>
            {data.professionals.map((p) => (
              <option value={p.id} key={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            aria-label="Filtrar por status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">Todos os status</option>
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="table-context">
          <strong>
            {allDates
              ? "Histórico de agendamentos"
              : displayDate(date, { weekday: "long", day: "numeric", month: "long" })}
          </strong>
          <span>
            {appointments.length} agendamento{appointments.length !== 1 ? "s" : ""}
          </span>
        </div>
        {appointments.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{allDates ? "Data / horário" : "Horário"}</th>
                  <th>Cliente</th>
                  <th>Serviço</th>
                  <th>Profissional</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <strong className="time-label">{a.time}</strong>
                      {allDates && <small className="cell-small">{displayDate(a.date)}</small>}
                    </td>
                    <td>
                      <button
                        className="table-person table-person-button"
                        onClick={() => setDetail(a)}
                      >
                        <span className="avatar">{initials(a.customerName)}</span>
                        <span>
                          <strong>{a.customerName}</strong>
                          <small>{phoneDisplay(a.customerPhone)}</small>
                        </span>
                      </button>
                    </td>
                    <td>
                      <strong className="cell-text">{a.serviceName}</strong>
                      <small className="cell-small">{a.duration} min</small>
                    </td>
                    <td>
                      <span
                        className="professional-dot"
                        style={{ background: a.professionalColor }}
                      />
                      {a.professionalName.split(" ")[0]}
                    </td>
                    <td>{money(a.price)}</td>
                    <td>
                      <span className={`status-badge status-${a.status}`}>
                        <span />
                        {statusLabels[a.status]}
                      </span>
                    </td>
                    <td>
                      {["pending", "confirmed"].includes(a.status) ? (
                        <select
                          className="action-select"
                          aria-label={`Alterar status de ${a.customerName}`}
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              setError("");
                              setPending({
                                appointment: a,
                                status: e.target.value as AppointmentStatus,
                              });
                            }
                          }}
                        >
                          <option value="">Atualizar</option>
                          {a.status === "pending" && <option value="confirmed">Confirmar</option>}
                          <option value="completed">Concluir</option>
                          <option value="no_show">Não compareceu</option>
                          <option value="cancelled">Cancelar</option>
                        </select>
                      ) : (
                        <button className="small-link" onClick={() => setDetail(a)}>
                          Detalhes
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="Nenhum agendamento por aqui"
            description="Altere os filtros ou compartilhe seu link para receber novas reservas."
          />
        )}
      </section>
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Detalhes do atendimento">
        {detail && (
          <>
            <div className="detail-grid">
              <span>
                Cliente<strong>{detail.customerName}</strong>
              </span>
              <span>
                Telefone<strong>{phoneDisplay(detail.customerPhone)}</strong>
              </span>
              <span>
                Serviço<strong>{detail.serviceName}</strong>
              </span>
              <span>
                Profissional<strong>{detail.professionalName}</strong>
              </span>
              <span>
                Data e horário
                <strong>
                  {displayDate(detail.date)} · {detail.time}
                </strong>
              </span>
              <span>
                Valor<strong>{money(detail.price)}</strong>
              </span>
            </div>
            {detail.notes && <div className="notice">{detail.notes}</div>}
            <div className="modal-actions">
              <a
                className="btn btn-secondary"
                href={`https://wa.me/55${detail.customerPhone}`}
                target="_blank"
                rel="noreferrer"
              >
                <Phone size={16} /> Entrar em contato
              </a>
              <Button onClick={() => setDetail(null)}>Fechar</Button>
            </div>
          </>
        )}
      </Modal>
      <Modal
        open={!!pending}
        onClose={() => setPending(null)}
        title={pending ? `${statusLabels[pending.status]}: confirmar alteração?` : "Atualizar"}
      >
        <ErrorMessage message={error} />
        <p>
          Atualizar o atendimento de <strong>{pending?.appointment.customerName}</strong> para{" "}
          <strong>{pending ? statusLabels[pending.status].toLowerCase() : ""}</strong>?
        </p>
        <p className="muted">
          Ao concluir ou cancelar, o atendimento fica registrado no histórico.
        </p>
        <div className="modal-actions">
          <Button variant="secondary" onClick={() => setPending(null)}>
            Voltar
          </Button>
          <Button
            loading={busy}
            variant={pending?.status === "cancelled" ? "danger" : "primary"}
            onClick={change}
          >
            <CheckCircle2 size={16} /> Confirmar
          </Button>
        </div>
      </Modal>
    </>
  );
}
