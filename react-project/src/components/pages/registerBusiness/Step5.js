import { useState } from "react";

function Step5Availability({ professionals = [], availability = {}, setAvailability, exceptions = {}, setExceptions }) {
  const [selectedPro, setSelectedPro] = useState("");

  // Chaves dos dias (para armazenar) + rótulos (para exibir)
  const days = [
    { key: "segunda", label: "Segunda-feira" },
    { key: "terca",   label: "Terça-feira"   },
    { key: "quarta",  label: "Quarta-feira"  },
    { key: "quinta",  label: "Quinta-feira"  },
    { key: "sexta",   label: "Sexta-feira"   },
    { key: "sabado",  label: "Sábado"        },
    { key: "domingo", label: "Domingo"       },
  ];

  // Helpers para pegar/alterar a agenda do profissional atual
  const getProAvailability = () => availability[selectedPro] || {};
  const getProExceptions  = () => exceptions[selectedPro] || [];

  const handleActiveChange = (dayKey, checked) => {
    if (!selectedPro) return;
    const updated = { ...availability };
    const pro = { ...(updated[selectedPro] || {}) };
    pro[dayKey] = { ...(pro[dayKey] || {}), active: checked };
    updated[selectedPro] = pro;
    setAvailability(updated);
  };

  const handleTimeChange = (dayKey, field, value) => {
    if (!selectedPro) return;
    const updated = { ...availability };
    const pro = { ...(updated[selectedPro] || {}) };
    const day = { ...(pro[dayKey] || {}), [field]: value };
    pro[dayKey] = day;
    updated[selectedPro] = pro;
    setAvailability(updated);
  };

  // Exceções (por profissional)
  const [newException, setNewException] = useState({ date: "", motivo: "" });

  const addException = () => {
    if (!selectedPro || !newException.date) return;
    const list = getProExceptions();
    const updated = { ...exceptions, [selectedPro]: [...list, newException] };
    setExceptions(updated);
    setNewException({ date: "", motivo: "" });
  };

  const removeException = (idx) => {
    if (!selectedPro) return;
    const list = getProExceptions().filter((_, i) => i !== idx);
    setExceptions({ ...exceptions, [selectedPro]: list });
  };

  return (
    <div className="mt-3">
      <h4 className="mb-3">Disponibilidade por Profissional</h4>

      {/* Seletor do profissional */}
      <div className="mb-3">
        <label className="form-label">Selecione o Profissional</label>
        <select
          className="form-select"
          value={selectedPro}
          onChange={(e) => setSelectedPro(e.target.value)}
        >
          <option value="">-- Escolha --</option>
          {professionals.map((p, i) => (
            <option key={`${p.name}-${i}`} value={p.name}>
              {p.name} {p.role ? `- ${p.role}` : ""}
            </option>
          ))}
        </select>
      </div>

      {!selectedPro && (
        <div className="alert alert-info">Escolha um profissional para configurar a agenda.</div>
      )}

      {selectedPro && (
        <>
          <h6 className="mb-2">Agenda de {selectedPro}</h6>

          {days.map(({ key, label }) => {
            const current = getProAvailability()[key] || {};
            return (
              <div key={key} className="card mb-3">
                <div className="card-body">
                  <div className="form-check form-switch mb-3">
                    <input
                      id={`active-${key}`}
                      className="form-check-input"
                      type="checkbox"
                      checked={!!current.active}
                      onChange={(e) => handleActiveChange(key, e.target.checked)}
                    />
                    <label htmlFor={`active-${key}`} className="form-check-label fw-semibold">
                      {label}
                    </label>
                  </div>

                  {current.active && (
                    <div className="row g-3">
                      <div className="col-md-3">
                        <label className="form-label">Início</label>
                        <input
                          type="time"
                          className="form-control"
                          value={current.start || ""}
                          onChange={(e) => handleTimeChange(key, "start", e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Fim</label>
                        <input
                          type="time"
                          className="form-control"
                          value={current.end || ""}
                          onChange={(e) => handleTimeChange(key, "end", e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Almoço (Início)</label>
                        <input
                          type="time"
                          className="form-control"
                          value={current.lunchStart || ""}
                          onChange={(e) => handleTimeChange(key, "lunchStart", e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Almoço (Fim)</label>
                        <input
                          type="time"
                          className="form-control"
                          value={current.lunchEnd || ""}
                          onChange={(e) => handleTimeChange(key, "lunchEnd", e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Exceções (dias bloqueados para ESTE profissional) */}
          <h6 className="mt-4">Exceções (dias bloqueados)</h6>
          <div className="row g-2 mb-3">
            <div className="col-md-4">
              <input
                type="date"
                className="form-control"
                value={newException.date}
                onChange={(e) => setNewException({ ...newException, date: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Motivo (ex.: Feriado, Compromisso...)"
                value={newException.motivo}
                onChange={(e) => setNewException({ ...newException, motivo: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <button type="button" className="btn btn-primary w-100" onClick={addException}>
                Adicionar
              </button>
            </div>
          </div>

          {getProExceptions().length > 0 && (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Data</th>
                    <th>Motivo</th>
                    <th style={{ width: 120 }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {getProExceptions().map((ex, i) => (
                    <tr key={`${ex.date}-${i}`}>
                      <td>{ex.date}</td>
                      <td>{ex.motivo}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => removeException(i)}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Step5Availability;
