"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Plus, Scissors, Clock3, Pencil, Archive, Search } from "lucide-react";
import { toast } from "sonner";
import { useDashboard } from "@/features/dashboard/context";
import { api } from "@/lib/api-client";
import { money, initials } from "@/shared/format";
import type { Service } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorMessage } from "@/components/ui/error-message";

export function Services() {
  const { data, refresh } = useDashboard();
  const [editing, setEditing] = useState<Service | "new" | null>(null);
  const [archiving, setArchiving] = useState<Service | null>(null);
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const service = editing && editing !== "new" ? editing : null;
  const activeProfessionals = data.professionals.filter((p) => p.active);
  const filtered = data.services.filter(
    (s) => (showArchived || s.active) && s.name.toLowerCase().includes(search.toLowerCase()),
  );
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const price = Number(String(form.get("price")).replace(",", "."));
    setBusy(true);
    setError("");
    try {
      await api(`dashboard/services${service ? `/${service.id}` : ""}`, {
        method: service ? "PATCH" : "POST",
        body: JSON.stringify({
          name: form.get("name"),
          description: form.get("description"),
          duration: Number(form.get("duration")),
          price: Math.round(price * 100),
          active: form.get("active") === "on",
          professionalIds: form.getAll("professionalIds"),
        }),
      });
      await refresh();
      toast.success("Serviço salvo.");
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
      await api(`dashboard/services/${archiving.id}`, { method: "DELETE" });
      await refresh();
      setArchiving(null);
      toast.success("Serviço arquivado. O histórico foi preservado.");
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
          <span className="eyebrow">O QUE SUA BARBEARIA FAZ DE MELHOR</span>
          <h1>
            Seus serviços<span className="text-red">.</span>
          </h1>
          <p>Defina o cuidado, o tempo e o valor de cada atendimento.</p>
        </div>
        <Button
          onClick={() => {
            setError("");
            setEditing("new");
          }}
        >
          <Plus size={17} /> Novo serviço
        </Button>
      </div>
      <div className="management-toolbar">
        <div className="search-input">
          <Search size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar serviço…"
            aria-label="Buscar serviço"
          />
        </div>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
          />{" "}
          Mostrar arquivados
        </label>
        <span className="muted">
          {filtered.length} serviço{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>
      {filtered.length ? (
        <div className="service-card-grid">
          {filtered.map((s) => (
            <article className={`service-card ${!s.active ? "archived" : ""}`} key={s.id}>
              <div className="service-card-top">
                <span className="feature-icon">
                  <Scissors size={23} />
                </span>
                <span className={`badge ${s.active ? "badge-green" : "badge-gray"}`}>
                  {s.active ? "Ativo" : "Arquivado"}
                </span>
              </div>
              <h2>{s.name}</h2>
              <p>{s.description || "Um serviço com o cuidado da sua barbearia."}</p>
              <div className="service-card-value">
                <strong>{money(s.price)}</strong>
                <span>
                  <Clock3 size={15} />
                  {s.duration} min
                </span>
              </div>
              <div className="service-card-professionals">
                <div className="avatar-stack">
                  {data.professionals
                    .filter((p) => s.professionalIds.includes(p.id))
                    .map((p) => (
                      <span
                        className="avatar"
                        title={p.name}
                        key={p.id}
                        style={{ background: `${p.color}15`, color: p.color }}
                      >
                        {initials(p.name)}
                      </span>
                    ))}
                </div>
                <small>
                  {s.professionalIds.length} profissional
                  {s.professionalIds.length !== 1 ? "is" : ""}
                </small>
              </div>
              <div className="service-card-actions">
                <button
                  onClick={() => {
                    setError("");
                    setEditing(s);
                  }}
                >
                  <Pencil size={15} />
                  Editar serviço
                </button>
                {s.active && (
                  <button
                    className="icon-btn"
                    aria-label={`Arquivar ${s.name}`}
                    onClick={() => {
                      setError("");
                      setArchiving(s);
                    }}
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
            title={search ? "Nenhum serviço encontrado" : "Seu talento começa aqui"}
            description="Cadastre seus serviços, preços e duração para receber agendamentos."
            action={
              <Button onClick={() => setEditing("new")}>
                <Plus size={16} /> Cadastrar serviço
              </Button>
            }
          />
        </div>
      )}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={service ? "Editar serviço" : "Novo serviço"}
      >
        <form onSubmit={save} className="form-stack" key={service?.id ?? "new"}>
          <ErrorMessage message={error} />
          <label>
            Nome do serviço
            <input
              name="name"
              defaultValue={service?.name}
              minLength={2}
              maxLength={100}
              required
              placeholder="Ex.: Corte + barba"
            />
          </label>
          <label>
            Descrição
            <textarea
              name="description"
              defaultValue={service?.description || ""}
              rows={2}
              maxLength={500}
              placeholder="Conte o que está incluído"
            />
          </label>
          <div className="form-grid">
            <label>
              Preço (R$)
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                max="10000"
                defaultValue={service ? service.price / 100 : ""}
                required
                placeholder="55,00"
              />
            </label>
            <label>
              Duração
              <select name="duration" defaultValue={service?.duration || 30}>
                {Array.from({ length: 16 }, (_, i) => (i + 1) * 15).map((m) => (
                  <option key={m} value={m}>
                    {m} minutos
                  </option>
                ))}
              </select>
            </label>
          </div>
          <fieldset>
            <legend>Quem realiza esse serviço?</legend>
            <div className="checkbox-grid">
              {activeProfessionals.map((p) => (
                <label className="checkbox-label" key={p.id}>
                  <input
                    type="checkbox"
                    name="professionalIds"
                    value={p.id}
                    defaultChecked={service?.professionalIds.includes(p.id)}
                  />
                  {p.name}
                </label>
              ))}
            </div>
            {!activeProfessionals.length && (
              <div className="notice">
                Cadastre um profissional primeiro.{" "}
                <Link href="/painel/profissionais">Ir para profissionais</Link>
              </div>
            )}
          </fieldset>
          <label className="checkbox-label">
            <input type="checkbox" name="active" defaultChecked={service?.active ?? true} /> Serviço
            disponível para agendamento
          </label>
          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
              Voltar
            </Button>
            <Button loading={busy} type="submit" disabled={!activeProfessionals.length}>
              Salvar serviço
            </Button>
          </div>
        </form>
      </Modal>
      <Modal open={!!archiving} onClose={() => setArchiving(null)} title="Arquivar este serviço?">
        <ErrorMessage message={error} />
        <p>
          <strong>{archiving?.name}</strong> deixará de aparecer no agendamento público. Os
          atendimentos existentes e o histórico serão mantidos.
        </p>
        <div className="modal-actions">
          <Button variant="secondary" onClick={() => setArchiving(null)}>
            Voltar
          </Button>
          <Button loading={busy} variant="danger" onClick={archive}>
            Arquivar serviço
          </Button>
        </div>
      </Modal>
    </>
  );
}
