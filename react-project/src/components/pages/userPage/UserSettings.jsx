import React from "react";

function UserSettings({ navigate }) {
  return (
    <div className="tab-pane fade show active">
      <h4>Configurações</h4>
      <p>Aqui o usuário pode alterar as configurações.</p>
      <button onClick={() => navigate("/configuracao-empresa")} className="btn btn-outline-dark">
        Configure aqui
      </button>
    </div>
  );
}

export default UserSettings;
