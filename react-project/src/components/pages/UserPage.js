import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { logout } from "../../services/authService";

function UserPage() {
    const navigate = useNavigate();
    const [abaAtiva, setAbaAtiva] = useState("perfil");

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
        <div className="mt-4 w-50">
          <ul className="nav nav-tabs justify-content-center bg-light p-2 rounded shadow">
            <li className="nav-item">
              <button
                className={`nav-link ${abaAtiva === "perfil" ? "active" : ""}`}
                onClick={() => setAbaAtiva("perfil")}
              >
                Perfil
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${abaAtiva === "configuracoes" ? "active" : ""}`}
                onClick={() => setAbaAtiva("configuracoes")}
              >
                Configurações
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${abaAtiva === "historico" ? "active" : ""}`}
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
                <p>Aqui aparece o histórico de agendamentos.</p>
              </div>
            )}
          </div>
        </div>
        <button className="btn btn-danger" onClick={handleLogout}>Sair</button>
      </div>
      

  );
}

export default UserPage;
