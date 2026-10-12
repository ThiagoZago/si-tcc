import { useState } from "react"
import { Plus } from "lucide-react"
import styles from "./Help.module.css"

const faqs = [
  {
    question: "Por onde é melhor agendar, pelo site ou pelo Telegram?",
    answer: "Os dois funcionam bem. Faça o que acreditar ser mais fácil, mano!",
  },
  {
    question: "Por que barbeiros adotariam essa ferramenta?",
    answer: "Nós desenvolvemos esse site e o Telegram para facilitar a vida do barbeiro e deixar os clientes super à vontade.",
  },
  {
    question: "Como agendo meu horário pelo site?",
    answer: 'Acesse a aba "agendar", preencha seus dados, busque pela barbearia, profissional, serviço e horário ideal pra você.',
  },
  {
    question: "Não tem o horário disponível para o dia que quero. O que faço?",
    answer: 'Irmão, temos um sistema de filas. Basta clicar no botão "Entrar na fila", na aba "Agendar" - preencha todas as informações e só esperar o retorno pelo Telegram, beleza?',
  },
]

function Help() {

  const [openFaq, setOpenFaq] = useState(null)
  
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.layout}>
          <header className={styles.header}>
            <span className={styles.eyebrow}>
              <span className={styles.dash}></span>
              SUPORTE
            </span>
            <h2 className={styles.title}>
              Central de
              <br />
              <span className={styles.titleAccent}>Ajuda</span>
            </h2>
            <p className={styles.subtitle}>
              Encontre respostas rápidas e tire suas dúvidas.
            </p>
          </header>

          <div className={styles.accordion} id="helpAccordion">
            {faqs.map((faq, index) => {
              const id = `help-collapse-${index}`
              const isOpen = openFaq === index
              return (
                <div className={styles.item} key={id}>
                  <h3 className={styles.itemHeader}>
                    <button
                      className={`${styles.button} ${isOpen ? "" : "collapsed"}`}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={id}
                      onClick={() =>
                        setOpenFaq(isOpen ? null : index)
                      }
                    >
                      <span className={styles.number}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.question}>{faq.question}</span>
                      <Plus className={styles.icon} size={20} strokeWidth={2.5} />
                    </button>
                  </h3>
                  <div id={id} className={`collapse ${isOpen ? "show" : ""}`}>
                    <div className={styles.body}>{faq.answer}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Help