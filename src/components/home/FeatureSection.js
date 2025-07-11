import { useState, useEffect, useRef } from 'react';
import Button from '../ui/Button';
import styles from './FeatureSection.module.css';

function FeatureSection({ 
  title,
  description,
  image,
  background,
  reverse,
  buttonText,
  buttonLink,
  onButtonClick
}) {
  const sectionRef = useRef(null);

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
  };

  return (
    <section className="py-5" style={{ backgroundColor: background }}>
      <div className="container">
        <div 
          ref={sectionRef}
          className={`row align-items-center ${styles.feature} ${
            reverse ? styles.reverse : ''
          }`}>
          <div className="col-lg-6">
            <h2>{title}</h2>
            <p>{description}</p>
            {buttonText && (
              <Button
                onClick={handleButtonClick}
                href={buttonLink}
              >
                {buttonText}
              </Button>
            )}
          </div>
          <div className="col-lg-6">
            <img
              src={image}
              alt={title}
              className="img-fluid"
            />
          </div>
        </div>
      </div>
    </section>
  );
}