import Carousel from "../Carousel";
import RightContent from "../layout/RightContent/RightContent";
import LeftContent from "../layout/LeftContent/LeftContent";
import Article from "../layout/Article/Article";

import styles from './Home.module.css'
import { Link } from 'react-router-dom';

import atendendo from '../../img/barbeiro_trabalhando.jpg'
import time_on_hand from '../../img/sistema_agendamento.jpg'



function Home(){

    return(
        <>
            <Carousel/>
            <RightContent 
                backgroundComponent='#000'
                border='2px solid #919496'
                titleColor='#b91616'
                pColor='#fff'
                srcImg={atendendo}
                altImg='atendendo'
                title='Foque no importante!'
                p1='Nesta jornada, fechamos parceria!
                Queremos que você se preocupe em entregar o melhor resultado para 
                seu cliente. Todos os agendamentos, deixa com a gente.'
                p2='Com o mínimo de tempo, você consegue configurar e deixar conosco, 
                fazemos todo o trabalho de levar o cliente até sua cadeira.
                Não se preocupe mais!'
            />

            <div className={`container ${styles.caixa}`}>
                <div className="row column-gap-1">
                    <Article 
                        title="Artigo 1"
                        subtitle="legenda doida"
                        p="vantagem"
                        item1="ABC"
                        item2="WYZ"
                        item3="TSZ"

                        toBtn="/acesso"
                        textBtn="TESTE 1"
                        textColorBtn="000"
                        borderBtn="#2c2c2c"
                        bgBtn="none"

                        smallText={<span>
                                    Em caso de dúvidas, <Link style={{textDecoration:'none', color:'red'}} to='ajuda'>clique aqui</Link>
                                </span>}
                    />
                    <Article 
                        title="Artigo 2"
                        subtitle="legenda maluca"
                        p="desvantagem"
                        item1="ABC"
                        item2="WYZ"
                        item3="TSZ"

                        toBtn="/acesso"
                        textBtn="TESTE 2"
                        textColorBtn="000"
                        borderBtn="#2c2c2c"
                        bgBtn="none"

                        smallText={<span>
                            Em caso de dúvidas, <Link style={{textDecoration:'none', color:'red'}} to='ajuda'>clique aqui</Link>
                        </span>}
                    />
                    <Article 
                        title="Artigo 2"
                        subtitle="legenda maluca"
                        p="desvantagem"
                        item1="ABC"
                        item2="WYZ"
                        item3="TSZ"

                        toBtn="/acesso"
                        textBtn="TESTE 2"
                        textColorBtn="000"
                        borderBtn="#2c2c2c"
                        bgBtn="none"

                        smallText={<span>
                            Em caso de dúvidas, <Link style={{textDecoration:'none', color:'red'}} to='ajuda'>clique aqui</Link>
                        </span>}
                    />

                </div>
            </div>

            <LeftContent 
                backgroundComponent='#b91616'
                border='2px solid #000'
                titleColor='#fff'
                pColor='#fff'
                srcImg={time_on_hand}
                altImg='controle seu tempo'
                title='Aproveite melhor o seu tempo!'
                p1='Com muita praticidade você vai configurar seus serviçõs e preços.
                De uma forma muito simples, seus clientes vão agendar horários.'
                p2='Você finalizará seus dias e atendimentos em tempo recorde!'
                p3='Acreditamos na sua capacidade, o que acha de nos dar uma oportunidade
                para te ajudarmos?!'
            />
        </>
    );
}

export default Home;