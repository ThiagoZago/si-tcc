import Container from "../layout/Container";
import Section from "../layout/Section";
import Card from "../ui/Card";

const developers = [
  {
    name: "João Silva",
    role: "Full Stack Developer",
    description: "Especialista em React e Node.js, responsável pela arquitetura da aplicação.",
    github: "https://github.com/joaosilva",
    linkedin: "https://linkedin.com/in/joaosilva"
  },
  {
    name: "Maria Santos",
    role: "UI/UX Designer",
    description: "Designer focada em experiência do usuário e interfaces intuitivas.",
    github: "https://github.com/mariasantos",
    linkedin: "https://linkedin.com/in/mariasantos"
  },
  {
    name: "Pedro Costa",
    role: "Backend Developer",
    description: "Especialista em APIs e banco de dados, garantindo performance e segurança.",
    github: "https://github.com/pedrocosta",
    linkedin: "https://linkedin.com/in/pedrocosta"
  }
];

function Developers() {
  return (
    <Section padding="py-5">
      <Container>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="text-center mb-5">
              <h1 className="display-4 text-primary mb-3">Nossa Equipe</h1>
              <p className="lead">
                Conheça os profissionais que tornaram este projeto realidade
              </p>
            </div>

            <div className="row">
              {developers.map((dev, index) => (
                <div key={index} className="col-md-4 mb-4">
                  <Card className="text-center h-100">
                    <div className="mb-3">
                      <div 
                        className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center"
                        style={{ width: '80px', height: '80px' }}
                      >
                        <i className="fas fa-user fa-2x text-white"></i>
                      </div>
                    </div>
                    <h4 className="text-primary">{dev.name}</h4>
                    <h6 className="text-muted mb-3">{dev.role}</h6>
                    <p className="mb-4">{dev.description}</p>
                    <div className="mt-auto">
                      <a 
                        href={dev.github} 
                        className="btn btn-outline-dark btn-sm me-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-github me-1"></i>
                        GitHub
                      </a>
                      <a 
                        href={dev.linkedin} 
                        className="btn btn-outline-primary btn-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-linkedin me-1"></i>
                        LinkedIn
                      </a>
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            <div className="text-center mt-5">
              <Card>
                <h4 className="text-primary mb-3">Tecnologias Utilizadas</h4>
                <div className="row">
                  <div className="col-md-3 col-6 mb-3">
                    <i className="fab fa-react fa-3x text-info mb-2"></i>
                    <p className="mb-0">React</p>
                  </div>
                  <div className="col-md-3 col-6 mb-3">
                    <i className="fab fa-node-js fa-3x text-success mb-2"></i>
                    <p className="mb-0">Node.js</p>
                  </div>
                  <div className="col-md-3 col-6 mb-3">
                    <i className="fas fa-database fa-3x text-warning mb-2"></i>
                    <p className="mb-0">MongoDB</p>
                  </div>
                  <div className="col-md-3 col-6 mb-3">
                    <i className="fab fa-bootstrap fa-3x text-primary mb-2"></i>
                    <p className="mb-0">Bootstrap</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default Developers;