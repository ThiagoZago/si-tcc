import React, { useState, useEffect, useRef } from 'react';
import BtnComponent from '../../BtnComponent';
import styles from './RightContent.module.css';

function RightContent(props) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.3, // Visível quando 30% do elemento está na viewport
      }
    );

    const currentRef = sectionRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const styleBg = {
    backgroundColor: `${props.backgroundComponent}`,
    border: `${props.border}`,
    borderRadius: '2.5em',
    padding: '30px',
    textAlign: 'center',
  };
  const pColor = {
    color: `${props.pColor}`,
  };
  const titleColor = {
    color: `${props.titleColor}`,
  };

  return (
    <section
      ref={sectionRef}
      className={`${styles.caixa} ${isVisible ? styles.animateIn : styles.hidden}`}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <img
              src={props.srcImg}
              className="rounded mx-auto d-block"
              alt={props.altImg}
              height="480px"
            />
          </div>
          <div style={styleBg} className="col-md-6 d-block">
            <h3 style={titleColor} className={`fs-2 ${styles.title}`}>
              {props.title}
            </h3>
            <p style={pColor}>{props.p1}</p>
            <p style={pColor}>{props.p2}</p>
            <p style={pColor}>{props.p3}</p>
            <p style={pColor}>{props.p4}</p>
            <BtnComponent
              to="/acesso"
              textButton="CRIAR CONTA"
              textColor="#fff"
              borderColor="#fff"
              backgroundColor="#2c2c2c"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default RightContent;
