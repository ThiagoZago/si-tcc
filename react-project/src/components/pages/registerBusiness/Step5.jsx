import { useState } from "react";

function Step5Availability({ availability = {}, setAvailability, exceptions = [], setExceptions }) {
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

  const handleActiveChange = (dayKey, checked) => {
    const updated = { ...availability };
    updated[dayKey] = { ...(updated[dayKey] || {}), active: checked };
    setAvailability(updated);
  };

  const handleTimeChange = (dayKey, field, value) => {
    const updated = { ...availability };
    const day = { ...(updated[dayKey] || {}), [field]: value };
    updated[dayKey] = day;
    setAvailability(updated);
  };

  // Exceções
  const [newException, setNewException] = useState({ date: "", motivo: "" });

  const addException = () => {
    if (!newException.date) return;
    setExceptions([...exceptions, newException]);
    setNewException({ date: "", motivo: "" });
  };

  const removeException = (idx) => {
    setExceptions(exceptions.filter((_, i) => i !== idx));
  };

  return (
    <div className="mt-3">
      <h6 className="mb-2">Agenda</h6>

      {days.map(({ key, label }) => {
        const current = availability[key] || {};
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

      {/* Exceções */}
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

      {exceptions.length > 0 && (
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
              {exceptions.map((ex, i) => (
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
    </div>
  );
}

export default Step5Availability;
