import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './LeftContent.module.css';

function LeftContent(props) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.caixa} ${isVisible ? styles.animateIn : styles.hidden}`}
    >
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-md-6 order-2 order-md-1">
            {props.eyebrow && (
              <span className={styles.eyebrow}>
                <span className={styles.dash}></span>
                {props.eyebrow}
              </span>
            )}

            <h3 className={styles.title}>
              {props.title}
              {props.titleAccent && (
                <>
                  <br />
                  <span className={styles.titleAccent}>{props.titleAccent}</span>
                </>
              )}
            </h3>

            <div className={styles.text}>
              <p>{props.p1}</p>
              <p>{props.p2}</p>
              {props.p3 && <p>{props.p3}</p>}
              {props.p4 && <p>{props.p4}</p>}
            </div>

            <Link to="/acesso" className={styles.ctaLink}>
              Comece agora <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="col-md-6 order-1 order-md-2">
            <div className={styles.imageFrame}>
              <img src={props.srcImg} alt={props.altImg} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LeftContent;