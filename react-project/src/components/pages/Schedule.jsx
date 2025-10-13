import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { format, parse } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { padronizarTelefone } from "../../services/phoneNumber";
import BusinessSearch from "../BusinessSearch";

function Schedule() {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    businessId: "",
    businessName: "",
    businessAddress: "",
    professionalId: "",
    serviceId: "",
    data: "",
    hora: "",
  });

  const [mensagem, setMensagem] = useState("");
  const [livres, setLivres] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [services, setServices] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);

  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");



  // Quando trocar de business, resetar dependentes e carregar profissionais+serviços
  useEffect(() => {
    const businessId = formData.businessId;
    setFormData(prev => ({
      ...prev,
      professionalId: "",
      serviceId: "",
      data: "",
      hora: "",
    }));
    setLivres([]);
    setProfessionals([]);
    setServices([]);
    setAvailableDays([]);
    setSlotsError("");

    if (!businessId) return;

    const fetchAll = async () => {
      try {
        const [pResp, sResp] = await Promise.all([
          axios.get(`http://127.0.0.1:5000/businessSchedule/${businessId}/professionals`),
          axios.get(`http://127.0.0.1:5000/businessSchedule/${businessId}/services`),
        ]);
        setProfessionals(pResp.data || []);
        setServices(sResp.data || []);
        setAvailableDays([]);
      } catch (err) {
        console.error("Erro ao carregar profissionais/serviços:", err);
        setProfessionals([]);
        setServices([]);
      }
    };
    fetchAll();
  }, [formData.businessId]);

  const { businessId, professionalId, serviceId, data } = formData;

  useEffect(() => {
    
    console.log("business:", businessId)
    console.log("professional:", professionalId)
    console.log("service:", serviceId)
    console.log("=====================")
    console.log("Services array:", services)
    console.log("Professionals array:", professionals)
    if (!businessId || !professionalId || !serviceId) {
      setAvailableDays([]);
      return;
    }

    let cancelled = false;
    const fetchDays = async () => {
      try {
        const resp = await axios.get(
          `http://127.0.0.1:5000/businessSchedule/${businessId}/days`,
          { params: { professionalId, serviceId } }
        );
        if (!cancelled) setAvailableDays(resp.data || []);
      } catch (err) {
        console.error("Erro ao carregar dias disponíveis:", err);
        if (!cancelled) setAvailableDays([]);
      }
    };

    fetchDays();
    return () => { cancelled = true; };
  }, [businessId, professionalId, serviceId, services, professionals]);

  // Buscar horários livres
  useEffect(() => {
    if (!businessId || !professionalId || !serviceId || !data) {
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
        const resp = await axios.get(
          `http://127.0.0.1:5000/businessSchedule/${businessId}/slots`,
          { params: { professionalId, serviceId, date: data }, timeout: 8000 }
        );
        if (!cancelled) {
          setLivres(Array.isArray(resp.data) ? resp.data : []);
        }
      } catch (err) {
        console.error("Erro ao carregar horários disponíveis:", err);
        if (!cancelled) {
          const msg =
            err.response?.data?.msg ||
            err.response?.data ||
            err.message ||
            "Erro ao carregar horários";
          setSlotsError(String(msg));
          setLivres([]);
        }
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    };

    fetchSlots();
    return () => {
      cancelled = true;
    };
  }, [businessId, professionalId, serviceId, data]);

  // alterações no form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev, [name]: value, 
    }));
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
      toast.success(response.data?.msg || "Agendamento realizado!");
      setFormData({
        nome: "",
        telefone: "",
        businessId: "",
        businessName: "",
        businessAddress: "",
        professionalId: "",
        serviceId: "",
        data: "",
        hora: "",
      });
      setProfessionals([]);
      setServices([]);
      setLivres([]);
      setAvailableDays([]);
    } catch (error) {
      console.error("Erro ao agendar:", error);
      const errMsg =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        error.message ||
        "Erro ao realizar o agendamento.";
      toast.error(errMsg);
    }

    setTimeout(() => setMensagem(""), 5000);
  };

  const CustomInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        onClick={onClick}
        ref={ref}
        value={value}
        placeholder={placeholder}
        readOnly
      />
      <button className="btn btn-outline-secondary" type="button" onClick={onClick}>
        📅
      </button>
    </div>
  ));
  CustomInput.displayName = "CustomInput";

  const handleDateSelect = (date) => {
    if (!date) {
      setFormData(prev => ({ ...prev, data: "", hora: "" }));
      return;
    }
    const formatted = format(date, "yyyy-MM-dd");
    setFormData(prev => ({ ...prev, data: formatted, hora: "" }));
  };

  const isDateAvailable = (date) => {
    const str = format(date, "yyyy-MM-dd");
    const dia = availableDays.find(d => d.date === str);
    return dia ? dia.available : false;
  };

  
  const selectedDate = formData.data
    ? parse(formData.data, "yyyy-MM-dd", new Date())
    : null;
  

  return (
    <div className="container-fluid w-75">
      <div className="mt-5 w-75 mx-auto">
        <h2 className="mb-4 d-flex justify-content-center">Agendar Horário</h2>
        <form onSubmit={handleSubmit} className="mb-5">
          {/* Dados pessoais */}
          <h5 className="mt-4 mb-3">Dados pessoais</h5>
          <hr />

          <div className="mb-3">
            <label htmlFor="nome" className="form-label">Nome</label>
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
            <label htmlFor="telefone" className="form-label">Telefone</label>
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

          {/* Local e serviço */}
          <h5 className="mt-4 mb-3">Local e serviço</h5>
          <hr />

          <div className="mb-3">
            <label className="form-label">Local</label>
            <BusinessSearch
              onSelect={(b) =>
                setFormData((prev) => ({
                  ...prev,
                  businessId: b.id,
                  businessName: b.name,
                  businessAddress: b.address,
                }))
              }
            />
          </div>

          {formData.businessId && (
            <div className="alert alert-danger d-flex justify-content-between align-items-center">
              <div>
                <strong>{formData.businessName}</strong><br />
                <small>{formData.businessAddress}</small>
              </div>
              <button
                type="button"
                className="btn-close"
                aria-label="Remover"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  businessId: "",
                  businessName: "",
                  businessAddress: ""
                }))}
              ></button>
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="professional" className="form-label">Profissional</label>
            <select
              className="form-select"
              id="professional"
              name="professionalId"
              value={formData.professionalId}
              onChange={handleChange}
              required
              disabled={!professionals.length}
            >
              <option value="">Selecione um profissional</option>
              {professionals.map((p) => (
                <option key={p._id.$oid} value={p._id.$oid}>{p.name} - {p.role}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="service" className="form-label">Serviço</label>
            <select
              className="form-select"
              id="service"
              name="serviceId"
              value={formData.serviceId}
              onChange={handleChange}
              required
              disabled={!services.length}
            >
              <option value="">Selecione um serviço</option>
              {services.map((s) => (
                <option key={s._id.$oid} value={s._id.$oid}>{s.name} ({s.duration})</option>
              ))}
            </select>
          </div>

          {/* Agendamento */}
          <h5 className="mt-4 mb-3">Agendamento</h5>
          <hr />

          <div className="mb-3 d-flex justify-content-center mt-4">
            <label className="form-label mx-4 mt-1 fw-bold">Data</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateSelect}
              dateFormat="yyyy-MM-dd"
              customInput={<CustomInput placeholder="Selecione uma data" />}
              filterDate={isDateAvailable}
              minDate={new Date()}
            />
          </div>

          <div className="mb-3">
            <label className="form-label d-flex justify-content-center fw-bold mb-4">
              Horários disponíveis
            </label>

            {/* Mensagem inicial enquanto não há dados suficientes */}
            {!businessId || !professionalId || !serviceId || !data ? (
              <div className="alert alert-warning text-center">
                Preencha o local, profissional, serviço e data para ver os horários disponíveis.
              </div>
            ) : (
              <>
                {slotsLoading && (
                  <div className="d-flex justify-content-center my-2">
                    <div className="spinner-border me-2" role="status" aria-hidden="true"></div>
                    <div>Carregando horários...</div>
                  </div>
                )}

                {slotsError && !slotsLoading && (
                  <div className="alert alert-warning">{slotsError}</div>
                )}

                <div className="d-flex flex-wrap gap-2 justify-content-around px-2">
                  {livres.map((hora, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`btn ${formData.hora === hora ? "btn-danger" : "btn-outline-danger"}`}
                      onClick={() => handleHoraSelect(hora)}
                    >
                      {hora}
                    </button>
                  ))}
                </div>

                {/* Caso não existam horários livres */}
                {livres.length === 0 && !slotsLoading && !slotsError && (
                  <div className="text-center text-muted">
                    Nenhum horário disponível para esta data.
                  </div>
                )}
              </>
            )}
          </div>

          <button type="submit" className="btn btn-dark d-flex mx-auto mt-5 px-3" disabled={!formData.hora}>
            Agendar
          </button>
        </form>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
        />


        {mensagem && (
          <div className="alert alert-info alert-dismissible fade show mt-3" role="alert">
            {mensagem}
            <button type="button" className="btn-close" onClick={() => setMensagem("")}></button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Schedule;
