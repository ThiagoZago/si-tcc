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
  const [livres, setLivres] = useState([]); // array de horários
  const [businesses, setBusinesses] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [services, setServices] = useState([]);

  // status dos slots
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");

  // Buscar locais
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/businessSchedule");
        setBusinesses(response.data || []);
      } catch (error) {
        console.error("Erro ao carregar locais:", error);
        setBusinesses([]);
      }
    };
    fetchBusinesses();
  }, []);

  // Quando trocar de business, resetar dependentes e carregar profissionais+serviços
  useEffect(() => {
    const businessId = formData.businessId;
    // resetar dependentes
    setFormData(prev => ({
      ...prev,
      professional: "",
      service: "",
      data: "",
      hora: "",
    }));
    setLivres([]);
    setProfessionals([]);
    setServices([]);
    setSlotsError("");

    if (!businessId) return;

    const fetchBoth = async () => {
      try {
        const [pResp, sResp] = await Promise.all([
          axios.get(`http://127.0.0.1:5000/businessSchedule/${businessId}/professionals`),
          axios.get(`http://127.0.0.1:5000/businessSchedule/${businessId}/services`)
        ]);
        setProfessionals(pResp.data || []);
        setServices(sResp.data || []);
      } catch (err) {
        console.error("Erro ao carregar profissionais/serviços:", err);
        // manter arrays vazios para não bloquear UI
        setProfessionals([]);
        setServices([]);
      }
    };
    fetchBoth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.businessId]); // só quando businessId muda

  // Buscar horários livres quando todos os campos necessários forem preenchidos
  useEffect(() => {
    const { businessId, professional, service, data } = formData;
    // só tenta buscar quando todos preenchidos
    if (!businessId || !professional || !service || !data) {
      setLivres([]);
      setSlotsError("");
      setSlotsLoading(false);
      return;
    }

    let cancelled = false;
    const fetchSlots = async () => {
      setSlotsLoading(true);
      setSlotsError("");
      setLivres([]);

      try {
        console.debug("[slots] request params:", { businessId, professional, service, date: data });
        const resp = await axios.get(
          `http://127.0.0.1:5000/businessSchedule/${businessId}/slots`,
          { params: { professional, service, date: data }, timeout: 8000 }
        );
        console.debug("[slots] resposta:", resp.data);
        if (cancelled) return;
        // garantir que sempre recebemos array
        setLivres(Array.isArray(resp.data) ? resp.data : []);
      } catch (err) {
        console.error("Erro ao carregar horários disponíveis:", err);
        if (cancelled) return;
        setLivres([]);
        // tenta extrair mensagem do backend
        const msg = err.response?.data?.msg || err.response?.data || err.message || "Erro ao carregar horários";
        setSlotsError(String(msg));
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    };

    fetchSlots();

    return () => {
      cancelled = true;
    };
  }, [formData.businessId, formData.professional, formData.service, formData.data]);

  // alterações no form (resetar hora quando trocar profissional/serviço/data)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      let next = { ...prev, [name]: value };
      if (name === "professional" || name === "service" || name === "data") {
        next.hora = "";
        // limpar slots ao trocar campo-chave pra evitar mostrar horários antigos
        setLivres([]);
      }
      return next;
    });
  };

  const handleHoraSelect = (hora) => {
    setFormData(prev => ({ ...prev, hora }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const telefonePadronizado = padronizarTelefone(formData.telefone || "");
      const requestData = { ...formData, telefone: telefonePadronizado };

      const response = await axios.post("http://127.0.0.1:5000/agendar", requestData);
      setMensagem(response.data?.msg || "Agendamento realizado!");
      // limpar formulário
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
      setLivres([]);
    } catch (error) {
      console.error("Erro ao agendar:", error);
      const errMsg = error.response?.data?.msg || error.response?.data?.message || error.message || "Erro ao realizar o agendamento.";
      setMensagem(String(errMsg));
    }

    setTimeout(() => setMensagem(""), 5000);
  };

  return (
    <div className="container-fluid w-75 mx-auto">
      <div className="mt-5">
        <h2 className="mb-4">Agendar Horário</h2>
        <form onSubmit={handleSubmit} className="mb-5">
          {/* Nome */}
          <div className="mb-3">
            <label htmlFor="nome" className="form-label">Nome</label>
            <input type="text" className="form-control" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
          </div>

          {/* Telefone */}
          <div className="mb-3">
            <label htmlFor="telefone" className="form-label">Telefone</label>
            <input type="tel" className="form-control" id="telefone" name="telefone" value={formData.telefone} pattern="^[0-9]{9,11}$" onChange={handleChange} required />
          </div>

          {/* Local */}
          <div className="mb-3">
            <label htmlFor="businessId" className="form-label">Local</label>
            <select className="form-select" id="businessId" name="businessId" value={formData.businessId} onChange={handleChange} required>
              <option value="">Selecione um local</option>
              {businesses.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>

          {/* Profissional */}
          <div className="mb-3">
            <label htmlFor="professional" className="form-label">Profissional</label>
            <select className="form-select" id="professional" name="professional" value={formData.professional} onChange={handleChange} required disabled={!professionals.length}>
              <option value="">Selecione um profissional</option>
              {professionals.map((p, i) => <option key={i} value={p.name}>{p.name} - {p.role}</option>)}
            </select>
          </div>

          {/* Serviço */}
          <div className="mb-3">
            <label htmlFor="service" className="form-label">Serviço</label>
            <select className="form-select" id="service" name="service" value={formData.service} onChange={handleChange} required disabled={!services.length}>
              <option value="">Selecione um serviço</option>
              {services.map((s, i) => <option key={i} value={s.name}>{s.name} ({s.duration})</option>)}
            </select>
          </div>

          {/* Data */}
          <div className="mb-3">
            <label htmlFor="data" className="form-label">Data</label>
            <input type="date" className="form-control" id="data" name="data" value={formData.data} onChange={handleChange} required />
          </div>

          {/* Horários (cards) */}
          <div className="mb-3">
            <label className="form-label">Horários disponíveis</label>

            {/* Loading */}
            {slotsLoading && (
              <div className="d-flex align-items-center my-2">
                <div className="spinner-border me-2" role="status" aria-hidden="true"></div>
                <div>Carregando horários...</div>
              </div>
            )}

            {/* Error */}
            {slotsError && !slotsLoading && (
              <div className="alert alert-warning">{slotsError}</div>
            )}

            {/* Sem horários */}
            {!slotsLoading && !slotsError && (formData.businessId && formData.professional && formData.service && formData.data) && livres.length === 0 && (
              <div className="text-muted mb-2">Sem horários disponíveis para esta data.</div>
            )}

            {/* Grid de cards */}
            <div className="row g-3">
              {livres.map((hora, idx) => (
                <div key={idx} className="col-6 col-md-4 col-lg-3">
                  <div
                    className={`card text-center shadow-sm ${formData.hora === hora ? "border-primary" : "border-light"}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleHoraSelect(hora)}
                  >
                    <div className="card-body p-3">
                      <h6 className={`card-title mb-0 ${formData.hora === hora ? "text-primary fw-bold" : "text-dark"}`}>{hora}</h6>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-success" disabled={!formData.hora}>Agendar</button>
        </form>

        {mensagem && <div className="alert alert-info mt-3">{mensagem}</div>}
      </div>
    </div>
  );
}

export default Schedule;
