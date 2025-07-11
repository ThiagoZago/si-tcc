import Container from "../layout/Container";
import Section from "../layout/Section";

const faqItems = [
  {
    id: "collapseOne",
    question: "Como funciona o agendamento online?",
    answer: "Nosso sistema permite que seus clientes agendem horários 24/7 através do site ou WhatsApp. Você recebe notificações em tempo real e pode gerenciar todos os agendamentos em um painel único."
  },
  {
    id: "collapseTwo",
    question: "Posso personalizar meus serviços e preços?",
    answer: "Sim! Você pode cadastrar todos os seus serviços, definir preços, duração e até mesmo criar pacotes promocionais. Tudo é totalmente personalizável."
  },
  {
    id: "collapseThree",
    question: "Como funciona o sistema de lembretes?",
    answer: "Enviamos lembretes automáticos por WhatsApp e email para seus clientes, reduzindo significativamente o número de faltas e melhorando a experiência do cliente."
  },
  {
    id: "collapseFour",
    question: "Posso acessar relatórios do meu negócio?",
    answer: "Sim! Oferecemos relatórios detalhados sobre faturamento, clientes mais frequentes, serviços mais procurados e muito mais para ajudar você a tomar decisões estratégicas."
  }
];

function Help() {
  return (
    <Section padding="py-5">
      <Container>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <h2 className="text-center mb-5">Perguntas Frequentes</h2>
            
            <div className="accordion accordion-flush" id="faqAccordion">
              {faqItems.map((item) => (
                <div key={item.id} className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#${item.id}`}
                      aria-expanded="false"
                      aria-controls={item.id}
                    >
                      {item.question}
                    </button>
                  </h2>
                  <div
                    id={item.id}
                    className="accordion-collapse collapse"
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default Help;