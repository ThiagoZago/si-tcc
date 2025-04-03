import styles from './Carousel.module.css'
import { Link } from 'react-router-dom';

import BtnComponent from './BtnComponent';
import { useState } from 'react';


function Carousel() {

    const [isHoveredPrev, setIsHoveredPrev] = useState(false);
    const [isHoveredNext, setIsHoveredNext] = useState(false);

    const gradient = {
        backgroundImage: 'linear-gradient(#000, #b91616)',
    }
    const capa = {
        textAlign: 'center',
    };
    const carouselControlNext = {
        width: '5vh',
        textDecoration: 'none',
        transition: 'transform 0.5s, opacity 0.5s',
        transform: isHoveredNext ? 'scale(1.3)' : 'scale(1)',
        opacity: isHoveredNext ? '0.3' : '1',
    };
    const carouselControlPrev = {
        width: '5vh',
        textDecoration: 'none',
        transition: 'transform 0.5s, opacity 0.5s',
        transform: isHoveredPrev ? 'scale(1.3)' : 'scale(1)',
        opacity: isHoveredPrev ? '0.3' : '1',
    };

    return(

        <section style={gradient} id="home" className="d-flex">
            <div className="container align-self-center">
                <div className="row">
                    <div style={capa} className="col-md-12">
                        <div id="carousel-spotify" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <h1 className={styles.text}>Quer marcar um horário?</h1>
                                    <BtnComponent
                                        to='/agendar'
                                        textButton='pelo whatsapp'
                                        textColor='#fff'
                                        borderColor='rgba(255,255,255,0.5)'
                                        backgroundColor='#2c2c2c'
                                    />
                                    <BtnComponent
                                        to='/agendar'
                                        textButton='pelo site'
                                        textColor='#000'
                                        borderColor='#2c2c2c'
                                        backgroundColor='rgba(255,255,255,0.9)'
                                    />
                                </div>
                
                                <div className="carousel-item">
                                    <h1 className={styles.text}>Seja nosso parceiro!</h1>
                                    <BtnComponent
                                        to='/acesso'
                                        textButton='VAMOS NESSA!'
                                        textColor='#fff'
                                        borderColor='#2c2c2c'
                                        backgroundColor='#000'
                                    />
                                </div>
                            </div>
                            <Link style={carouselControlPrev} onMouseEnter={() => setIsHoveredPrev(true)} onMouseLeave={() => setIsHoveredPrev(false)} data-bs-target="#carousel-spotify" className="carousel-control-prev" data-bs-slide="prev"><i className="fas fa-angle-left fa-3x"></i></Link>
                            <Link style={carouselControlNext} onMouseEnter={() => setIsHoveredNext(true)} onMouseLeave={() => setIsHoveredNext(false)} data-bs-target="#carousel-spotify" className="carousel-control-next" data-bs-slide="next"><i className="fas fa-angle-right fa-3x"></i></Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
  );
}

export default Carousel;

