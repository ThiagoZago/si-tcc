import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInterceptor";
import AvailabilityProfessionals from './AvailabilityProfessionals';

function ProfessionalSettings() {

  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfessionals();
  }, []);
  
  const fetchProfessionals = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get("/professionals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfessionals(res.data);
    } catch (err) {
      console.error("Erro ao carregar profissionais:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    const novo = { name: "", role: "", availability: Array(7).fill({}), exceptions: [] };
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

  const handleChange = async (index, e) => {
    const prof = professionals[index];
    const updated = { ...prof, [e.target.name]: e.target.value };
    setProfessionals((prev) => prev.map((p, i) => (i === index ? updated : p)));

    try {
      const token = localStorage.getItem("token");
      await axiosInstance.put(`/professionals/${prof._id}`, updated, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Erro ao atualizar profissional:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Excluir este profissional?")) return;
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/professionals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProfessionals();
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  };

  // const handleAvailabilityChange = (index, newAvailability) => {
  //   const updated = [...professionals];
  //   updated[index].availability = newAvailability;
  //   setProfessionals(updated);
  // };

  // const handleExceptionsChange = (index, newExceptions) => {
  //   const updated = [...professionals];
  //   updated[index].exceptions = newExceptions;
  //   setProfessionals(updated);
  // };

  const goBack = async () => {
    navigate("/inicio");
  }

  return (
    <div className="container py-5">
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
                  onClick={() => handleDelete(prof._id)}
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
          <button className="btn btn-success" onClick={handleChange}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

export default ProfessionalSettings