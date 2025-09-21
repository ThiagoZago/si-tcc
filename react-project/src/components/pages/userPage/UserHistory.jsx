import React, { useState, useEffect } from "react";
import axios from "axios";

function UserHistory() {
  const [filtro, setFiltro] = useState("futuro");
  const [agendamentos, setAgendamentos] = useState([]);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const fetchAgendamentos = async () => {
        try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://127.0.0.1:5000/agendamentos?tipo=${filtro}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        setAgendamentos(response.data.agendamentos || []);
        setMensagem(response.data.msg || "");
        } catch (error) {
        setMensagem(error.response?.data?.msg || "Erro ao carregar agendamentos.");
        }
    };

    fetchAgendamentos();
    }, [filtro]);

  return (
    <div className="tab-pane fade show active">
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Meus Agendamentos</h4>
                <select
                className="form-select w-auto"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                >
                <option value="futuros">Futuros</option>
                <option value="passados">Passados</option>
                </select>
            </div>

            {mensagem && <div className="w-75 mx-auto mt-4 alert alert-warning text-center">{mensagem}</div>}

            <ul className="list-group">
                {agendamentos.map((agendamento, index) => (
                <li key={index} className="list-group-item">
                    <strong>Data:</strong> {agendamento.data} <br />
                    <strong>Hora:</strong> {agendamento.hora} <br />
                    <strong>Serviço:</strong> {agendamento.service} <br />
                    <strong>Profissional:</strong> {agendamento.professional} <br />
                    <strong>Local:</strong> {agendamento.business_name}
                </li>
                ))}
            </ul>
        </div>
    </div>
  );
}

export default UserHistory;
