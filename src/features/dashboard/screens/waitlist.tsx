"use client";
import { useState } from "react";
import { Phone, Clock3, Check, Archive, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useDashboard } from "@/features/dashboard/context";
import { api } from "@/lib/api-client";
import { displayDate, phoneDisplay } from "@/shared/format";
import { EmptyState } from "@/components/ui/empty-state";

export function Waitlist() {
  const { data, refresh } = useDashboard();
  const [filter, setFilter] = useState("waiting");
  const [busy, setBusy] = useState("");
  const entries = data.waitlist.filter((w) => filter === "all" || w.status === filter);
  async function update(id: string, status: string) {
    setBusy(id);
    try {
      await api(`dashboard/waitlist/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      await refresh();
      toast.success("Lista atualizada.");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy("");
    }
  }
  return (
    <>
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">UMA VAGA PODE VIRAR UM ENCONTRO</span>
          <h1>
            Lista de espera<span className="text-red">.</span>
          </h1>
          <p>Veja quem gostaria de um horário e entre em contato quando surgir uma vaga.</p>
        </div>
        <span className="metric-icon tone-gold">
          <Clock3 size={22} />
        </span>
      </div>
      <section className="panel">
        <div className="table-filters">
          <div className="segmented-control">
            {[
              { value: "waiting", label: "Aguardando" },
              { value: "contacted", label: "Contatados" },
              { value: "all", label: "Todos" },
            ].map((s) => (
              <button
                key={s.value}
                className={s.value === filter ? "active" : ""}
                onClick={() => setFilter(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <span className="muted">{entries.length} solicitações</span>
        </div>
        {entries.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Data desejada</th>
                  <th>Serviço</th>
                  <th>Profissional</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((w) => (
                  <tr key={w.id}>
                    <td>
                      <strong className="cell-text">{w.customerName}</strong>
                      <small className="cell-small">{phoneDisplay(w.phone)}</small>
                    </td>
                    <td>{displayDate(w.date)}</td>
                    <td>{w.serviceName}</td>
                    <td>{w.professionalName}</td>
                    <td>
                      <span
                        className={`badge ${w.status === "waiting" ? "badge-gold" : w.status === "contacted" ? "badge-green" : "badge-gray"}`}
                      >
                        {w.status === "waiting"
                          ? "Aguardando"
                          : w.status === "contacted"
                            ? "Contatado"
                            : "Encerrado"}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <a
                          className="icon-btn"
                          href={`https://wa.me/55${w.phone}?text=${encodeURIComponent(`Olá, ${w.customerName}! Aqui é da ${data.business.name}. Temos novidades sobre sua solicitação de horário para ${displayDate(w.date)}.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Conversar com ${w.customerName}`}
                        >
                          <Phone size={16} />
                        </a>
                        {busy === w.id ? (
                          <LoaderCircle size={17} className="spin" />
                        ) : (
                          <>
                            {w.status === "waiting" && (
                              <button
                                className="icon-btn"
                                onClick={() => update(w.id, "contacted")}
                                aria-label={`Marcar ${w.customerName} como contatado`}
                              >
                                <Check size={17} />
                              </button>
                            )}
                            {w.status !== "closed" && (
                              <button
                                className="icon-btn"
                                onClick={() => update(w.id, "closed")}
                                aria-label={`Encerrar solicitação de ${w.customerName}`}
                              >
                                <Archive size={16} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="Nenhuma solicitação por aqui"
            description="Quando um cliente entrar na lista de espera, você poderá acompanhar e entrar em contato por aqui."
          />
        )}
      </section>
      <div className="notice">
        <Phone size={17} />O contato é manual. Abrir uma conversa não envia mensagem nem reserva um
        horário automaticamente.
      </div>
    </>
  );
}
