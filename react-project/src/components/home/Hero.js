import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Container from '../layout/Container';
import styles from './Hero.module.css';

const slides = [
  {
    title: 'Quer marcar um horário?',
    buttons: [
      { to: '/agendar', text: 'pelo whatsapp', variant: 'secondary' },
      { to: '/agendar', text: 'pelo site', variant: 'outline' }
    ]
  },
  {
    title: 'Seja nosso parceiro!',
    buttons: [
      { to: '/acesso', text: 'VAMOS NESSA!', variant: 'primary' }
    ]
  }
];

function Hero() {
  const [isHoveredPrev, setIsHoveredPrev] = useState(false);
  const [isHoveredNext, setIsHoveredNext] = useState(false);

  const controlStyle = (isHovered) => ({
    width: '5vh',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    transform: isHovered ? 'scale(1.3)' : 'scale(1)',
    opacity: isHovered ? '0.7' : '1',
    color: '#fff'
  });

  return (
    <section className={styles.hero} id="home">
      <Container>
        <div className="row">
          <div className="col-12 text-center">
            <div id="carousel-hero" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                {slides.map((slide, index) => (
                  <div 
                    key={index} 
                    className={`carousel-item ${index === 0 ? 'active' : ''}`}
                  >
                    <h1 className={styles.title}>{slide.title}</h1>
                    <div className={styles.buttonGroup}>
                      {slide.buttons.map((button, btnIndex) => (
                        <Button
                          key={btnIndex}
                          to={button.to}
                          variant={button.variant}
                          className="mx-2"
                        >
                          {button.text}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <Link
                style={controlStyle(isHoveredPrev)}
                onMouseEnter={() => setIsHoveredPrev(true)}
                onMouseLeave={() => setIsHoveredPrev(false)}
                data-bs-target="#carousel-hero"
                className="carousel-control-prev"
                data-bs-slide="prev"
              >
                <i className="fas fa-angle-left fa-3x"></i>
              </Link>
              
              <Link
                style={controlStyle(isHoveredNext)}
                onMouseEnter={() => setIsHoveredNext(true)}
                onMouseLeave={() => setIsHoveredNext(false)}
                data-bs-target="#carousel-hero"
                className="carousel-control-next"
                data-bs-slide="next"
              >
                <i className="fas fa-angle-right fa-3x"></i>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Hero;