import { useEffect, useState, useRef } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import BtnComponent from '../../BtnComponent';
import styles from './Article.module.css';

function Article(props) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const Icon = props.icon;

  useEffect(() => {
    // Criação do observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);  // Quando o artigo entra na tela, torna-se visível
      },
      { threshold: 0.5 } // Define que o artigo deve estar 50% visível para ser considerado visível
    );

    const current = cardRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`${styles.artigo} ${isVisible ? styles.visible : ''}`}
    >
      {Icon && (
        <div className={styles.iconWrap}>
          <Icon size={22} strokeWidth={2} />
        </div>
      )}

      <h4 className={styles.title}>{props.title}</h4>
      <p className={styles.subtitle}>{props.subtitle}</p>

      <ul className={styles.features}>
        {[props.item1, props.item2, props.item3, props.item4]
          .filter(Boolean)
          .map((item, i) => (
            <li key={i}>
              <Check size={16} strokeWidth={3} className={styles.checkIcon} />
              <span>{item}</span>
            </li>
          ))}
      </ul>

      <div className={styles.ctaWrap}>
        <BtnComponent
          to={props.toBtn}
          textButton={props.textBtn}
          textColor={props.textColorBtn}
          borderColor={props.borderBtn}
          backgroundColor={props.bgBtn}
        />
      </div>

      {props.smallText && (
        <small className={styles.smallText}>{props.smallText}</small>
      )}
    </div>
  );
}

export default Article;
