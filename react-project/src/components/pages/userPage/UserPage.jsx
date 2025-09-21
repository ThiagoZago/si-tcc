import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

import styles from "./UserPage.module.css";
import { logout } from "../../../services/authService";

import UserProfile from "./UserProfile";
import UserSettings from "./UserSettings";
import UserHistory from "./UserHistory";

function UserPage() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState("perfil");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const abas = {
    perfil: <UserProfile />,
    configuracoes: <UserSettings navigate={navigate} />,
    historico: <UserHistory />,
  };

  return (
    <div className="d-flex flex-column align-items-center min-vh-100">
      {/* Barra de Navegação */}
      <div className="bg-danger text-white p-3 w-100 text-center shadow">
        <h3 className="mb-0">Painel do Usuário</h3>
      </div>

      {/* Tabs */}
      <div className="mt-4 w-50">
        <ul className="nav nav-tabs justify-content-center bg-light p-2 rounded shadow">
          <li className="nav-item">
            <button
              className={`nav-link ${abaAtiva === "perfil" ? styles.activeCss : styles.inactiveCss}`}
              onClick={() => setAbaAtiva("perfil")}
              aria-selected={abaAtiva === "perfil"}
              role="tab"
            >
              Perfil
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${abaAtiva === "configuracoes" ? styles.activeCss : styles.inactiveCss}`}
              onClick={() => setAbaAtiva("configuracoes")}
              aria-selected={abaAtiva === "configuracoes"}
              role="tab"
            >
              Configurações
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${abaAtiva === "historico" ? styles.activeCss : styles.inactiveCss}`}
              onClick={() => setAbaAtiva("historico")}
              aria-selected={abaAtiva === "historico"}
              role="tab"
            >
              Histórico
            </button>
          </li>
        </ul>

        {/* Conteúdo da Aba */}
        <div className="tab-content mt-3 bg-white p-4 rounded shadow">
          {abas[abaAtiva]}
        </div>
      </div>

      <button className="btn btn-danger mt-3 mb-5" onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}

export default UserPage;
