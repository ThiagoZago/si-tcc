function UserSettings({ navigate }) {
  return (
    <div className="tab-pane fade show active">
      <h4>Altere o que for necessário</h4>
      <div className="container p-4 mt-3">
        <div className="d-flex justify-content-between mt-4">
          <p>Dados gerais da empresa.</p>
          <button onClick={() => navigate("/configuracao-empresa")} className="btn btn-outline-dark">
            Empresa
          </button>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <p>Dados dos serviços prestados.</p>
          <button onClick={() => navigate("/configuracao-servicos")} className="btn btn-outline-dark">
            Serviços
          </button>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <p>Dados dos profissionais ativos.</p>
          <button onClick={() => navigate("/configuracao-profissionais")} className="btn btn-outline-dark">
            Profissionais
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserSettings;
