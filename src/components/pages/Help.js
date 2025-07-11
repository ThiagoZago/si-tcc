const faqItems = [
{
  question: "Como faço para me cadastrar?",
  answer: "Para se cadastrar, basta clicar no botão 'Cadastrar' no canto superior direito da página e preencher o formulário com seus dados."
},
{
  question: "Como faço para acessar minha conta?",
  answer: "Para acessar sua conta, clique no botão 'Entrar' no canto superior direito da página e insira seu e-mail e senha."
},
{
  question: "Como faço para alterar minha senha?",
  answer: "Para alterar sua senha, acesse sua conta, vá até o menu 'Configurações' e clique em 'Alterar Senha'."
}
];

function Help() {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <h2 className="text-center mb-5">Perguntas Frequentes</h2>
            <div className="accordion">
              {faqItems.map((item, index) => (
                <div className="accordion-item" key={index}>
                  <h3 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${index}`}
                    >
                      {item.question}
                    </button>
                  </h3>
                  <div
                    id={`collapse${index}`}
                    className="accordion-collapse collapse"
                  >
                    <div className="accordion-body">{item.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Help;