import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axiosInstance from "../../../utils/axiosInterceptor";

import Modal from "bootstrap/js/dist/modal";

const normalizeId = (raw) => {
  if (raw === null || raw === undefined) return String(raw);
  if (typeof raw === "object") {
    if (raw.$oid) return String(raw.$oid);
    if (raw.$id) return String(raw.$id);
    try { return String(raw); } catch { return JSON.stringify(raw); }
  }
  return String(raw);
};

function ServiceSettings() {

  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [serviceName, setServiceName] = useState("");
  const [serviceDuration, setServiceDuration] = useState("");
  const [selectedProfessionals, setSelectedProfessionals] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [serviceNameModal, setServiceNameModal] = useState(null);
  const [serviceIdModal, setServiceIdModal] = useState(null);

  const modalRef = useRef(null);
  const modalInstanceRef  = useRef(null);

  // 🔹 Buscar dados iniciais
  useEffect(() => {
    fetchServices();
    fetchProfessionals();
    if (modalRef.current) {
      modalInstanceRef.current = new Modal(modalRef.current, {
        backdrop: "static",
      });
    }
  }, []);

  const openModal = (index) => {
    modalInstanceRef.current?.show();
    const s = services[index];
    setServiceNameModal(s.name);
    setServiceIdModal(s._id);
  };

  const closeModal = () => {
    modalInstanceRef.current?.hide();
    setServiceNameModal(null);
    setServiceIdModal(null);
  };

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get("/services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data);
      toast.info(res.data.msg || "Serviços carregados com sucesso.")
    } catch (err) {
      toast.error(`Erro ao carregar serviços: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessionals = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get("/professionals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfessionals(res.data);
      toast.info(res.data.msg || "Profissionais carregados com sucesso.")
    } catch (err) {
      toast.error(`Erro ao salvar serviço: ${err}`);
    }
  };

  // 🔹 Seleção de profissional
  const handleProfessionalSelect = (rawId, name) => {
    const id = normalizeId(rawId);
    setSelectedProfessionals((prev) => {
      const exists = prev.some((p) => p.id === id);
      if (exists) return prev.filter((p) => p.id !== id);
      return [...prev, { id, name }];
    });
  };

  // 🔹 Adicionar ou editar serviço
  const handleAddService = async () => {
    if (!serviceName.trim() || !serviceDuration.trim() || selectedProfessionals.length === 0) {
      toast.warn("Preencha o nome, duração e selecione ao menos um profissional.");
      return;
    }

    const payload = {
      name: serviceName.trim(),
      duration: serviceDuration.trim(),
      professionals: selectedProfessionals.map((p) => ({ id: p.id, name: p.name })),
    };

    try {
      const token = localStorage.getItem("token");

      if (editingIndex !== null) {
        // Atualização
        const service = services[editingIndex];
        await axiosInstance.put(`/services/${service._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Serviço atualizado com sucesso!");
      } else {
        // Criação
        await axiosInstance.post("/services", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Serviço cadastrado com sucesso!");
      }

      // Atualiza lista e limpa campos
      fetchServices();
      resetForm();
    } catch (err) {
      toast.error(`Erro ao salvar serviço: ${err}`);
    }
  };

  const resetForm = () => {
    setServiceName("");
    setServiceDuration("");
    setSelectedProfessionals([]);
    setEditingIndex(null);
  };

  const handleEditClick = (index) => {
    const s = services[index];
    if (!s) return;
    setEditingIndex(index);
    setServiceName(s.name || "");
    setServiceDuration(s.duration || "");
    setSelectedProfessionals(
      (s.professionals || []).map((p) => ({
        id: normalizeId(p._id || p.id || p),
        name: p.name || p.nome || String(p),
      }))
    );
  };

  const handleDeleteClick = async (serviceIdModal) => {
    closeModal();
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.delete(`/services/${serviceIdModal}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.msg || "Serviço excluído com sucesso!")
      fetchServices();
    } catch (err) {
      toast.error(`Erro ao excluir serviço: ${err}`);
    }
  };

  const goBack = async () => {
    navigate("/inicio");
  }

  return (
    <div className="container py-5">
      <h4 className="mb-3">Cadastro/Atualização de Serviços</h4>

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
          {professionals.length > 0 ? (
            professionals.map((p) => {
              const id = normalizeId(p._id || p.id);
              const isSelected = selectedProfessionals.some((sp) => sp.id === id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleProfessionalSelect(p._id || p.id, p.name)}
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
          onClick={handleAddService}
        >
          {editingIndex !== null ? "Salvar Alterações" : "Adicionar Serviço"}
        </button>

        {editingIndex !== null && (
          <button
            className="btn btn-secondary mt-1 ms-2"
            onClick={resetForm}
          >
            Cancelar Edição
          </button>
        )}
      </div>

      <hr />

      <h5 className="mt-4">Serviços cadastrados</h5>
      {loading ? (
        <p>Carregando...</p>
      ) : services.length === 0 ? (
        <p>Nenhum serviço adicionado ainda.</p>
      ) : (
        <ul className="list-group">
          {services.map((s, idx) => (
            <li
              key={s._id || idx}
              className="list-group-item d-flex justify-content-between align-items-start"
            >
              <div style={{ cursor: "pointer" }} onClick={() => handleEditClick(idx)}>
                <strong>{s.name}</strong> <small>({s.duration})</small>
                <div>
                  <small className="text-muted">
                    Profissionais: {(s.professionals || []).map(p => p.name).join(", ")}
                  </small>
                </div>
              </div>

              <div className="btn-group" role="group">
                <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditClick(idx)}>
                  Editar
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => openModal(idx)}>
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="d-flex justify-content-end mt-4">
        <button className="btn btn-secondary" onClick={goBack}>Voltar</button>
      </div>
      {/* Modal Bootstrap */}
      <div
        ref={modalRef}
        className="modal fade"
        id="confirmDeleteModal"
        tabIndex="-1"
        aria-labelledby="confirmDeleteLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="confirmDeleteLabel">
                Atenção!
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
                aria-label="Fechar"
              ></button>
            </div>
            <div className="modal-body">
              Tem certeza que deseja excluir o serviço <strong>"{serviceNameModal}"</strong>? Esta ação não poderá ser desfeita!
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" onClick={() => handleDeleteClick(serviceIdModal)}>
                Excluir serviço
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
}

export default ServiceSettings