"use client";
import { useState, type FormEvent } from "react";
import { Store, UserRound, ShieldCheck, Save, Copy, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { useDashboard } from "@/features/dashboard/context";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { HoursEditor } from "@/features/dashboard/components/hours-editor";

export function Settings() {
  const { data, refresh } = useDashboard();
  const [tab, setTab] = useState("business");
  const [hours, setHours] = useState(data.business.hours);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function save(e: FormEvent<HTMLFormElement>, endpoint: string) {
    e.preventDefault();
    const element = e.currentTarget;
    const form = new FormData(element);
    const payload = Object.fromEntries(form);
    setBusy(true);
    setError("");
    try {
      await api(`dashboard/${endpoint}`, {
        method: "PATCH",
        body: JSON.stringify(endpoint === "business" ? { ...payload, hours } : payload),
      });
      await refresh();
      toast.success(
        endpoint === "password"
          ? "Senha alterada. Outras sessões foram encerradas."
          : "Configurações salvas.",
      );
      if (endpoint === "password") element.reset();
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
          <span className="eyebrow">DO SEU JEITO, EM CADA DETALHE</span>
          <h1>
            Configurações<span className="text-red">.</span>
          </h1>
          <p>Cuide da sua barbearia e da sua conta.</p>
        </div>
      </div>
      <div className="settings-tabs" role="tablist" aria-label="Configurações">
        {[
          { key: "business", label: "Minha barbearia", icon: Store },
          { key: "account", label: "Minha conta", icon: UserRound },
          { key: "security", label: "Segurança", icon: ShieldCheck },
        ].map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={t.key === tab}
            className={t.key === tab ? "active" : ""}
            onClick={() => {
              setTab(t.key);
              setError("");
            }}
          >
            <t.icon size={17} />
            {t.label}
          </button>
        ))}
      </div>
      <ErrorMessage message={error} />
      {tab === "business" && (
        <form onSubmit={(e) => save(e, "business")} className="settings-form">
          <section className="panel settings-panel">
            <div className="panel-heading">
              <div>
                <h2>Informações do estabelecimento</h2>
                <p>Esses dados aparecem na sua página de agendamento.</p>
              </div>
              <Store size={21} />
            </div>
            <div className="form-stack panel-body">
              <div className="form-grid">
                <label>
                  Nome da barbearia
                  <input
                    name="name"
                    defaultValue={data.business.name}
                    minLength={2}
                    maxLength={100}
                    required
                  />
                </label>
                <label>
                  Cidade / estado
                  <input
                    name="city"
                    defaultValue={data.business.city}
                    minLength={2}
                    maxLength={100}
                    placeholder="São Paulo, SP"
                    required
                  />
                </label>
              </div>
              <label>
                Endereço completo
                <input
                  name="address"
                  defaultValue={data.business.address}
                  minLength={3}
                  maxLength={250}
                  placeholder="Rua, número e bairro"
                  required
                />
              </label>
              <div className="form-grid">
                <label>
                  Telefone de contato
                  <input
                    name="phone"
                    type="tel"
                    defaultValue={data.business.phone}
                    maxLength={20}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </label>
                <label>
                  E-mail da barbearia
                  <input
                    name="email"
                    type="email"
                    defaultValue={data.business.email}
                    maxLength={254}
                    required
                  />
                </label>
              </div>
              <label>
                Sobre a barbearia
                <textarea
                  name="description"
                  defaultValue={data.business.description}
                  rows={3}
                  maxLength={1000}
                  placeholder="Conte um pouco sobre o seu espaço"
                />
              </label>
            </div>
          </section>
          <section className="panel settings-panel">
            <div className="panel-heading">
              <div>
                <h2>Horário de funcionamento</h2>
                <p>Os profissionais só podem receber reservas dentro deste expediente.</p>
              </div>
            </div>
            <div className="panel-body">
              <HoursEditor value={hours} onChange={setHours} />
            </div>
          </section>
          <div className="settings-save">
            <span className="muted">
              Alterações de expediente afetam novas reservas. Revise atendimentos existentes na
              agenda.
            </span>
            <Button type="submit" loading={busy}>
              <Save size={16} /> Salvar configurações
            </Button>
          </div>
        </form>
      )}
      {tab === "account" && (
        <div className="settings-form">
          <form className="panel settings-panel" onSubmit={(e) => save(e, "account")}>
            <div className="panel-heading">
              <div>
                <h2>Seu perfil</h2>
                <p>Como você aparece no seu painel.</p>
              </div>
              <UserRound size={21} />
            </div>
            <div className="form-stack panel-body">
              <label>
                Seu nome
                <input
                  name="name"
                  defaultValue={data.user.name}
                  minLength={2}
                  maxLength={100}
                  required
                />
              </label>
              <label>
                E-mail de acesso
                <input value={data.user.email} disabled />
                <small>O e-mail identifica sua conta.</small>
              </label>
              <Button type="submit" loading={busy}>
                <Save size={16} /> Salvar perfil
              </Button>
            </div>
          </form>
          <section className="panel settings-panel">
            <div className="panel-heading">
              <h2>Sua página de agendamento</h2>
            </div>
            <div className="panel-body">
              <p className="muted">
                Compartilhe o link para os clientes reservarem diretamente com sua barbearia.
              </p>
              <div className="title-actions">
                <Button
                  variant="secondary"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(
                        `${window.location.origin}/agendar?barbearia=${data.business.id}`,
                      );
                      toast.success("Link copiado!");
                    } catch {
                      toast.error("Abra a página e copie o endereço.");
                    }
                  }}
                >
                  <Copy size={16} /> Copiar link
                </Button>
                <a
                  href={`/agendar?barbearia=${data.business.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost"
                >
                  Abrir página <ArrowUpRight size={17} />
                </a>
              </div>
            </div>
          </section>
        </div>
      )}
      {tab === "security" && (
        <form className="panel settings-panel settings-form" onSubmit={(e) => save(e, "password")}>
          <div className="panel-heading">
            <div>
              <h2>Alterar senha</h2>
              <p>Ao alterar a senha, as outras sessões são encerradas.</p>
            </div>
            <ShieldCheck size={21} />
          </div>
          <div className="form-stack panel-body">
            <label>
              Senha atual
              <input
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                maxLength={128}
                required
              />
            </label>
            <label>
              Nova senha
              <input
                name="newPassword"
                type="password"
                autoComplete="new-password"
                minLength={10}
                maxLength={128}
                required
              />
              <small>Pelo menos 10 caracteres, uma letra e um número.</small>
            </label>
            <Button type="submit" loading={busy}>
              <ShieldCheck size={16} /> Alterar senha
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
