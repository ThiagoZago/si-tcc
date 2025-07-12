function Step1DadosBasicos({ business, setBusiness, nextStep }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusiness({ ...business, [name]: value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setBusiness({ ...business, address: { ...business.address, [name]: value } });
  };

  return (
    <div>
      <h2 className="h5 mb-4">Informações Básicas</h2>
      <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input type="text" name="name" value={business.name} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Tipo</label>
          <input type="text" name="type" value={business.type} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Telefone</label>
          <input type="text" name="phone" value={business.phone} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">E-mail</label>
          <input type="email" name="email" value={business.email} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Descrição</label>
          <textarea name="description" value={business.description} onChange={handleChange} className="form-control" />
        </div>

        <h5 className="mt-4">Endereço</h5>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">CEP</label>
            <input type="text" name="cep" value={business.address.cep} onChange={handleAddressChange} className="form-control" />
          </div>
          <div className="col-md-8 mb-3">
            <label className="form-label">Rua</label>
            <input type="text" name="street" value={business.address.street} onChange={handleAddressChange} className="form-control" />
          </div>
          <div className="col-md-2 mb-3">
            <label className="form-label">Número</label>
            <input type="text" name="number" value={business.address.number} onChange={handleAddressChange} className="form-control" />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Complemento</label>
            <input type="text" name="complement" value={business.address.complement} onChange={handleAddressChange} className="form-control" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Bairro</label>
            <input type="text" name="neighborhood" value={business.address.neighborhood} onChange={handleAddressChange} className="form-control" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Cidade</label>
            <input type="text" name="city" value={business.address.city} onChange={handleAddressChange} className="form-control" />
          </div>
          <div className="col-md-6 mb-4">
            <label className="form-label">Estado</label>
            <input type="text" name="state" value={business.address.state} onChange={handleAddressChange} className="form-control" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Próximo</button>
      </form>
    </div>
  );
}

export default Step1DadosBasicos;

