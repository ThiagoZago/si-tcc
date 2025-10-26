import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import Step1DadosBasicos from './Step1';
import Step2Profissionais from './Step2';
import Step3Servicos from './Step3';
import Step4Revisao from './Step4';

function CadastroEstabelecimento() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [business, setBusiness] = useState({
    name: '', type: '', phone: '', email: '', description: '',
    address: { cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' }
  });
  const [professionals, setProfessionals] = useState([]);
  const [services, setServices] = useState([]);
  const [existingBusiness, setExistingBusiness] = useState(false);


  const steps = ['Dados Básicos', 'Profissionais', 'Serviços', 'Revisão'];
  const nextStep = () => step < 4 && setStep(step + 1);
  const prevStep = () => step > 1 && setStep(step - 1);
  const goToStep = (targetStep) => targetStep < step && setStep(targetStep);


  // PRIMEIRA FUNÇÃO CHAMADA, ACONTECE AO MONTAR O COMPONENTE
  // 
  //  Acontece junto com a recuperação dos dados - GET
  const fetchBusiness = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await axios.get(
        'http://127.0.0.1:5000/business',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Ajusta os estados
      setBusiness(response.data.business || {});
      setProfessionals(response.data.professionals || []);
      setServices(response.data.services || []);
      setExistingBusiness(true);
    } catch (error) {
      if (error.response?.status === 404) {
        setExistingBusiness(false);
      }else{
        console.error("Erro ao carregar:", error.response?.data || error.message);
      // Se der 404, significa que não tem cadastro ainda
      }
    }
  };


  const handleAddService = (service, indexToEdit = null) => {
    // normaliza nome para comparação
    const nameNorm = (service.name || "").trim().toLowerCase();

    // procura duplicata (ignora o próprio índice se estamos editando)
    const existingIndex = services.findIndex((s, i) => {
      const sName = (s.name || "").trim().toLowerCase();
      return sName === nameNorm && i !== indexToEdit;
    });

    if (existingIndex !== -1) {
      const confirmar = window.confirm(
        "Esse serviço já existe. Tem certeza que gostaria de criar/editar com este nome?"
      );
      if (!confirmar) {
        // pai cancela -> informa child para não limpar o formulário
        return false;
      }
    }

    if (indexToEdit !== null && indexToEdit >= 0 && indexToEdit < services.length) {
      const updated = [...services];
      updated[indexToEdit] = service;
      setServices(updated);
      return true;
    }

    // adicionar novo
    setServices(prev => [...prev, service]);
    return true;
  };

  const handleDeleteService = (index) => {
    setServices(prev => prev.filter((_, i) => i !== index));
  };

  // FUNÇÃO QUE É DISPARADA A PARTIR DA CONFIRMAÇÃO AO FINAL DO PROCESSO DE PREENCHIMENTO/ATUALIZAÇÃO
  // 
  //  Reconhece se já existe algum business, a partir disso chama a rota PUT ou POST
  // 
  const handleSaveOrUpdate = async () => {
    const config = {
      business,
      professionals: professionals || [],
      services: services || []
    };

    try {
      const token = localStorage.getItem('token');
      const response = existingBusiness
      ? await axios.put('http://127.0.0.1:5000/business', config, { headers: { Authorization: `Bearer ${token}` } })
      : await axios.post('http://127.0.0.1:5000/business', config, { headers: { Authorization: `Bearer ${token}` } });

      console.log("Sucesso:", response.data);
      alert(existingBusiness ? 'Estabelecimento atualizado!' : 'Estabelecimento criado!');
      setExistingBusiness(true); // garante que futuras edições usarão PUT
      navigate("/inicio");
    } catch (error) {
        console.error("Erro ao salvar/atualizar:", error.response?.data || error.message);
        alert(`Erro: ${error.response?.data?.error || error.message}`);
      }
  };

  // FUNÇÃO QUE DISPARA ASSIM QUE O USUÁRIO CLICA NO BOTÃO "DELETAR"
  //
  // Acontece com a confirmação do usuário e parte para o DELETE
  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir seu estabelecimento?")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        'http://127.0.0.1:5000/business',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Excluído:", response.data);
      alert("Estabelecimento removido com sucesso!");
      navigate("/inicio");
    } catch (error) {
      console.error("Erro ao excluir:", error.response?.data || error.message);
      alert(`Erro ao excluir: ${error.response?.data?.error || error.message}`);
    }
  };


  // Função ativa toda vez que entramos na página
  useEffect(() => {
    fetchBusiness();
  }, []); // [] garante que roda apenas uma vez, ao montar o componente.



  return (
    <div className="container py-5">
      <header className="mb-5 text-center">
        <h1 className="h3 fw-bold text-dark mb-2">Configuração do Estabelecimento</h1>
        <p className="text-muted">Complete as informações abaixo para configurar seu estabelecimento</p>
      </header>

      <div className="d-flex justify-content-between mb-4 position-relative">
        <div className="position-absolute top-50 start-0 end-0 translate-middle-y bg-light" style={{ height: '4px', zIndex: 0 }}></div>
        <div className="position-absolute top-50 start-0 translate-middle-y bg-primary" style={{ height: '4px', zIndex: 1, width: `${(step - 1) * 33.3}%` }}></div>

        {steps.map((label, index) => {
          const stepIndex = index + 1;
          const isActive = stepIndex === step;
          const isCompleted = stepIndex < step;
          return (
            <button
              key={label}
              onClick={() => goToStep(stepIndex)}
              className="btn btn-link text-decoration-none d-flex flex-column align-items-center z-2"
            >
              <div className="rounded-circle d-flex align-items-center justify-content-center mb-1"
                   style={{ width: '30px', height: '30px',
                            backgroundColor: isCompleted || isActive ? '#0d6efd' : '#e9ecef',
                            color: isCompleted || isActive ? 'white' : '#6c757d' }}>
                {stepIndex}
              </div>
              <small className={isCompleted || isActive ? 'text-primary fw-semibold' : 'text-muted'}>{label}</small>
            </button>
          );
        })}
      </div>

      {step === 1 && <Step1DadosBasicos business={business} setBusiness={setBusiness} nextStep={nextStep} deleteBusiness={handleDelete} />}
      {step === 2 && <Step2Profissionais professionals={professionals} setProfessionals={setProfessionals} prevStep={prevStep} nextStep={nextStep} />}
      {step === 3 && <Step3Servicos professionals={professionals} services={services} prevStep={prevStep} nextStep={nextStep} onAddService={handleAddService} onDeleteService={handleDeleteService} />}
      {step === 4 && <Step4Revisao business={business} professionals={professionals} services={services} prevStep={prevStep} onSave={handleSaveOrUpdate} />}
    </div>
  );
  
}

export default CadastroEstabelecimento;
