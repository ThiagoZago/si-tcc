import Carousel from "../../carousel/Carousel";
import RightContent from "../../layout/RightContent/RightContent";
import LeftContent from "../../layout/LeftContent/LeftContent";
import Article from "../../layout/Article/Article";

import styles from './Home.module.css'
import { colors } from '../../../theme.js';
import { Link } from 'react-router-dom';

import interiorBarbearia from '../../../img/interior_barbearia.jpg'
import time_on_hand from '../../../img/sistema_agendamento_edited.jpg'

import { Zap, Wallet, Smile } from 'lucide-react';



function Home() {

    return (
        <>
            <Carousel />
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
                <div className={styles.articlesGrid}>
                    <Article
                        icon={Zap}
                        title="Praticidade"
                        subtitle="Configure em minutos, sem complicação"
                        item1="Cadastro rápido do seu negócio"
                        item2="Agenda pronta em poucos cliques"
                        item3="Sem curva de aprendizado"

                        toBtn="/acesso"
                        textBtn="COMEÇAR AGORA"
                        textColorBtn="#fff"
                        borderBtn="#b91616"
                        bgBtn="#b91616"

                        smallText={<span>
                            Em caso de dúvidas, <Link style={{ textDecoration: 'none', color: '#b91616' }} to='ajuda'>clique aqui</Link>
                        </span>}
                    />
                    <Article
                        icon={Wallet}
                        title="Controle financeiro"
                        subtitle="Saiba exatamente quanto você fatura"
                        item1="Histórico completo de atendimentos"
                        item2="Visão clara da receita por período"
                        item3="Menos tempo com planilhas"

                        toBtn="/acesso"
                        textBtn="VER COMO FUNCIONA"
                        textColorBtn="#0c0c0c"
                        borderBtn="#0c0c0c"
                        bgBtn="none"

                        smallText={<span>
                            Em caso de dúvidas, <Link style={{ textDecoration: 'none', color: '#b91616' }} to='ajuda'>clique aqui</Link>
                        </span>}
                    />
                    <Article
                        icon={Smile}
                        title="Experiência do cliente"
                        subtitle="Agendamento simples fideliza"
                        item1="Cliente marca horário em segundos"
                        item2="Lembretes automáticos, menos faltas"
                        item3="Atendimento mais profissional"

                        toBtn="/acesso"
                        textBtn="EXPERIMENTAR"
                        textColorBtn="#0c0c0c"
                        borderBtn="#0c0c0c"
                        bgBtn="none"

                        smallText={<span>
                            Em caso de dúvidas, <Link style={{ textDecoration: 'none', color: '#b91616' }} to='ajuda'>clique aqui</Link>
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