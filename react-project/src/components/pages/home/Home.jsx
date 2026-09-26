import Carousel from "../../carousel/Carousel";
import RightContent from "../../layout/RightContent/RightContent";
import LeftContent from "../../layout/LeftContent/LeftContent";
import Article from "../../layout/Article/Article";

import styles from './Home.module.css'
import { colors } from '../../../theme.js';
import { Link } from 'react-router-dom';

import interiorBarbearia from '../../../img/interior_barbearia.jpg'
import time_on_hand from '../../../img/sistema_agendamento_edited.jpg'



function Home(){

    return(
        <>
            <Carousel/>
            <RightContent 
                eyebrow="Parceria inteligente"
                srcImg={interiorBarbearia}
                altImg="Interior da barbearia"
                imageCaption="Ambiente premium"
                title="Foque no que importa,"
                titleAccent="deixe a agenda com a gente."
                p1="Nesta jornada, fechamos parceria! Queremos que você se preocupe em entregar o melhor resultado para seu cliente. Todos os agendamentos, deixa com a gente."
                p2="Com o mínimo de tempo, você consegue configurar e deixar conosco, fazemos todo o trabalho de levar o cliente até sua cadeira."
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
                        textColorBtn={colors.black}
                        borderBtn={colors.darkSoft}
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
                        textColorBtn="#000"
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
                        textColorBtn="#000"
                        borderBtn="#2c2c2c"
                        bgBtn="none"

                        smallText={<span>
                            Em caso de dúvidas, <Link style={{textDecoration:'none', color:'red'}} to='ajuda'>clique aqui</Link>
                        </span>}
                    />

                </div>
            </div>

            <LeftContent 
                eyebrow="Praticidade total"
                srcImg={time_on_hand}
                altImg="Sistema de agendamento no celular"
                title="Aproveite melhor"
                titleAccent="o seu tempo."
                p1="Com muita praticidade você vai configurar seus serviços e preços. De uma forma muito simples, seus clientes vão agendar horários."
                p2="Você finalizará seus dias e atendimentos em tempo recorde!"
                p3="Acreditamos na sua capacidade, o que acha de nos dar uma oportunidade para te ajudarmos?!"
            />
        </>
    );
}

export default Home