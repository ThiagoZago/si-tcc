import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"
import axiosInstance from "../../../utils/axiosInterceptor";
import AvailabilityProfessionals from './AvailabilityProfessionals';

import Modal from "bootstrap/js/dist/modal";

function ProfessionalSettings() {

  const navigate = useNavigate();
  const [originalProfessionals, setOriginalProfessionals] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [professionalNameModal, setProfessionalNameModal] = useState(null);
  const [professionalIdModal, setProfessionalIdModal] = useState(null);

  const modalRef = useRef(null);
  const modalInstanceRef  = useRef(null);

  useEffect(() => {
    fetchProfessionals();
    if (modalRef.current) {
      modalInstanceRef.current = new Modal(modalRef.current, {
        backdrop: "static",
      });
    }
  }, []);
  
  const fetchProfessionals = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get("/professionals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfessionals(res.data);
      setOriginalProfessionals(JSON.parse(JSON.stringify(res.data)))
      toast.info("Dados carregados!")
    } catch (err) {
      toast.error(`Erro ao carregar profissionais: ${err}`)
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    const novo = {
      name: "",
      role: "",
      availability: {
        segunda: {},
        terca: {},
        quarta: {},
        quinta: {},
        sexta: {},
        sabado: {},
        domingo: {}
      },
      exceptions: []
    };
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.post("/professionals", novo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Criado:", res.data);
      fetchProfessionals();
    } catch (err) {
      console.error("Erro ao criar profissional:", err);
    }
  };

  const handleChange = async (index, eOrData) => {
    const name = eOrData?.target?.name || eOrData?.name;
    const value = eOrData?.target?.value ?? eOrData?.value;

    if (!name) {
      console.warn("handleChange chamado sem nome de campo válido");
      return;
    }

    setProfessionals((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, [name]: value } : p
      )
    );
  };

  const openModal = (index) => {
    modalInstanceRef.current?.show();
    const p = professionals[index];
    setProfessionalNameModal(p.name);
    setProfessionalIdModal(p._id);
  };

  const closeModal = () => {
    modalInstanceRef.current?.hide();
    setProfessionalNameModal(null);
    setProfessionalIdModal(null);
  };

  const isValidProfessional = (prof) => {
    // Nome e função obrigatórios
    if (!prof.name || prof.name.trim() === "") return false;
    if (!prof.role || prof.role.trim() === "") return false;
    return true;
  };
  const hasInvalidProfessionals = professionals.some((p) => !isValidProfessional(p));


  const handleDelete = async () => {
    closeModal();
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/professionals/${professionalIdModal}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfessionals((prev) => prev.filter((p) => p._id !== professionalIdModal));
      toast.success(`Profissional "${professionalNameModal}" removido com sucesso!`);
    } catch (err) {
      toast.error("Erro ao excluir profissional.");
    }
  };

  const handleSaveAll = async () => {
    try {
      const token = localStorage.getItem("token");

      const changedProfessionals = professionals.filter((prof, index) => {
        const original = originalProfessionals[index];
        return JSON.stringify(prof) !== JSON.stringify(original);
      });

      if (changedProfessionals.length === 0) {
        toast.info("Nenhuma alteração detectada.");
        return;
      }

      await Promise.all(
        changedProfessionals.map((prof) => {
          const { _id, ...data } = prof;
          const normalizedAvailability = normalizeAvailability(prof.availability);
          const payload = {
            ...data,
            availability: normalizedAvailability,
          };
          return axiosInstance.put(`/professionals/${_id}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
        })
      );

      toast.success("Alterações salvas com sucesso!");
      fetchProfessionals();
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao salvar alterações.";
      toast.error(msg);
    }
  };

  const goBack = async () => {
    navigate("/inicio");
  }

  const normalizeAvailability = (availability) => {
    const days = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];

    const normalized = {};
    for (const day of days) {
      const info = availability?.[day] || {};
      normalized[day] = info.active
        ? {
            active: true,
            start: info.start || "",
            end: info.end || "",
            lunchStart: info.lunchStart || "",
            lunchEnd: info.lunchEnd || "",
          }
        : { active: false };
    }

    return normalized;
  };

  return (
    <div className="container py-5">
      {hasInvalidProfessionals && (
        <div className="alert alert-warning py-2">
          Preencha todos os campos de <strong>Nome, Função e Horários</strong> antes de salvar.
        </div>
      )}

      <h2 className="h5 mb-4">Profissionais</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        professionals.map((prof, index) => (
          <div key={prof._id || index} className="border rounded p-3 mb-4">
            <div className="row mb-3">
              <div className="col-md-5">
                <input
                  type="text"
                  name="name"
                  value={prof.name}
                  onChange={(e) => handleChange(index, e)}
                  className="form-control"
                  placeholder="Nome"
                />
              </div>
              <div className="col-md-5">
                <input
                  type="text"
                  name="role"
                  value={prof.role}
                  onChange={(e) => handleChange(index, e)}
                  className="form-control"
                  placeholder="Função"
                />
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-outline-danger w-100"
                  onClick={() => openModal(index)}
                >
                  Remover
                </button>
              </div>
            </div>

            <AvailabilityProfessionals
              availability={prof.availability}
              setAvailability={(newAvail) =>
                handleChange(index, { target: { name: "availability", value: newAvail } })
              }
              exceptions={prof.exceptions}
              setExceptions={(newEx) =>
                handleChange(index, { target: { name: "exceptions", value: newEx } })
              }
            />
          </div>
        ))
      )}

      <div className="d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={goBack}>Voltar</button>
        <div>
          <button className="btn btn-outline-primary me-2" onClick={handleAdd}>Novo profissional</button>
          <button className="btn btn-success" onClick={handleSaveAll} disabled={hasInvalidProfessionals}>Salvar</button>
        </div>
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
              Tem certeza que deseja excluir profissional <strong>"{professionalNameModal}"</strong>? Esta ação não poderá ser desfeita!
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" onClick={() => handleDelete()}>
                Excluir profissional
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

export default ProfessionalSettings