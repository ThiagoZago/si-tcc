"use client";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Users,
  Wallet,
  Clock3,
  Copy,
  ArrowRight,
  Scissors,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useDashboard } from "@/features/dashboard/context";
import { money, localDate, displayDate, addDays, initials, statusLabels } from "@/shared/format";
import { EmptyState } from "@/components/ui/empty-state";
import { RevenueChart } from "@/features/dashboard/components/revenue-chart";

export function Overview() {
  const { data } = useDashboard();
  const today = localDate();
  const month = today.slice(0, 7);
  const todayAppointments = data.appointments
    .filter((a) => a.date === today && !["cancelled", "no_show"].includes(a.status))
    .sort((a, b) => a.time.localeCompare(b.time));
  const revenue = data.appointments
    .filter((a) => a.status === "completed" && a.date.startsWith(month))
    .reduce((sum, a) => sum + a.price, 0);
  const pending = data.appointments.filter((a) => a.status === "pending" && a.date >= today).length;
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const values = days.map((day) =>
    data.appointments
      .filter((a) => a.date === day && a.status === "completed")
      .reduce((sum, a) => sum + a.price, 0),
  );
  const metrics = [
    {
      label: "Agendamentos hoje",
      value: todayAppointments.length,
      icon: CalendarDays,
      note: `${todayAppointments.filter((a) => a.status === "completed").length} atendimentos concluídos`,
      tone: "red",
    },
    {
      label: "Faturamento no mês",
      value: money(revenue),
      icon: Wallet,
      note: "Somente atendimentos concluídos",
      tone: "green",
    },
    {
      label: "Clientes cadastrados",
      value: data.customers.length,
      icon: Users,
      note: "Conexões que fazem seu negócio",
      tone: "gold",
    },
    {
      label: "Aguardando confirmação",
      value: pending,
      icon: Clock3,
      note: "Reservas futuras pendentes",
      tone: "blue",
    },
  ];
  const topServices = data.services
    .map((s) => ({
      ...s,
      count: data.appointments.filter(
        (a) => a.serviceId === s.id && a.status === "completed" && a.date.startsWith(month),
      ).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
  return (
    <>
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">VAMOS FAZER UM BOM DIA</span>
          <h1>
            Olá, {data.user.name.split(" ")[0]}
            <span className="greeting-dot">.</span>
          </h1>
          <p>Uma visão do seu negócio, com tudo no lugar.</p>
        </div>
        <Link
          href={`/agendar?barbearia=${data.business.id}`}
          className="btn btn-primary"
          target="_blank"
        >
          <CalendarDays size={17} /> Novo agendamento <ArrowUpRight size={15} />
        </Link>
      </div>
      <div className="metric-grid">
        {metrics.map((m) => (
          <article className="metric-card" key={m.label}>
            <div>
              <span>{m.label}</span>
              <span className={`metric-icon tone-${m.tone}`}>
                <m.icon size={19} />
              </span>
            </div>
            <strong>{m.value}</strong>
            <small>{m.note}</small>
          </article>
        ))}
      </div>
      <div className="overview-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Movimento da semana</h2>
              <p>Faturamento dos últimos 7 dias</p>
            </div>
            <Link href="/painel/relatorios" className="small-link">
              Ver relatório <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="chart-total">
            <strong>{money(values.reduce((a, b) => a + b, 0))}</strong>
            <span>
              <span className="chart-legend" /> Atendimentos concluídos
            </span>
          </div>
          <RevenueChart days={days} values={values} />
        </section>
        <section className="panel popular-panel">
          <div className="panel-heading">
            <div>
              <h2>Os favoritos do mês</h2>
              <p>Serviços mais realizados</p>
            </div>
            <Scissors size={19} />
          </div>
          {topServices.some((s) => s.count) ? (
            <div className="popular-list">
              {topServices.map((s, i) => (
                <div key={s.id}>
                  <span className="popular-number">0{i + 1}</span>
                  <div>
                    <strong>{s.name}</strong>
                    <small>
                      {s.count} atendimento{s.count !== 1 ? "s" : ""}
                    </small>
                  </div>
                  <span>{money(s.price)}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Seus favoritos aparecem aqui"
              description="Conclua atendimentos para acompanhar os serviços mais procurados."
            />
          )}
          <Link href="/painel/servicos" className="small-link">
            Gerenciar serviços <ArrowRight size={15} />
          </Link>
        </section>
      </div>
      <div className="overview-bottom">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>
                A agenda de hoje <span className="count-badge">{todayAppointments.length}</span>
              </h2>
              <p>{displayDate(today, { weekday: "long", day: "numeric", month: "long" })}</p>
            </div>
            <Link href="/painel/agenda" className="small-link">
              Agenda completa <ArrowUpRight size={15} />
            </Link>
          </div>
          {todayAppointments.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Horário</th>
                    <th>Cliente / serviço</th>
                    <th>Profissional</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.slice(0, 6).map((a) => (
                    <tr key={a.id}>
                      <td>
                        <span className="time-label">{a.time}</span>
                      </td>
                      <td>
                        <div className="table-person">
                          <span
                            className="avatar"
                            style={{
                              color: a.professionalColor,
                              background: `${a.professionalColor}12`,
                            }}
                          >
                            {initials(a.customerName)}
                          </span>
                          <div>
                            <strong>{a.customerName}</strong>
                            <small>{a.serviceName}</small>
                          </div>
                        </div>
                      </td>
                      <td>{a.professionalName.split(" ")[0]}</td>
                      <td>
                        <span className={`status-badge status-${a.status}`}>
                          <span />
                          {statusLabels[a.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="Um dia tranquilo por aqui"
              description="Compartilhe seu link de agendamento para receber as próximas reservas."
            />
          )}
        </section>
        <aside className="share-card">
          <span className="share-icon">
            <ArrowUpRight size={25} />
          </span>
          <span className="eyebrow">SUA BARBEARIA, MAIS PERTO</span>
          <h2>
            Uma agenda cheia
            <br />
            começa com um link.
          </h2>
          <p>Compartilhe sua página de agendamento com os clientes.</p>
          <button
            className="btn btn-light"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  `${window.location.origin}/agendar?barbearia=${data.business.id}`,
                );
                toast.success("Link de agendamento copiado!");
              } catch {
                toast.error("Abra a página de agendamento e copie o endereço.");
              }
            }}
          >
            <Copy size={16} /> Copiar meu link
          </button>
          <div>
            <Check size={14} /> Reserve pelo celular, a qualquer hora.
          </div>
        </aside>
      </div>
    </>
  );
}
