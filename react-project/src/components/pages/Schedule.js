import React, { useState, useEffect } from "react";
import axios from "axios";
import { padronizarTelefone } from "../../services/phoneNumber";

function Schedule() {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    businessId: "",
    professional: "",
    service: "",
    data: "",
    hora: "",
  });

  const [mensagem, setMensagem] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [services, setServices] = useState([]);

  // Buscar locais
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/businessSchedule");
        setBusinesses(response.data);
      } catch (error) {
        console.error("Erro ao carregar locais:", error);
      }
    };
    fetchBusinesses();
  }, []);

  // Buscar profissionais quando businessId mudar
  useEffect(() => {
    if (!formData.businessId) return;
    const fetchProfessionals = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/businessSchedule/${formData.businessId}/professionals`
        );
        setProfessionals(response.data);
      } catch (error) {
        console.error("Erro ao carregar profissionais:", error);
      }
    };
    fetchProfessionals();
  }, [formData.businessId]);

  // Buscar serviços quando businessId mudar
  useEffect(() => {
    if (!formData.businessId) return;
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/businessSchedule/${formData.businessId}/services`
        );
        setServices(response.data);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      }
    };
    fetchServices();
  }, [formData.businessId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const telefonePadronizado = padronizarTelefone(formData.telefone);

      const requestData = {
        ...formData,
        telefone: telefonePadronizado,
      };

      const response = await axios.post(
        "http://127.0.0.1:5000/agendar",
        requestData
      );

      setMensagem(response.data.msg);
      setFormData({
        nome: "",
        telefone: "",
        businessId: "",
        professional: "",
        service: "",
        data: "",
        hora: "",
      });
      setProfessionals([]);
      setServices([]);
    } catch (error) {
      setMensagem(error.response?.data?.msg || "Erro ao realizar o agendamento.");
    }

    setTimeout(() => {
      setMensagem("");
    }, 5000);
  };

  return (
    <div className="container-fluid w-50 justify-content-center">
      <div className="mt-5">
        <h2 className="mb-4">Agendar Horário</h2>
        <form onSubmit={handleSubmit} className="mb-5">
          <div className="mb-3">
            <label htmlFor="nome" className="form-label">
              Nome
            </label>
            <input
              type="text"
              className="form-control"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="telefone" className="form-label">
              Telefone
            </label>
            <input
              type="tel"
              className="form-control"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              pattern="^[0-9]{9,11}$"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="businessId" className="form-label">
              Local
            </label>
            <select
              className="form-select"
              id="businessId"
              name="businessId"
              value={formData.businessId}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um local</option>
              {businesses.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="professional" className="form-label">
              Profissional
            </label>
            <select
              className="form-select"
              id="professional"
              name="professional"
              value={formData.professional}
              onChange={handleChange}
              required
              disabled={!professionals.length}
            >
              <option value="">Selecione um profissional</option>
              {professionals.map((p, index) => (
                <option key={index} value={p.name}>
                  {p.name} - {p.role}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="service" className="form-label">
              Serviço
            </label>
            <select
              className="form-select"
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
              disabled={!services.length}
            >
              <option value="">Selecione um serviço</option>
              {services.map((s, index) => (
                <option key={index} value={s.name}>
                  {s.name} ({s.duration})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="data" className="form-label">
              Data
            </label>
            <input
              type="date"
              className="form-control"
              id="data"
              name="data"
              value={formData.data}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="hora" className="form-label">
              Hora
            </label>
            <input
              type="time"
              className="form-control"
              id="hora"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Agendar
          </button>
        </form>
        {mensagem && <div className="alert alert-info mt-3">{mensagem}</div>}
      </div>
    </div>
  );
}

export default Schedule;
