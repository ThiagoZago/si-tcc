function Step3Servicos({ professionals, services, setServices, prevStep, nextStep }) {
  const handleAdd = () => {
    setServices([...services, { name: '', duration: '', professional: '' }]);
  };

  const handleChange = (index, e) => {
    const updated = [...services];
    updated[index][e.target.name] = e.target.value;
    setServices(updated);
  };

  return (
    <div>
      <h2 className="h5 mb-4">Serviços</h2>
      {services.map((serv, index) => (
        <div className="row mb-3" key={index}>
          <div className="col-md-4">
            <input type="text" name="name" value={serv.name} onChange={(e) => handleChange(index, e)} className="form-control" placeholder="Serviço" />
          </div>
          <div className="col-md-4">
            <input type="text" name="duration" value={serv.duration} onChange={(e) => handleChange(index, e)} className="form-control" placeholder="Duração" />
          </div>
          <div className="col-md-4">
            <select name="professional" value={serv.professional} onChange={(e) => handleChange(index, e)} className="form-select">
              <option value="">Selecione um profissional</option>
              {professionals.map((p, i) => <option key={i} value={p.name}>{p.name}</option>)}
            </select>
          </div>
        </div>
      ))}
      <div className="d-flex justify-content-between">
        <button type="button" className="btn btn-secondary" onClick={prevStep}>Voltar</button>
        <div>
          <button type="button" className="btn btn-outline-primary me-2" onClick={handleAdd}>Adicionar</button>
          <button type="button" className="btn btn-primary" onClick={nextStep}>Próximo</button>
        </div>
      </div>
    </div>
  );
}

export default Step3Servicos;
