import { useState, useEffect } from "react";

/**
 * Step3Servicos
 * Props:
 *  - professionals: array
 *  - services: array
 *  - onAddService(service, indexToEdit|null) -> should return true on success, false if cancelled
 *  - onDeleteService(index)
 *  - prevStep, nextStep
 */

const normalizeId = (raw) => {
  // transforma tudo para string de forma segura
  if (raw === null || raw === undefined) return String(raw);
  if (typeof raw === "object") {
    if (raw.$oid) return String(raw.$oid);
    if (raw.$id) return String(raw.$id);
    try { return String(raw); } catch { return JSON.stringify(raw); }
  }
  return String(raw);
};

function Step3Servicos({
  professionals = [],
  services = [],
  onAddService,
  onDeleteService,
  prevStep,
  nextStep
}) {
  const [serviceName, setServiceName] = useState("");
  const [serviceDuration, setServiceDuration] = useState("");
  const [selectedProfessionals, setSelectedProfessionals] = useState([]); // [{id,name}, ...]

  const [editingIndex, setEditingIndex] = useState(null);

  // Se o usuário entra em edição, carrega o serviço nos inputs (ou limpa se índice inválido)
  useEffect(() => {
    if (editingIndex === null) return;

    if (editingIndex < 0 || editingIndex >= services.length) {
      // índice inválido -> limpa
      setEditingIndex(null);
      setServiceName("");
      setServiceDuration("");
      setSelectedProfessionals([]);
      return;
    }

    const s = services[editingIndex];
    if (!s) return;

    setServiceName(s.name || "");
    setServiceDuration(s.duration || "");

    const normalized = Array.isArray(s.professionals)
      ? s.professionals.map((p) => {
          const id = normalizeId(p._id || p.id || p);
          const name = p.name || p.nome || String(p);
          return { id, name };
        })
      : [];

    setSelectedProfessionals(normalized);
  }, [editingIndex, services]);

  const handleProfessionalSelect = (rawId, name) => {
    const id = normalizeId(rawId);
    setSelectedProfessionals((prev) => {
      const exists = prev.some((p) => p.id === id);
      if (exists) return prev.filter((p) => p.id !== id);
      return [...prev, { id, name }];
    });
  };

  const handleAddOrEditService = () => {
    if (!serviceName.trim() || !serviceDuration.trim() || selectedProfessionals.length === 0) {
      alert("Preencha o nome, duração e selecione ao menos um profissional.");
      return;
    }

    const newService = {
      name: serviceName.trim(),
      duration: serviceDuration.trim(),
      professionals: selectedProfessionals,
    };

    // onAddService devolve true se inseriu/atualizou, false se cancelou (confirm)
    const ok = onAddService(newService, editingIndex);
    if (ok === false) {
      // pai cancelou (usuário desconcordou), não limpa os campos
      return;
    }

    // sucesso -> limpa formulário e sai do modo edição
    setServiceName("");
    setServiceDuration("");
    setSelectedProfessionals([]);
    setEditingIndex(null);
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    // useEffect preencherá o formulário
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setServiceName("");
    setServiceDuration("");
    setSelectedProfessionals([]);
  };

  const handleDeleteClick = (index) => {
    if (!window.confirm("Tem certeza que deseja remover esse serviço?")) return;
    onDeleteService(index);
    if (editingIndex === index) handleCancelEdit();
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Cadastro de Serviços</h4>

      <div className="mb-3">
        <label className="form-label">Nome do Serviço</label>
        <input
          type="text"
          className="form-control"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          placeholder="Ex: Corte Completo"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Duração</label>
        <input
          type="text"
          className="form-control"
          value={serviceDuration}
          onChange={(e) => setServiceDuration(e.target.value)}
          placeholder="Ex: 30min"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Profissionais que executam</label>
        <div className="d-flex flex-wrap gap-2">
          {Array.isArray(professionals) && professionals.length > 0 ? (
            professionals.map((p) => {
              const id = normalizeId(p._id || p.id || p);
              const isSelected = selectedProfessionals.some((sp) => sp.id === id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleProfessionalSelect(p._id || p.id || p, p.name)}
                  className={`btn ${isSelected ? "btn-success" : "btn-outline-secondary"}`}
                >
                  {p.name}
                </button>
              );
            })
          ) : (
            <p className="text-muted">Nenhum profissional cadastrado.</p>
          )}
        </div>
      </div>

      <div className="mb-3">
        <button
          className={`btn ${editingIndex !== null ? "btn-warning" : "btn-primary"} mt-1`}
          onClick={handleAddOrEditService}
        >
          {editingIndex !== null ? "Salvar Alterações" : "Adicionar Serviço"}
        </button>

        {editingIndex !== null && (
          <button
            className="btn btn-secondary mt-1 ms-2"
            onClick={handleCancelEdit}
          >
            Cancelar Edição
          </button>
        )}
      </div>

      <hr />

      <h5 className="mt-4">Serviços cadastrados</h5>
      {services.length === 0 ? (
        <p>Nenhum serviço adicionado ainda.</p>
      ) : (
        <ul className="list-group">
          {services.map((s, idx) => (
            <li
              key={`${s.name}-${idx}`}
              className="list-group-item d-flex justify-content-between align-items-start"
            >
              <div style={{ cursor: "pointer" }} onClick={() => handleEditClick(idx)}>
                <strong>{s.name}</strong> <small>({s.duration})</small>
                <div>
                  <small className="text-muted">
                    Profissionais: {Array.isArray(s.professionals) ? s.professionals.map(p => p.name || p.nome || String(p)).join(", ") : ""}
                  </small>
                </div>
              </div>

              <div className="btn-group" role="group" aria-label="ações">
                <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => handleEditClick(idx)}>
                  Editar
                </button>
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(idx)}>
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="d-flex justify-content-between mt-4">
        <button type="button" className="btn btn-secondary" onClick={prevStep}>Voltar</button>
        <div>
          <button type="button" className="btn btn-primary" onClick={nextStep}>Próximo</button>
        </div>
      </div>
    </div>
  );
}

export default Step3Servicos;
