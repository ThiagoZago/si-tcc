import styles from "./Help.module.css"

function Help() {
  return (
    <div className={`container-fluid d-flex flex-column align-items-center justify-content-center py-5 ${styles.section}`}>
      <div className="text-center mb-4">
        <h2 className={`fw-bold ${styles.title}`}>Central de Ajuda</h2>
        <p className={`text-muted ${styles.subtitle}`}>
          Encontre respostas rápidas e tire suas dúvidas.
        </p>
      </div>

      <div className={`accordion w-100 shadow-sm ${styles.accordion}`} id="accordionExample" style={{ maxWidth: "720px" }}>
        <div className={`accordion-item border-0 ${styles.item}`}>
          <h2 className="accordion-header">
            <button
              className={`accordion-button collapsed ${styles.button}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="false"
              aria-controls="collapseOne"
            >
              Por onde é melhor agendar, pelo site ou pelo Telegram?
            </button>
          </h2>
          <div
            id="collapseOne"
            className={`accordion-collapse collapse ${styles.collapse}`}
            data-bs-parent="#accordionExample"
          >
            <div className={`accordion-body text-light ${styles.body}`}>
              Os dois funcionam bem. Faça o que acreditar ser mais fácil, mano!
            </div>
          </div>
        </div>

        <div className={`accordion-item border-0 ${styles.item}`}>
          <h2 className="accordion-header">
            <button
              className={`accordion-button collapsed ${styles.button}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              Por que barbeiros adotariam essa ferramenta?
            </button>
          </h2>
          <div
            id="collapseTwo"
            className={`accordion-collapse collapse ${styles.collapse}`}
            data-bs-parent="#accordionExample"
          >
            <div className={`accordion-body text-light ${styles.body}`}>
              Nós desenvolvemos esse site e o Telegram para facilitar a vida do barbeiro e deixar os clientes super à vontade.
            </div>
          </div>
        </div>

        <div className={`accordion-item border-0 ${styles.item}`}>
          <h2 className="accordion-header">
            <button
              className={`accordion-button collapsed ${styles.button}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              Como agendo meu horário pelo site?
            </button>
          </h2>
          <div
            id="collapseThree"
            className={`accordion-collapse collapse ${styles.collapse}`}
            data-bs-parent="#accordionExample"
          >
            <div className={`accordion-body text-light ${styles.body}`}>
              Acesse a aba "agendar", preencha seus dados, busque pela barbearia, profissional, serviço e horário ideal pra você.
            </div>
          </div>
        </div>

        <div className={`accordion-item border-0 ${styles.item}`}>
          <h2 className="accordion-header">
            <button
              className={`accordion-button collapsed ${styles.button}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFour"
              aria-expanded="false"
              aria-controls="collapseFour"
            >
              Não tem o horário disponível para o dia que quero. O que faço?
            </button>
          </h2>
          <div
            id="collapseFour"
            className={`accordion-collapse collapse ${styles.collapse}`}
            data-bs-parent="#accordionExample"
          >
            <div className={`accordion-body text-light ${styles.body}`}>
              Irmão, temos um sistema de filas. Basta clicar no botão "Entrar na fila", na aba "Agendar" - preencha todas as informações e só esperar o retorno pelo Telegram, beleza?
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Help