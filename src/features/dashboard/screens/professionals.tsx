"use client";
import { useState, type FormEvent } from "react";
import { Plus, Pencil, Archive, CalendarDays, X, Users } from "lucide-react";
import { toast } from "sonner";
import { useDashboard } from "@/features/dashboard/context";
import { api } from "@/lib/api-client";
import { initials, displayDate } from "@/shared/format";
import { defaultAvailability } from "@/shared/availability";
import type { Professional, Availability } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorMessage } from "@/components/ui/error-message";
import { HoursEditor } from "@/features/dashboard/components/hours-editor";

export function Professionals() {
  const { data, refresh } = useDashboard();
  const [editing, setEditing] = useState<Professional | "new" | null>(null);
  const [archiving, setArchiving] = useState<Professional | null>(null);
  const [availability, setAvailability] = useState<Availability>(defaultAvailability());
  const [exceptions, setExceptions] = useState<string[]>([]);
  const [exception, setException] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const professional = editing && editing !== "new" ? editing : null;
  function open(p: Professional | "new") {
    setEditing(p);
    setAvailability(p === "new" ? defaultAvailability() : p.availability);
    setExceptions(p === "new" ? [] : p.exceptions);
    setException("");
    setError("");
  }
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      await api(`dashboard/professionals${professional ? `/${professional.id}` : ""}`, {
        method: professional ? "PATCH" : "POST",
        body: JSON.stringify({
          name: form.get("name"),
          role: form.get("role"),
          bio: form.get("bio"),
          color: form.get("color"),
          active: form.get("active") === "on",
          availability,
          exceptions,
        }),
      });
      await refresh();
      toast.success("Profissional salvo.");
      setEditing(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function archive() {
    if (!archiving) return;
    setBusy(true);
    setError("");
    try {
      await api(`dashboard/professionals/${archiving.id}`, { method: "DELETE" });
      await refresh();
      setArchiving(null);
      toast.success("Profissional arquivado.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const filtered = data.professionals.filter((p) => showArchived || p.active);
  return (
    <>
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">QUEM FAZ O CUIDADO ACONTECER</span>
          <h1>
            Seu time<span className="text-red">.</span>
          </h1>
          <p>Cada profissional com seu ritmo e sua agenda.</p>
        </div>
        <Button onClick={() => open("new")}>
          <Plus size={17} /> Novo profissional
        </Button>
      </div>
      <div className="management-toolbar">
        <span className="muted">
          <Users size={16} />
          {data.professionals.filter((p) => p.active).length} profissionais ativos
        </span>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
          />{" "}
          Mostrar arquivados
        </label>
      </div>
      {filtered.length ? (
        <div className="professional-card-grid">
          {filtered.map((p) => (
            <article className="professional-card" key={p.id}>
              <div className="professional-card-top">
                <span
                  className="avatar avatar-xl"
                  style={{ background: `${p.color}18`, color: p.color }}
                >
                  {initials(p.name)}
                </span>
                <span className={`badge ${p.active ? "badge-green" : "badge-gray"}`}>
                  {p.active ? "Ativo" : "Arquivado"}
                </span>
              </div>
              <h2>{p.name}</h2>
              <span className="professional-role">{p.role}</span>
              <p>{p.bio || "Pronto para cuidar de cada cliente."}</p>
              <div className="professional-days">
                {[1, 2, 3, 4, 5, 6, 0].map((day, i) => (
                  <span className={p.availability[day].active ? "active" : ""} key={day}>
                    {["S", "T", "Q", "Q", "S", "S", "D"][i]}
                  </span>
                ))}
              </div>
              <div className="professional-card-services">
                <CalendarDays size={15} /> {p.availability.filter((d) => d.active).length} dias de
                atendimento por semana
              </div>
              <div className="service-card-actions">
                <button onClick={() => open(p)}>
                  <Pencil size={15} /> Editar e configurar agenda
                </button>
                {p.active && (
                  <button
                    className="icon-btn"
                    onClick={() => {
                      setError("");
                      setArchiving(p);
                    }}
                    aria-label={`Arquivar ${p.name}`}
                  >
                    <Archive size={16} />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="panel">
          <EmptyState
            title="Seu time começa com você"
            description="Adicione um profissional e configure os dias e horários de atendimento."
            action={
              <Button onClick={() => open("new")}>
                <Plus size={16} /> Adicionar profissional
              </Button>
            }
          />
        </div>
      )}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={professional ? "Editar profissional" : "Novo profissional"}
        wide
      >
        <form onSubmit={save} className="form-stack" key={professional?.id || "new"}>
          <ErrorMessage message={error} />
          <div className="form-grid">
            <label>
              Nome
              <input
                name="name"
                defaultValue={professional?.name}
                minLength={2}
                maxLength={100}
                required
              />
            </label>
            <label>
              Função / especialidade
              <input
                name="role"
                defaultValue={professional?.role || "Barbeiro"}
                minLength={2}
                maxLength={100}
                required
              />
            </label>
          </div>
          <label>
            Apresentação
            <textarea
              name="bio"
              defaultValue={professional?.bio || ""}
              rows={2}
              maxLength={500}
              placeholder="Conte um pouco sobre o trabalho deste profissional"
            />
          </label>
          <div className="form-inline">
            <label className="color-field">
              Cor na agenda
              <input name="color" type="color" defaultValue={professional?.color || "#b92b32"} />
            </label>
            <label className="checkbox-label">
              <input name="active" type="checkbox" defaultChecked={professional?.active ?? true} />{" "}
              Profissional ativo
            </label>
          </div>
          <div>
            <h3 className="field-section-title">Disponibilidade semanal</h3>
            <p className="muted">O agendamento considera também o expediente da barbearia.</p>
            <HoursEditor value={availability} onChange={setAvailability} />
          </div>
          <div>
            <h3 className="field-section-title">Datas bloqueadas</h3>
            <p className="muted">Férias, feriados e outros dias em que não haverá atendimento.</p>
            <div className="exception-input">
              <input
                type="date"
                value={exception}
                onChange={(e) => setException(e.target.value)}
                aria-label="Data a bloquear"
              />
              <Button
                type="button"
                variant="secondary"
                disabled={!exception}
                onClick={() => {
                  if (exception && !exceptions.includes(exception))
                    setExceptions([...exceptions, exception].sort());
                  setException("");
                }}
              >
                <Plus size={16} /> Bloquear
              </Button>
            </div>
            <div className="exception-list">
              {exceptions.map((d) => (
                <span key={d}>
                  {displayDate(d, { day: "2-digit", month: "2-digit", year: "numeric" })}
                  <button
                    type="button"
                    onClick={() => setExceptions(exceptions.filter((v) => v !== d))}
                    aria-label={`Remover bloqueio ${d}`}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
              Voltar
            </Button>
            <Button loading={busy} type="submit">
              Salvar profissional
            </Button>
          </div>
        </form>
      </Modal>
      <Modal
        open={!!archiving}
        onClose={() => setArchiving(null)}
        title="Arquivar este profissional?"
      >
        <ErrorMessage message={error} />
        <p>
          <strong>{archiving?.name}</strong> ficará indisponível para novas reservas. Os
          atendimentos existentes e o histórico serão mantidos.
        </p>
        <div className="modal-actions">
          <Button variant="secondary" onClick={() => setArchiving(null)}>
            Voltar
          </Button>
          <Button variant="danger" loading={busy} onClick={archive}>
            Arquivar profissional
          </Button>
        </div>
      </Modal>
    </>
  );
}
