import Container from "../layout/Container";
import Section from "../layout/Section";
import Card from "../ui/Card";

const newsItems = [
  {
    date: "15 Jan 2025",
    title: "Nova funcionalidade: Relatórios avançados",
    description: "Agora você pode acessar relatórios detalhados sobre seu negócio com gráficos interativos e insights valiosos.",
    badge: "Novo"
  },
  {
    date: "10 Jan 2025",
    title: "Integração com WhatsApp Business",
    description: "Conecte sua conta do WhatsApp Business para enviar lembretes automáticos e melhorar a comunicação.",
    badge: "Atualização"
  },
  {
    date: "05 Jan 2025",
    title: "App mobile em desenvolvimento",
    description: "Em breve você poderá gerenciar sua barbearia direto do celular com nosso aplicativo nativo.",
    badge: "Em breve"
  }
];

function News() {
  return (
    <Section padding="py-5">
      <Container>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="text-center mb-5">
              <h1 className="display-4 text-primary mb-3">Novidades</h1>
              <p className="lead">
                Fique por dentro das últimas atualizações e funcionalidades
              </p>
            </div>

            <div className="row">
              {newsItems.map((item, index) => (
                <div key={index} className="col-12 mb-4">
                  <Card>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <small className="text-muted">{item.date}</small>
                      <span className={`badge ${
                        item.badge === 'Novo' ? 'bg-success' :
                        item.badge === 'Atualização' ? 'bg-primary' : 'bg-warning'
                      }`}>
                        {item.badge}
                      </span>
                    </div>
                    <h4 className="text-primary mb-3">{item.title}</h4>
                    <p className="mb-0">{item.description}</p>
                  </Card>
                </div>
              ))}
            </div>

            <div className="text-center mt-5">
              <Card>
                <h4 className="text-primary mb-3">Quer sugerir uma funcionalidade?</h4>
                <p>
                  Sua opinião é muito importante para nós! Entre em contato e 
                  compartilhe suas ideias para melhorarmos ainda mais a plataforma.
                </p>
                <a href="mailto:contato@barbapp.com" className="btn btn-primary">
                  Enviar Sugestão
                </a>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default News;