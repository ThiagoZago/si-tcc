import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axiosInstance from '../../../utils/axiosInterceptor';

import Modal from "bootstrap/js/dist/modal";

function BasicSettings(){

  const navigate = useNavigate();
  const [business, setBusiness] = useState({
    name: '', type: '', phone: '', email: '', description: '',
    address: { cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' }
  });
  const [existingBusiness, setExistingBusiness] = useState(false);
  const modalRef = useRef(null);
  const modalInstanceRef  = useRef(null);

  const fetchBusiness = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await axiosInstance.get(
          '/business',
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        // Ajusta os estados
        setBusiness(response.data.business || {});
        setExistingBusiness(true);
        toast.info(response.data?.msg || "Dados carregados!")
      } catch (error) {
        if (error.response.status === 404) {
          setExistingBusiness(false);
          toast.warn("Não consegui encontrar nenhum dado. Faça seu primeiro cadastro!")
        }else{
          toast.error(error.response?.data?.msg || "Ocorreu um erro. Tente novamente!")
        // Se der 404, significa que não tem cadastro ainda
        }
      }
  };

  const handleSaveOrUpdate = async () => {
      const config = {
        business
      };
  
      try {
        const token = localStorage.getItem('token');
        const response = existingBusiness
        ? await axiosInstance.put('/business', config, { headers: { Authorization: `Bearer ${token}` } })
        : await axiosInstance.post('/business', config, { headers: { Authorization: `Bearer ${token}` } });
  
        toast.success(existingBusiness ? response.data.message || 'Estabelecimento atualizado!' :  response.data.message || 'Estabelecimento criado!');
        setExistingBusiness(true); // garante que futuras edições usarão PUT
        setTimeout(() => {
          navigate("/inicio")
        }, 2500)
      } catch (error) {
          toast.error(`Erro: ${error.response?.data?.error || error.message}`);
        }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusiness({ ...business, [name]: value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setBusiness({ ...business, address: { ...business.address, [name]: value } });
  };

  const goBack = async () => {
    navigate("/inicio");
  }

  useEffect(() => {
    fetchBusiness();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (modalRef.current) {
      modalInstanceRef.current = new Modal(modalRef.current, {
        backdrop: "static",
      });
    }
  }, []); // [] garante que roda apenas uma vez, ao montar o componente.

  const openModal = () => {
    modalInstanceRef.current?.show();
  };

  const closeModal = () => {
    modalInstanceRef.current?.hide();
  };

  const handleDelete = async () => {

    closeModal();

    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.delete(
        '/business',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.info(response.data.msg || "Estabelecimento removido com sucesso!");
      setTimeout(() => {
        navigate("/inicio")
      }, 2500)
    } catch (error) {
      toast.error(`Erro ao excluir: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className='container py-5'>
      <header className="mb-5 text-center">
        <h1 className="h3 fw-bold text-dark mb-2">Configuração do Estabelecimento</h1>
        <p className="text-muted">Complete e/ou altere as informações sobre o seu estabelecimento.</p>
      </header>
      <form>
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
        <div className="d-flex justify-content-between mt-4">
          <div>
            <button type="button" className="btn btn-secondary" onClick={goBack}>Voltar</button>
          </div>
          <div>
            <button type="button" className="btn btn-danger mx-2" onClick={openModal}>Deletar</button>
            <button type="button" className="btn btn-success" onClick={handleSaveOrUpdate}>Salvar</button>
          </div>
        </div>
      </form>
      {/* Modal Bootstrap */}
      <div
        ref={modalRef}
        className="modal fade"
        id="confirmDeleteModal"
        tabIndex="-1"
        aria-labelledby="confirmDeleteLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="confirmDeleteLabel">
                Atenção!
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
                aria-label="Fechar"
              ></button>
            </div>
            <div className="modal-body">
              Tem certeza que deseja excluir seu estabelecimento? Esta ação não poderá ser desfeita!
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" onClick={handleDelete}>
                Quero excluir!
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
}

export default BasicSettings