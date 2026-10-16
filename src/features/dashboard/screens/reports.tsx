"use client";
import { useState } from "react";
import { Download, Wallet, Scissors, Users, ChartNoAxesCombined } from "lucide-react";
import { useDashboard } from "@/features/dashboard/context";
import { money, localDate, addDays } from "@/shared/format";
import { RevenueChart } from "@/features/dashboard/components/revenue-chart";
import { EmptyState } from "@/components/ui/empty-state";

export function Reports() {
  const { data } = useDashboard();
  const [month, setMonth] = useState(localDate().slice(0, 7));
  const completed = data.appointments.filter(
    (a) => a.date.startsWith(month) && a.status === "completed",
  );
  const revenue = completed.reduce((sum, a) => sum + a.price, 0);
  const count = completed.length;
  const uniqueCustomers = new Set(completed.map((a) => a.customerId)).size;
  const dayCount = new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0).getDate();
  const days = Array.from({ length: dayCount || 1 }, (_, i) =>
    addDays(`${month || localDate().slice(0, 7)}-01`, i),
  );
  const values = days.map((day) =>
    completed.filter((a) => a.date === day).reduce((sum, a) => sum + a.price, 0),
  );
  const serviceGroups = Array.from(new Set(completed.map((a) => a.serviceName)))
    .map((name) => ({
      name,
      count: completed.filter((a) => a.serviceName === name).length,
      revenue: completed.filter((a) => a.serviceName === name).reduce((sum, a) => sum + a.price, 0),
    }))
    .sort((a, b) => b.revenue - a.revenue);
  const professionalGroups = data.professionals
    .map((p) => ({
      name: p.name,
      color: p.color,
      count: completed.filter((a) => a.professionalId === p.id).length,
      revenue: completed
        .filter((a) => a.professionalId === p.id)
        .reduce((sum, a) => sum + a.price, 0),
    }))
    .sort((a, b) => b.revenue - a.revenue);
  return (
    <>
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">CLAREZA PARA CRESCER</span>
          <h1>
            Seus resultados<span className="text-red">.</span>
          </h1>
          <p>Transforme os atendimentos em uma visão do seu negócio.</p>
        </div>
        <div className="title-actions">
          <input
            type="month"
            value={month}
            aria-label="Mês do relatório"
            onChange={(e) => {
              if (e.target.value) setMonth(e.target.value);
            }}
          />
          <a className="btn btn-secondary" href="/api/dashboard/export" download>
            <Download size={16} /> Exportar histórico
          </a>
        </div>
      </div>
      <div className="metric-grid">
        {[
          { title: "Faturamento realizado", value: money(revenue), icon: Wallet },
          { title: "Atendimentos concluídos", value: count, icon: Scissors },
          {
            title: "Valor médio por atendimento",
            value: money(count ? Math.round(revenue / count) : 0),
            icon: ChartNoAxesCombined,
          },
          { title: "Clientes atendidos", value: uniqueCustomers, icon: Users },
        ].map((m) => (
          <article className="metric-card" key={m.title}>
            <div>
              <span>{m.title}</span>
              <span className="metric-icon tone-red">
                <m.icon size={19} />
              </span>
            </div>
            <strong>{m.value}</strong>
            <small>No mês selecionado</small>
          </article>
        ))}
      </div>
      <section className="panel report-chart">
        <div className="panel-heading">
          <div>
            <h2>Faturamento diário</h2>
            <p>Valores dos serviços marcados como concluídos</p>
          </div>
          <span className="badge badge-red">
            {month.slice(5, 7)}/{month.slice(0, 4)}
          </span>
        </div>
        <RevenueChart days={days} values={values} />
      </section>
      <div className="report-grid">
        <section className="panel">
          <div className="panel-heading">
            <h2>Por serviço</h2>
            <Scissors size={19} />
          </div>
          {serviceGroups.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Serviço</th>
                    <th>Atendimentos</th>
                    <th>Faturamento</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceGroups.map((s) => (
                    <tr key={s.name}>
                      <td>{s.name}</td>
                      <td>{s.count}</td>
                      <td>
                        <strong>{money(s.revenue)}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="Sem atendimentos neste mês"
              description="Os serviços concluídos aparecem neste relatório."
            />
          )}
        </section>
        <section className="panel">
          <div className="panel-heading">
            <h2>Por profissional</h2>
            <Users size={19} />
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Profissional</th>
                  <th>Atendimentos</th>
                  <th>Faturamento</th>
                </tr>
              </thead>
              <tbody>
                {professionalGroups.map((p) => (
                  <tr key={p.name}>
                    <td>
                      <span className="professional-dot" style={{ background: p.color }} />
                      {p.name}
                    </td>
                    <td>{p.count}</td>
                    <td>
                      <strong>{money(p.revenue)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!professionalGroups.length && (
            <EmptyState
              title="Seu time aparece aqui"
              description="Cadastre profissionais e conclua os primeiros atendimentos."
            />
          )}
        </section>
      </div>
      <div className="notice">
        <Wallet size={17} />O faturamento representa o valor dos serviços concluídos. O BarbApp não
        processa pagamentos nem registra despesas.
      </div>
    </>
  );
}
