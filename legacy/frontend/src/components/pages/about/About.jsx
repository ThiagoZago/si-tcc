import { Link } from "react-router-dom"
import {
  ArrowRight,
  ExternalLink,
  Check,
  Eye,
  Award,
  ShieldCheck,
  Target,
} from "lucide-react"
import Reveal from "../../layout/Reveal/Reveal"
import styles from "./About.module.css"

const ARCAN_URL = "https://arcan-labs.vercel.app/"
const ARCAN_EMAIL = "yzy@arcan.com.br"

const features = [
  "Agendamento pelo site ou pelo Telegram",
  "Fila de espera quando o horário desejado acaba",
  "Serviços, profissionais e disponibilidade configuráveis",
  "Histórico de atendimentos em um só lugar",
]

const values = [
  { icon: Eye, title: "Transparência", text: "Escopo claro, custos e prazos combinados antes de começar." },
  { icon: Award, title: "Senioridade", text: "Time sênior dentro do projeto desde o primeiro dia." },
  { icon: ShieldCheck, title: "Segurança", text: "Boas práticas de segurança e LGPD em todo o ciclo." },
  { icon: Target, title: "Resultado", text: "Entregas curtas que podem ser medidas a cada sprint." },
]

const steps = [
  { title: "Diagnóstico", text: "Entendemos o negócio antes da tecnologia." },
  { title: "Desenho", text: "Arquitetura e plano com custos e prazos claros." },
  { title: "Execução", text: "Entregas curtas, demonstráveis e medidas." },
  { title: "Evolução", text: "Operação, suporte e melhoria contínua." },
]

function About() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className={styles.hero}>
        <div className="container">
          <Reveal className={styles.heroInner}>
            <span className={styles.eyebrow}>
              <span className={styles.dash}></span>
              SOBRE NÓS
            </span>
            <h1 className={styles.heroTitle}>
              Software feito por quem
              <br />
              <span className={styles.accent}>assume o problema.</span>
            </h1>
            <p className={styles.heroText}>
              O BarbApp é um produto da Arcan, consultoria de tecnologia que reúne
              arquitetura, software e inovação. Foi criado para facilitar a vida do
              barbeiro e deixar o cliente à vontade na hora de agendar.
            </p>
            <div className={styles.actions}>
              <Link to="/acesso" className={styles.btnPrimary}>
                Criar conta <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
              <a
                href={ARCAN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnGhost}
              >
                Conhecer a Arcan <ExternalLink size={16} strokeWidth={2.2} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- O BARBAPP ---------- */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.split}>
            <Reveal>
              <span className={styles.eyebrowDark}>
                <span className={styles.dashDark}></span>
                O PRODUTO
              </span>
              <h2 className={styles.title}>
                Menos tempo na agenda,
                <br />
                <span className={styles.titleAccent}>mais tempo na cadeira.</span>
              </h2>
            </Reveal>

            <Reveal delay={150}>
              <p className={styles.text}>
                O cliente escolhe a barbearia, o profissional, o serviço e o horário.
                O barbeiro configura serviços, preços e disponibilidade uma vez, e o
                sistema cuida do resto, inclusive da fila quando o dia está cheio.
              </p>
              <ul className={styles.featureList}>
                {features.map((item) => (
                  <li key={item}>
                    <Check size={18} strokeWidth={3} className={styles.check} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- ARCAN ---------- */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <div className={styles.split}>
            <Reveal>
              <span className={styles.eyebrowDark}>
                <span className={styles.dashDark}></span>
                QUEM ESTÁ POR TRÁS
              </span>
              <h2 className={styles.title}>
                Arcan:
                <br />
                <span className={styles.titleAccent}>arquitetura, software e inovação.</span>
              </h2>
            </Reveal>

            <Reveal delay={150}>
              <p className={styles.text}>
                Em vez de cobrar por hora, a Arcan assume o problema de negócio e
                responde pelo resultado. Trabalhamos lado a lado com o time do cliente,
                com comunicação direta, escopo claro e entregas curtas.
              </p>
              <p className={styles.text}>
                Todo o código, a documentação e as credenciais ficam com quem contrata,
                sem prender ninguém a nós.
              </p>
            </Reveal>
          </div>

          <div className={styles.valuesGrid}>
            {values.map(({ icon: Icon, title, text }, index) => (
              <Reveal key={title} delay={index * 120} fill>
                <div className={styles.valueCard}>
                  <div className={styles.iconWrap}>
                    <Icon size={22} strokeWidth={2} />
                  </div>
                  <h3 className={styles.valueTitle}>{title}</h3>
                  <p className={styles.valueText}>{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- COMO TRABALHAMOS ---------- */}
      <section className={styles.section}>
        <div className="container">
          <Reveal>
            <span className={styles.eyebrowDark}>
              <span className={styles.dashDark}></span>
              COMO TRABALHAMOS
            </span>
            <h2 className={`${styles.title} ${styles.titleSpaced}`}>
              Do plano <span className={styles.titleAccent}>à operação.</span>
            </h2>
          </Reveal>

          <div className={styles.steps}>
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 120} fill>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepText}>{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA FINAL ---------- */}
      <section className={styles.cta}>
        <div className="container">
          <Reveal className={styles.ctaInner}>
            <span className={styles.eyebrow}>
              <span className={styles.dash}></span>
              VAMOS CONVERSAR
            </span>
            <h2 className={styles.ctaTitle}>
              Quer um sistema assim
              <br />
              <span className={styles.accent}>para o seu negócio?</span>
            </h2>
            <p className={styles.heroText}>
              A Arcan desenvolve software sob medida. Conte o seu desafio em uma
              conversa de 30 minutos, sem custo.
            </p>
            <div className={styles.actions}>
              <a
                href={`mailto:${ARCAN_EMAIL}?subject=Agendar%20conversa%20%E2%80%94%20Arcan`}
                className={styles.btnPrimary}
              >
                Agendar conversa <ArrowRight size={18} strokeWidth={2.5} />
              </a>
              <a
                href={ARCAN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnGhost}
              >
                Visitar o site <ExternalLink size={16} strokeWidth={2.2} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

export default About