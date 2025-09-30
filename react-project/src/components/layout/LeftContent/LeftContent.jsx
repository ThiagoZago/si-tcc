import React, { useState, useEffect, useRef } from 'react';
import BtnComponent from '../../BtnComponent';
import styles from './LeftContent.module.css';

function LeftContent(props) {
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
    borderRadius: '0.5em',
  };
  const pColor = {
    color: `${props.pColor}`,
    fontSize:'1.2em',
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
        <div style={styleBg} className="row">
          <div className="col-md-6 rounded-start p-5">
            <h3 style={titleColor} className={`fs-2 ${styles.title}`}>
              {props.title}
            </h3>
            <div className='py-4'>
              <p style={pColor}>{props.p1}</p>
              <p style={pColor}>{props.p2}</p>
              <p style={pColor}>{props.p3}</p>
              <p style={pColor}>{props.p4}</p>
            </div>
            <div>
              <BtnComponent
              to="/acesso"
              textButton="COMECE AGORA"
              textColor="#b91616"
              borderColor="#2c2c2c"
              backgroundColor="#000"
              />
            </div>
            
          </div>
          <div className="col-md-6 px-0">
            <img
              src={props.srcImg}
              className="img-fluid rounded-end"
              alt={props.altImg}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default LeftContent;
