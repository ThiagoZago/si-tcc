import Container from "../layout/Container";
import Section from "../layout/Section";
import Card from "../ui/Card";

function About() {
  return (
    <Section padding="py-5">
      <Container>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <Card>
              <div className="text-center mb-5">
                <h1 className="display-4 text-primary mb-3">Sobre Nós</h1>
                <p className="lead">
                  Transformando a gestão de barbearias com tecnologia e simplicidade
                </p>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <h3 className="h4 text-primary">Nossa Missão</h3>
                  <p>
                    Simplificar a gestão de barbearias, permitindo que profissionais 
                    foquem no que fazem de melhor: cuidar dos seus clientes.
                  </p>
                </div>
                <div className="col-md-6 mb-4">
                  <h3 className="h4 text-primary">Nossa Visão</h3>
                  <p>
                    Ser a plataforma líder em gestão para barbearias, 
                    conectando profissionais e clientes de forma eficiente.
                  </p>
                </div>
              </div>

              <hr className="my-5" />

              <div className="text-center">
                <h3 className="h4 text-primary mb-4">Por que escolher o BarbApp?</h3>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <i className="fas fa-clock fa-3x text-primary mb-3"></i>
                    <h5>Economia de Tempo</h5>
                    <p>Automatize agendamentos e reduza trabalho manual</p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <i className="fas fa-users fa-3x text-primary mb-3"></i>
                    <h5>Melhor Experiência</h5>
                    <p>Proporcione conveniência aos seus clientes</p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <i className="fas fa-chart-line fa-3x text-primary mb-3"></i>
                    <h5>Crescimento</h5>
                    <p>Insights para fazer seu negócio crescer</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default About;