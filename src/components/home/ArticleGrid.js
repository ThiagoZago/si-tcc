import { Link } from 'react-router-dom';
import Container from '../layout/Container';
import Section from '../layout/Section';
import Card from '../ui/Card';
import Button from '../ui/Button';
import styles from './ArticleGrid.module.css';

const articles = [
  {
    title: 'Gestão Simplificada',
    subtitle: 'Controle total do seu negócio',
    description: 'Gerencie agendamentos, clientes e serviços em um só lugar.',
    features: ['Agenda integrada', 'Controle de clientes', 'Relatórios automáticos', 'Notificações em tempo real']
  },
  {
    title: 'Experiência do Cliente',
    subtitle: 'Satisfação garantida',
    description: 'Proporcione a melhor experiência para seus clientes.',
    features: ['Agendamento online', 'Lembretes automáticos', 'Avaliações e feedback', 'Histórico de serviços']
  },
  {
    title: 'Crescimento do Negócio',
    subtitle: 'Expanda suas oportunidades',
    description: 'Ferramentas para fazer seu negócio crescer.',
    features: ['Análise de performance', 'Marketing integrado', 'Programa de fidelidade', 'Múltiplas unidades']
  }
];

function ArticleGrid() {
  return (
    <Section padding="py-5" background="#f8f9fa">
      <Container>
        <div className="row">
          {articles.map((article, index) => (
            <div key={index} className="col-md-4 mb-4">
              <Card animated className={styles.article}>
                <h4 className={styles.title}>{article.title}</h4>
                <p className={styles.subtitle}>{article.subtitle}</p>
                <hr />
                <p className={styles.description}>{article.description}</p>
                <ul className={styles.featureList}>
                  {article.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>{feature}</li>
                  ))}
                </ul>
                <div className="text-center mt-4">
                  <Button to="/acesso" variant="outline" size="sm">
                    SAIBA MAIS
                  </Button>
                </div>
                <small className={styles.helpText}>
                  Em caso de dúvidas,{' '}
                  <Link to="/ajuda" className={styles.helpLink}>
                    clique aqui
                  </Link>
                </small>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default ArticleGrid;