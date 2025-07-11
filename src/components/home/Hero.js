import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import styles from './Hero.module.css';

function Hero() {
  const [isHoveredPrev, setIsHoveredPrev] = useState(false);
  const [isHoveredNext, setIsHoveredNext] = useState(false);

  return (
    <section className={styles.hero} id="home">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <div id="carousel-hero" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <h1 className={styles.title}>Quer marcar um horário?</h1>
                  <div className={styles.buttonGroup}>
                    <Button to="/agendar" variant="secondary" className="mx-2">
                      pelo whatsapp
                    </Button>
                    <Button to="/agendar" variant="outline" className="mx-2">
                      pelo site
                    </Button>
                  </div>
                </div>
                <div className="carousel-item">
                  <h1 className={styles.title}>Seja nosso parceiro!</h1>
                  <div className={styles.buttonGroup}>
                    <Button to="/acesso" variant="primary" className="mx-2">
                      VAMOS NESSA!
                    </Button>
                    </div>
                </div>
              </div>
              
              <Link
                className="carousel-control-prev"
                to="#carousel-hero"
                role="button"
                data-bs-slide="prev"
                onMouseEnter={() => setIsHoveredPrev(true)}
                onMouseLeave={() => setIsHoveredPrev(false)}
              >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </Link>
              <Link
                className="carousel-control-next"
                to="#carousel-hero"
                role="button"
                data-bs-slide="next"
                onMouseEnter={() => setIsHoveredNext(true)}
                onMouseLeave={() => setIsHoveredNext(false)}
              >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;