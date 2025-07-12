import { useState } from 'react';
import Step1DadosBasicos from './Step1';
import Step2Profissionais from './Step2';
import Step3Servicos from './Step3';
import Step4Revisao from './Step4';

function CadastroEstabelecimento() {
  const [step, setStep] = useState(1);
  const [business, setBusiness] = useState({
    name: '', type: '', phone: '', email: '', description: '',
    address: { cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' }
  });
  const [professionals, setProfessionals] = useState([]);
  const [services, setServices] = useState([]);

  const steps = ['Dados Básicos', 'Profissionais', 'Serviços', 'Revisão'];
  const nextStep = () => step < 4 && setStep(step + 1);
  const prevStep = () => step > 1 && setStep(step - 1);
  const goToStep = (targetStep) => targetStep < step && setStep(targetStep);
  const handleSave = () => {
    const config = { business, professionals, services };
    console.log('Salvar configuração:', config);
    alert('Configuração salva com sucesso!');
  };

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

      {step === 1 && <Step1DadosBasicos business={business} setBusiness={setBusiness} nextStep={nextStep} />}
      {step === 2 && <Step2Profissionais professionals={professionals} setProfessionals={setProfessionals} prevStep={prevStep} nextStep={nextStep} />}
      {step === 3 && <Step3Servicos professionals={professionals} services={services} setServices={setServices} prevStep={prevStep} nextStep={nextStep} />}
      {step === 4 && <Step4Revisao business={business} professionals={professionals} services={services} prevStep={prevStep} onSave={handleSave} />}
    </div>
  );
}

export default CadastroEstabelecimento;
