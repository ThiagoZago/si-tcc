"use client";
import { useState, type FormEvent } from "react";
import { Plus, Search, Pencil, Phone, Users } from "lucide-react";
import { toast } from "sonner";
import { useDashboard } from "@/features/dashboard/context";
import { api } from "@/lib/api-client";
import { initials, money, displayDate, phoneDisplay } from "@/shared/format";
import type { Customer } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorMessage } from "@/components/ui/error-message";

export function Customers() {
  const { data, refresh } = useDashboard();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Customer | "new" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const customer = editing && editing !== "new" ? editing : null;
  const filtered = data.customers.filter((c) =>
    `${c.name} ${c.phone} ${c.email}`.toLowerCase().includes(search.toLowerCase()),
  );
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      await api(`dashboard/customers${customer ? `/${customer.id}` : ""}`, {
        method: customer ? "PATCH" : "POST",
        body: JSON.stringify(Object.fromEntries(form)),
      });
      await refresh();
      toast.success("Cliente salvo.");
      setEditing(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function open(c: Customer | "new") {
    setEditing(c);
    setError("");
  }
  return (
    <>
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">MAIS QUE CLIENTES. CONEXÕES.</span>
          <h1>
            Seus clientes<span className="text-red">.</span>
          </h1>
          <p>Conheça quem passa pela sua cadeira.</p>
        </div>
        <Button onClick={() => open("new")}>
          <Plus size={17} /> Novo cliente
        </Button>
      </div>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>
              Clientes cadastrados <span className="count-badge">{data.customers.length}</span>
            </h2>
            <p>Os clientes que agendam também aparecem automaticamente aqui.</p>
          </div>
          <Users size={21} />
        </div>
        <div className="table-filters">
          <div className="search-input">
            <Search size={17} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Busque por nome, telefone ou e-mail…"
              aria-label="Buscar clientes"
            />
          </div>
        </div>
        {filtered.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Telefone</th>
                  <th>Visitas</th>
                  <th>Total em serviços</th>
                  <th>Última visita</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="table-person">
                        <span className="avatar">{initials(c.name)}</span>
                        <div>
                          <strong>{c.name}</strong>
                          <small>{c.email || "Sem e-mail cadastrado"}</small>
                        </div>
                      </div>
                    </td>
                    <td>{phoneDisplay(c.phone)}</td>
                    <td>{c.visits || 0}</td>
                    <td>{money(c.totalSpent || 0)}</td>
                    <td>{c.lastVisit ? displayDate(c.lastVisit) : "Primeira visita por vir"}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="icon-btn"
                          onClick={() => open(c)}
                          aria-label={`Editar ${c.name}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <a
                          className="icon-btn"
                          href={`https://wa.me/55${c.phone}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Conversar com ${c.name}`}
                        >
                          <Phone size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title={search ? "Nenhum cliente encontrado" : "Cada cliente começa uma história"}
            description={
              search
                ? "Tente outro nome ou telefone."
                : "Cadastre seu primeiro cliente ou compartilhe seu link de agendamento."
            }
          />
        )}
      </section>
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={customer ? "Editar cliente" : "Novo cliente"}
      >
        <form onSubmit={save} className="form-stack" key={customer?.id ?? "new"}>
          <ErrorMessage message={error} />
          <label>
            Nome
            <input
              name="name"
              defaultValue={customer?.name}
              minLength={2}
              maxLength={100}
              required
              placeholder="Nome e sobrenome"
            />
          </label>
          <label>
            Telefone com DDD
            <input
              name="phone"
              defaultValue={customer?.phone}
              type="tel"
              maxLength={20}
              required
              placeholder="(11) 99999-9999"
            />
          </label>
          <label>
            E-mail <small>(opcional)</small>
            <input name="email" type="email" defaultValue={customer?.email || ""} maxLength={254} />
          </label>
          <label>
            Observações internas
            <textarea
              name="notes"
              defaultValue={customer?.notes || ""}
              rows={3}
              maxLength={1000}
              placeholder="Preferências e detalhes para o atendimento"
            />
          </label>
          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
              Voltar
            </Button>
            <Button type="submit" loading={busy}>
              Salvar cliente
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
