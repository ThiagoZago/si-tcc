function Step2Profissionais({ professionals, setProfessionals, prevStep, nextStep }) {
  const handleAdd = () => {
    setProfessionals([...professionals, { name: '', role: '' }]);
  };

  const handleChange = (index, e) => {
    const updated = [...professionals];
    updated[index][e.target.name] = e.target.value;
    setProfessionals(updated);
  };

  return (
    <div>
      <h2 className="h5 mb-4">Profissionais</h2>
      {professionals.map((prof, index) => (
        <div className="row mb-3" key={index}>
          <div className="col-md-6">
            <input type="text" name="name" value={prof.name} onChange={(e) => handleChange(index, e)} className="form-control" placeholder="Nome" />
          </div>
          <div className="col-md-6">
            <input type="text" name="role" value={prof.role} onChange={(e) => handleChange(index, e)} className="form-control" placeholder="Função" />
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

export default Step2Profissionais;
