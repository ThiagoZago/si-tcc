import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

import styles from "./UserPage.module.css";
import { logout } from "../../services/authService";

function UserPage() {
    const navigate = useNavigate();
    const [abaAtiva, setAbaAtiva] = useState("perfil");

    // const [agendamentos, setAgendamentos] = useState([]);
    // const [mensagem, setMensagem] = useState("");
  
    // useEffect(() => {
    //   const fetchAgendamentos = async () => {
    //     try {
    //       const token = localStorage.getItem("token"); // Obtém o token JWT armazenado
    //       const response = await axios.get("http://127.0.0.1:5000/agendamentos_passados", {
    //         headers: { Authorization: `Bearer ${token}` },
    //       });
    //       setAgendamentos(response.data.agendamentos);
    //     } catch (error) {
    //       setMensagem(error.response?.data?.msg || "Erro ao carregar agendamentos.");
    //     }
    //   };
  
    //   fetchAgendamentos();
    // }, []);

    const handleLogout = () => {
      logout();
      navigate("/");
    };

  return (
      <div className="d-flex flex-column align-items-center vh-100">
        {/* Barra de Navegação */}
        <div className="bg-danger text-white p-3 w-100 text-center shadow">
          <h3 className="mb-0">Painel do Usuário</h3>
        </div>
  
        {/* Contêiner das Abas */}
        <div className="mt-4 vw-70">
          <ul className="nav nav-tabs justify-content-center bg-light p-2 rounded shadow">
            <li className="nav-item">
              <button
                className={`nav-link ${abaAtiva === "perfil" ? styles.activeCss : styles.inactiveCss}`}
                onClick={() => setAbaAtiva("perfil")}
              >
                Perfil
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${abaAtiva === "configuracoes" ? styles.activeCss : styles.inactiveCss}`}
                onClick={() => setAbaAtiva("configuracoes")}
              >
                Configurações
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${abaAtiva === "historico" ? styles.activeCss : styles.inactiveCss}`}
                onClick={() => setAbaAtiva("historico")}
              >
                Histórico
              </button>
            </li>
          </ul>
  
          {/* Conteúdo das Abas */}
          <div className="tab-content mt-3 bg-white p-4 rounded shadow">
            {abaAtiva === "perfil" && (
              <div className="tab-pane fade show active">
                <h4>Perfil do Usuário</h4>
                <p>Aqui ficam as informações do perfil do usuário.</p>
              </div>
            )}
            {abaAtiva === "configuracoes" && (
              <div className="tab-pane fade show active">
                <h4>Configurações</h4>
                <p>Aqui o usuário pode alterar as configurações.</p>
              </div>
            )}
            {abaAtiva === "historico" && (
              <div className="tab-pane fade show active">
                <h4>Histórico de Agendamentos</h4>
                <div className="container mt-5">
                  <h2 className="mb-4">Agendamentos Passados</h2>
                  {/* {mensagem && <div className="alert alert-danger">{mensagem}</div>}
                  <ul className="list-group">
                    {agendamentos.map((agendamento, index) => (
                      <li key={index} className="list-group-item">
                        <strong>Data:</strong> {agendamento.data} <br />
                        <strong>Hora:</strong> {agendamento.hora}
                      </li>
                    ))}
                  </ul> */}
                </div>
              </div>
            )}
          </div>
        </div>
        <button className="btn btn-danger" onClick={handleLogout}>Sair</button>
      </div>
      

  );
}

export default UserPage;
