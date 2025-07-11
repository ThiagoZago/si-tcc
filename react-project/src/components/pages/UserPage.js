import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import Container from "../layout/Container";
import Button from "../ui/Button";
import styles from "./UserPage.module.css";

const tabs = [
  { id: "perfil", label: "Perfil", icon: "fas fa-user" },
  { id: "configuracoes", label: "Configurações", icon: "fas fa-cog" },
  { id: "historico", label: "Histórico", icon: "fas fa-history" }
];

function UserPage() {
  const [activeTab, setActiveTab] = useState("perfil");
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "perfil":
        return (
          <div>
            <h4>Perfil do Usuário</h4>
            <p>Gerencie suas informações pessoais e preferências.</p>
            <div className="row">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Informações Básicas</h5>
                    <p className="card-text">Atualize seus dados pessoais.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Preferências</h5>
                    <p className="card-text">Configure suas preferências de notificação.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "configuracoes":
        return (
          <div>
            <h4>Configurações</h4>
            <p>Personalize sua experiência na plataforma.</p>
            <div className="row">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Serviços</h5>
                    <p className="card-text">Gerencie seus serviços e preços.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Horários</h5>
                    <p className="card-text">Configure seus horários de funcionamento.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Notificações</h5>
                    <p className="card-text">Personalize suas notificações.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "historico":
        return (
          <div>
            <h4>Histórico de Agendamentos</h4>
            <p>Visualize todos os seus agendamentos anteriores.</p>
            <div className="alert alert-info">
              <i className="fas fa-info-circle me-2"></i>
              Funcionalidade em desenvolvimento. Em breve você poderá visualizar todo o histórico de agendamentos.
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0 text-white">Painel do Usuário</h3>
            <Button variant="secondary" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt me-2"></i>
              Sair
            </Button>
          </div>
        </Container>
      </div>

      <Container>
        <div className={styles.content}>
          <ul className={`nav nav-tabs ${styles.tabs}`}>
            {tabs.map((tab) => (
              <li key={tab.id} className="nav-item">
                <button
                  className={`nav-link ${activeTab === tab.id ? styles.active : styles.inactive}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <i className={`${tab.icon} me-2`}></i>
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.tabContent}>
            {renderTabContent()}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default UserPage;