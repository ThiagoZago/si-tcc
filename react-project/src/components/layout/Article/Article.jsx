import { useEffect, useState } from 'react';
import BtnComponent from '../../BtnComponent';
import styles from './Article.module.css';

function Article(props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Criação do observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);  // Quando o artigo entra na tela, torna-se visível
        }
      },
      {
        threshold: 0.5, // Define que o artigo deve estar 50% visível para ser considerado visível
      }
    );

    // Seleciona o artigo que será observado
    const artigoElement = document.getElementById('artigo');
    if (artigoElement) {
      observer.observe(artigoElement);
    }

    // Limpeza do observer
    return () => {
      if (artigoElement) {
        observer.unobserve(artigoElement);
      }
    };
  }, []);

  return (
    <div
      id="artigo"
      className={`${styles.artigo} ${isVisible ? styles.visible : ''} col-md-3 mx-auto`}
    >
      <h4>{props.title}</h4>
      <p>{props.subtitle}</p>
      <hr />
      <br />
      <p>{props.p}</p>
      <ul>
        <li>{props.item1}</li>
        <li>{props.item2}</li>
        <li>{props.item3}</li>
        <li>{props.item4}</li>
      </ul>
      <div className="d-flex justify-content-center">
        <BtnComponent
          to={`${props.toBtn}`}
          textButton={`${props.textBtn}`}
          textColor={`${props.textColorBtn}`}
          borderColor={`${props.borderBtn}`}
          backgroundColor={`${props.bgBtn}`}
        />
      </div>
      <small
        className={`text-muted mt-5 d-flex justify-content-center ${styles.smallText}`}
      >
        {props.smallText}
      </small>
    </div>
  );
}

export default Article;
