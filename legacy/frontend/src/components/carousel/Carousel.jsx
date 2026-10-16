import styles from './Carousel.module.css'
import { ChevronLeft, ChevronRight, ArrowRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { colors } from '../../theme';


function Carousel() {

    const gradient = {
        backgroundImage: `linear-gradient(${colors.black}, ${colors.red})`,
    }

    return (

        <section style={gradient} id="home" className={`d-flex ${styles.caixa}`}>
            <div className="container">
                <div className={styles.wrapper}>
                    <div id="carousel-spotify" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <span className={styles.eyebrow}>
                                    <span className={styles.dash}></span>
                                    AGENDAMENTO ONLINE
                                </span>
                                <h1 className={styles.text}>Quer marcar<br />um horário?</h1>
                                <p className={styles.subtitle}>
                                    Escolha o profissional, o serviço e o melhor horário para você.
                                </p>
                                <div className={styles.btnGroup}>
                                    <Link to='/agendar' className={styles.btnPrimary}>
                                        Agendar pelo site <ArrowRight size={18} strokeWidth={2.5} />
                                    </Link>
                                    <Link to='/agendar' className={styles.btnGhost}>
                                        <MessageCircle size={18} strokeWidth={2.2} /> Pelo WhatsApp
                                    </Link>
                                </div>
                            </div>

                            <div className="carousel-item">
                                <span className={styles.eyebrow}>
                                    <span className={styles.dash}></span>
                                    PARA DONOS DE BARBEARIA
                                </span>
                                <h1 className={styles.text}>Seja nosso<br />parceiro!</h1>
                                <p className={styles.subtitle}>
                                    Gerencie sua agenda, seus profissionais e seus clientes em um só lugar.
                                </p>
                                <div className={styles.btnGroup}>
                                    <div className={styles.btnGroup}>
                                        <Link to='/acesso' className={styles.btnPrimary}>
                                            Vamos nessa <ArrowRight size={18} strokeWidth={2.5} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            data-bs-target="#carousel-spotify"
                            data-bs-slide="prev"
                            className={`${styles.navBtn} ${styles.navPrev}`}
                            aria-label="Anterior"
                        >
                            <ChevronLeft size={22} strokeWidth={2.5} />
                        </button>
                        <button
                            type="button"
                            data-bs-target="#carousel-spotify"
                            data-bs-slide="next"
                            className={`${styles.navBtn} ${styles.navNext}`}
                            aria-label="Próximo"
                        >
                            <ChevronRight size={22} strokeWidth={2.5} />
                        </button>


                    </div>
                </div>
            </div>
        </section>
    );
}

export default Carousel;
