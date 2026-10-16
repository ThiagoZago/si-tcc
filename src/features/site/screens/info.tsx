import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  Code2,
  ShieldCheck,
  Users,
  Scissors,
  Check,
  Clock3,
} from "lucide-react";

export const infoTitles: Record<string, string> = {
  "sobre-nos": "Sobre o BarbApp",
  ajuda: "Central de ajuda",
  novidades: "O que há de novo",
  desenvolvedores: "Por trás do projeto",
  privacidade: "Política de privacidade",
  termos: "Termos de uso",
};
const faqs = [
  [
    "Como faço para agendar um horário?",
    "Acesse Agendar, escolha a barbearia, o serviço e o profissional. Selecione uma data e um horário disponível e preencha seu nome e telefone. Ao confirmar, você recebe um link exclusivo para acompanhar a reserva.",
  ],
  [
    "Preciso criar uma conta para agendar?",
    "Não. Clientes podem reservar diretamente, informando apenas os dados necessários ao atendimento. A conta é destinada ao responsável pela barbearia.",
  ],
  [
    "Como cancelo ou remarco meu atendimento?",
    "Abra o link recebido na confirmação. Antes do horário do atendimento, você pode cancelar ou escolher outro horário disponível. Se perder o link, entre em contato diretamente com a barbearia.",
  ],
  [
    "O horário que eu quero está ocupado. E agora?",
    "Você pode escolher outra data ou entrar na lista de espera do dia desejado. O responsável pela barbearia visualiza a lista e pode entrar em contato pelo telefone informado. O contato não é automático.",
  ],
  [
    "Como cadastro minha barbearia?",
    "Crie uma conta, complete as informações do estabelecimento e configure o expediente. Depois adicione os profissionais, a disponibilidade de cada um e os serviços com preços e duração. Seu link de agendamento estará no painel.",
  ],
  [
    "Como funcionam pausas e dias de folga?",
    "Cada profissional pode ter um expediente e uma pausa por dia da semana. Você também pode bloquear datas específicas, como feriados e férias. Esses bloqueios são considerados ao calcular os horários livres.",
  ],
  [
    "Como o faturamento é calculado?",
    "O painel soma o valor dos atendimentos marcados como concluídos. Agendamentos pendentes, cancelados ou com ausência não entram no faturamento realizado. O BarbApp não processa pagamentos.",
  ],
  [
    "O BarbApp envia mensagens automaticamente?",
    "Esta versão confirma o atendimento na tela e disponibiliza um link de consulta e remarcação. Os links de WhatsApp abrem uma conversa para contato manual. E-mail, SMS e Telegram automáticos ainda não estão integrados.",
  ],
];
export function Info({ info }: { info: string }) {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">
            {info === "ajuda" ? "RESPOSTAS PARA O SEU DIA A DIA" : "O SEU TEMPO IMPORTA"}
          </div>
          <h1>
            {infoTitles[info]}
            <span className="text-red">.</span>
          </h1>
          <p>
            {info === "sobre-nos"
              ? "Menos tempo organizando. Mais tempo cuidando."
              : info === "ajuda"
                ? "Tudo o que você precisa para começar com tranquilidade."
                : info === "novidades"
                  ? "Uma nova experiência, do agendamento à gestão."
                  : info === "desenvolvedores"
                    ? "Tecnologia com propósito: simplificar a rotina de quem atende."
                    : "Transparência sobre como o serviço funciona e trata seus dados."}
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container info-content">
          {info === "ajuda" ? (
            <div className="faq-layout">
              <aside>
                <h2>
                  Como podemos
                  <br />
                  <em>ajudar você?</em>
                </h2>
                <p>Encontre respostas para as dúvidas mais comuns.</p>
                <Link href="/agendar" className="text-link">
                  Ir para o agendamento <ArrowRight size={17} />
                </Link>
              </aside>
              <div className="faq-list">
                {faqs.map(([q, a], i) => (
                  <details key={q}>
                    <summary>
                      <span className="faq-number">0{i + 1}</span>
                      {q}
                      <span className="faq-plus">+</span>
                    </summary>
                    <p>{a}</p>
                  </details>
                ))}
              </div>
            </div>
          ) : null}
          {info === "sobre-nos" ? (
            <>
              <div className="about-grid">
                <div>
                  <div className="eyebrow">FEITO PARA QUEM CUIDA</div>
                  <h2>
                    Um bom serviço merece
                    <br />
                    <em>uma boa experiência.</em>
                  </h2>
                  <p>
                    O BarbApp nasceu como um projeto de graduação para resolver um problema bem
                    real: organizar os agendamentos de barbearias sem perder tempo em conversas,
                    anotações e desencontros.
                  </p>
                  <p>
                    Para o cliente, a liberdade de escolher o profissional e o horário. Para a
                    barbearia, uma visão clara da agenda, da equipe e dos resultados.
                  </p>
                  <Link href="/registro" className="btn btn-primary">
                    Faça parte <ArrowRight size={17} />
                  </Link>
                </div>
                <div className="about-image">
                  <Image
                    src="/images/ferramentas.jpg"
                    fill
                    sizes="(max-width: 800px) 100vw, 45vw"
                    alt="Ferramentas de trabalho de uma barbearia"
                  />
                </div>
              </div>
              <div className="value-grid">
                {[
                  {
                    icon: Clock3,
                    title: "Respeito ao tempo",
                    text: "Uma rotina organizada para quem atende e para quem é atendido.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Cuidado com os dados",
                    text: "Acesso individual e informações usadas para organizar o atendimento.",
                  },
                  {
                    icon: Users,
                    title: "Pessoas no centro",
                    text: "Tecnologia simples, pensada para a rotina de uma barbearia.",
                  },
                ].map((v) => (
                  <article key={v.title}>
                    <v.icon size={25} />
                    <h3>{v.title}</h3>
                    <p>{v.text}</p>
                  </article>
                ))}
              </div>
            </>
          ) : null}
          {info === "novidades" ? (
            <div className="release-list">
              <article>
                <span className="badge badge-red">VERSÃO 2.0</span>
                <h2>Uma nova rotina para sua barbearia.</h2>
                <p>
                  A aplicação foi reconstruída com uma experiência integrada de agendamento e
                  gestão.
                </p>
                <ul className="check-list">
                  {[
                    "Agendamento com disponibilidade real e proteção contra sobreposição",
                    "Link exclusivo para consulta, cancelamento e remarcação",
                    "Painel com agenda, clientes e faturamento de atendimentos concluídos",
                    "Cadastro de serviços com preços, duração e profissionais",
                    "Expediente semanal, pausas e datas bloqueadas",
                    "Lista de espera e exportação do histórico",
                    "Interface responsiva para computador e celular",
                  ].map((s) => (
                    <li key={s}>
                      <Check size={17} />
                      {s}
                    </li>
                  ))}
                </ul>
                <Link href="/acesso" className="btn btn-primary">
                  Conheça o painel <ArrowRight size={17} />
                </Link>
              </article>
            </div>
          ) : null}
          {info === "desenvolvedores" ? (
            <>
              <div className="eyebrow">PROJETO DE GRADUAÇÃO · SISTEMAS DE INFORMAÇÃO</div>
              <h2>
                Software que resolve
                <br />
                <em>um problema de verdade.</em>
              </h2>
              <p>
                O BarbApp conecta os conceitos de desenvolvimento web, modelagem de dados e
                experiência do usuário em uma aplicação para gestão de barbearias.
              </p>
              <div className="value-grid">
                {[
                  {
                    icon: Code2,
                    title: "Uma base moderna",
                    text: "Next.js App Router, React e TypeScript com validação dos dados no servidor.",
                  },
                  {
                    icon: CalendarDays,
                    title: "Regras de negócio",
                    text: "Intervalos de atendimento, pausas e bloqueios considerados ao reservar horários.",
                  },
                  {
                    icon: Scissors,
                    title: "Produto completo",
                    text: "Jornada pública de agendamento e um painel privado para cada estabelecimento.",
                  },
                ].map((v) => (
                  <article key={v.title}>
                    <v.icon size={25} />
                    <h3>{v.title}</h3>
                    <p>{v.text}</p>
                  </article>
                ))}
              </div>
            </>
          ) : null}
          {info === "privacidade" ? (
            <div className="prose">
              <h2>Dados usados no atendimento</h2>
              <p>
                Para realizar uma reserva, são solicitados nome e telefone. E-mail e observações são
                opcionais. Essas informações ficam disponíveis ao responsável pelo estabelecimento
                escolhido para organizar o atendimento e entrar em contato com você.
              </p>
              <h2>Conta da barbearia</h2>
              <p>
                Para o cadastro do responsável, são armazenados nome, e-mail e uma representação
                protegida da senha. O serviço utiliza um cookie de sessão necessário para manter o
                acesso ao painel. A aplicação não utiliza cookies de publicidade.
              </p>
              <h2>Link do agendamento</h2>
              <p>
                O link de confirmação permite consultar e alterar sua reserva. Guarde-o com cuidado:
                qualquer pessoa que tenha esse link poderá acessar o agendamento associado.
              </p>
              <h2>Correção e exclusão</h2>
              <p>
                Para corrigir informações ou solicitar exclusão de dados de atendimento, entre em
                contato com a barbearia escolhida usando os dados de contato apresentados no
                agendamento. O responsável pelo estabelecimento deve atender solicitações de dados e
                definir os prazos de retenção apropriados à sua operação.
              </p>
              <h2>Armazenamento</h2>
              <p>
                Os dados são armazenados no banco da instalação do BarbApp. O operador da instalação
                é responsável pela hospedagem, cópias de segurança, controle de acesso e atendimento
                das solicitações de privacidade.
              </p>
            </div>
          ) : null}
          {info === "termos" ? (
            <div className="prose">
              <h2>Uso do BarbApp</h2>
              <p>
                O BarbApp permite reservar horários e organizar serviços de barbearias. Informe
                dados corretos e utilize apenas contas e estabelecimentos que você está autorizado a
                administrar.
              </p>
              <h2>Reservas e alterações</h2>
              <p>
                As reservas dependem da disponibilidade do profissional e do serviço. A confirmação
                é exibida na tela. O link de gestão permite cancelar ou remarcar antes do início do
                atendimento. Alterações de última hora e regras específicas devem ser combinadas
                diretamente com a barbearia.
              </p>
              <h2>Preços e pagamentos</h2>
              <p>
                Os preços são definidos pelo estabelecimento. O valor registrado no agendamento
                corresponde ao preço no momento da reserva. A plataforma não processa pagamentos; o
                pagamento deve ser combinado com a barbearia.
              </p>
              <h2>Responsabilidades do estabelecimento</h2>
              <p>
                O responsável deve manter atualizados os serviços, profissionais, horários e
                contatos, proteger o acesso à conta e tratar os dados dos clientes apenas para
                finalidades apropriadas ao atendimento.
              </p>
              <h2>Demonstração</h2>
              <p>
                Quando disponível, o painel de demonstração utiliza dados fictícios e uma conta
                compartilhada. Não insira informações pessoais reais nessa conta.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
