import Hero from '../home/Hero';
import FeatureSection from '../home/FeatureSection';
import ArticleGrid from '../home/ArticleGrid';
import atendendo from '../../img/atendendo_um_cliente.png';
import timeOnHand from '../../img/time_on_hand.png';

function Home() {
  return (
    <>
      <Hero />
      
      <FeatureSection
        title="Foque no importante!"
        description={[
          'Nesta jornada, fechamos parceria! Queremos que você se preocupe em entregar o melhor resultado para seu cliente. Todos os agendamentos, deixa com a gente.',
          'Com o mínimo de tempo, você consegue configurar e deixar conosco, fazemos todo o trabalho de levar o cliente até sua cadeira. Não se preocupe mais!'
        ]}
        image={atendendo}
        imageAlt="Atendendo cliente"
        background="#000"
        titleColor="#b91616"
        textColor="#fff"
      />

      <ArticleGrid />

      <FeatureSection
        title="Aproveite melhor o seu tempo!"
        description={[
          'Com muita praticidade você vai configurar seus serviços e preços. De uma forma muito simples, seus clientes vão agendar horários.',
          'Você finalizará seus dias e atendimentos em tempo recorde!',
          'Acreditamos na sua capacidade, o que acha de nos dar uma oportunidade para te ajudarmos?!'
        ]}
        image={timeOnHand}
        imageAlt="Controle seu tempo"
        background="#b91616"
        titleColor="#fff"
        textColor="#fff"
        reversed
      />
    </>
  );
}

export default Home;