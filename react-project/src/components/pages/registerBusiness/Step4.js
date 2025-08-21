
function Step4Revisao({ business, professionals, services, prevStep, onSave }) {


  return (
    <div>
      <h2 className="h5 mb-4">Revisão</h2>
      <h5>Dados Básicos</h5>
      <p><strong>Nome:</strong> {business.name}</p>
      <p><strong>Tipo:</strong> {business.type}</p>
      <p><strong>Telefone:</strong> {business.phone}</p>
      <p><strong>Email:</strong> {business.email}</p>
      <p><strong>Descrição:</strong> {business.description}</p>

      <h5 className="mt-4">Endereço</h5>
      <p><strong>Rua:</strong> {business.address.street}, {business.address.number} - {business.address.complement}</p>
      <p><strong>Bairro:</strong> {business.address.neighborhood}</p>
      <p><strong>Cidade/Estado:</strong> {business.address.city} - {business.address.state}</p>
      <p><strong>CEP:</strong> {business.address.cep}</p>

      <h5 className="mt-4">Profissionais</h5>
      <ul>{professionals.map((p, i) => <li key={i}>{p.name} - {p.role}</li>)}</ul>

      <h5 className="mt-4">Serviços</h5>
      <ul>{services.map((s, i) => <li key={i}>{s.name} ({s.duration}) - Profissional: {s.professional}</li>)}</ul>

      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-secondary" onClick={prevStep}>Voltar</button>
        <button className="btn btn-success" onClick={onSave}>Salvar</button>
      </div>
    </div>
    
  );

  
}

export default Step4Revisao;
