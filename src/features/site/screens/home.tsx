import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  Scissors,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Wallet,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: CalendarDays,
    title: "Uma agenda que trabalha com você",
    text: "Veja os horários disponíveis, acompanhe os atendimentos e organize seu dia sem complicação.",
    number: "01",
  },
  {
    icon: Users,
    title: "Seu time, no mesmo ritmo",
    text: "Cada profissional com seus serviços, expediente e pausas. Tudo em um só lugar.",
    number: "02",
  },
  {
    icon: Wallet,
    title: "Clareza para o seu negócio",
    text: "Clientes, histórico e faturamento dos serviços concluídos. Conheça melhor sua barbearia.",
    number: "03",
  },
];
export function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-line" /> SEU ESTILO. SEU TEMPO.
            </div>
            <h1>
              Seu próximo corte.
              <br />
              Sem desencontros.
              <br />
              <em>Sem complicação.</em>
            </h1>
            <p>
              O cuidado de sempre, com a praticidade que faltava.
              <br className="desktop-only" /> Encontre sua barbearia e reserve seu horário em poucos
              cliques.
            </p>
            <div className="hero-actions">
              <Link href="/agendar" className="btn btn-primary btn-lg">
                Quero agendar <ArrowUpRight size={20} />
              </Link>
              <Link href="/registro" className="text-link">
                Sou dono de barbearia <ArrowRight size={17} />
              </Link>
            </div>
            <div className="hero-points">
              <span>
                <Check size={15} /> Sem precisar ligar
              </span>
              <span>
                <Check size={15} /> No seu tempo
              </span>
              <span>
                <Check size={15} /> Do seu jeito
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="image-tag">
              <span className="live-dot" /> Seu momento começa aqui
            </div>
            <Image
              src="/images/barbeiro.jpg"
              alt="Barbeiro cuidando do corte de um cliente em uma barbearia"
              fill
              priority
              sizes="(max-width: 800px) 100vw, 50vw"
              className="hero-image"
            />
            <span className="hero-image-number">EST. 2026</span>
            <div className="floating-booking">
              <span className="floating-icon">
                <CalendarDays size={22} />
              </span>
              <div>
                <strong>Seu horário, reservado.</strong>
                <span>Você cuida do estilo. A gente, da agenda.</span>
              </div>
              <span className="success-check">
                <Check size={17} />
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="benefit-strip">
        <div className="container">
          <span>
            <Clock3 size={18} /> Agendamento a qualquer hora
          </span>
          <span>
            <ShieldCheck size={18} /> Seus dados protegidos
          </span>
          <span>
            <Scissors size={18} /> Escolha seu profissional
          </span>
          <span>
            <SlidersHorizontal size={18} /> Gestão descomplicada
          </span>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">DO PRIMEIRO CLIQUE AO ÚLTIMO RETOQUE</div>
              <h2>
                Bom para o cliente.
                <br />
                <em>Melhor para a barbearia.</em>
              </h2>
            </div>
            <p>
              Menos mensagens para organizar.
              <br />
              Mais tempo para fazer acontecer.
            </p>
          </div>
          <div className="feature-grid">
            {features.map((f) => (
              <article className="feature-card" key={f.number}>
                <div className="feature-top">
                  <span className="feature-icon">
                    <f.icon size={24} strokeWidth={1.5} />
                  </span>
                  <span>{f.number}</span>
                </div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section-tinted">
        <div className="container how-grid">
          <div className="how-image">
            <Image
              src="/images/interior.jpg"
              alt="Interior acolhedor de uma barbearia"
              fill
              sizes="(max-width: 800px) 100vw, 45vw"
            />
            <span className="image-caption">
              <Sparkles size={17} /> A experiência começa antes da cadeira.
            </span>
          </div>
          <div className="how-content">
            <div className="eyebrow">SIMPLES COMO DEVE SER</div>
            <h2>
              Um bom corte começa
              <br />
              <em>com um bom horário.</em>
            </h2>
            <p>Seu próximo atendimento está a três passos de distância.</p>
            <ol className="how-steps">
              {[
                {
                  title: "Encontre seu lugar",
                  text: "Escolha a barbearia e o serviço que combinam com você.",
                },
                {
                  title: "Escolha quem e quando",
                  text: "Veja a disponibilidade real do profissional e reserve seu horário.",
                },
                {
                  title: "Pronto. É só chegar.",
                  text: "Guarde seu link para consultar, remarcar ou cancelar quando precisar.",
                },
              ].map((s, i) => (
                <li key={s.title}>
                  <span>0{i + 1}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link href="/agendar" className="text-link">
              Encontrar minha barbearia <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="business-cta">
            <div className="cta-copy">
              <div className="eyebrow">PARA QUEM FAZ ACONTECER</div>
              <h2>
                Sua habilidade na cadeira.
                <br />
                <em>Sua gestão no BarbApp.</em>
              </h2>
              <p>
                Dê à sua barbearia uma agenda organizada, uma equipe conectada e uma experiência
                melhor para cada cliente.
              </p>
              <Link href="/registro" className="btn btn-light">
                Cadastrar minha barbearia <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="cta-details">
              <Scissors size={52} strokeWidth={1} />
              <span>Feito para o seu dia a dia.</span>
              <ul>
                <li>
                  <Check size={16} /> Serviços e preços personalizados
                </li>
                <li>
                  <Check size={16} /> Disponibilidade por profissional
                </li>
                <li>
                  <Check size={16} /> Histórico e visão do faturamento
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
