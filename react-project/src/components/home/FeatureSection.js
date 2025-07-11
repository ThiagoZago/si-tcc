import { useState, useEffect, useRef } from 'react';
import Button from '../ui/Button';
import Container from '../layout/Container';
import Section from '../layout/Section';
import styles from './FeatureSection.module.css';

function FeatureSection({ 
  title, 
  description, 
  image, 
  imageAlt, 
  reversed = false,
  background = 'transparent',
  titleColor = '#000',
  textColor = '#666'
}) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
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

  const contentStyle = {
    backgroundColor: background === 'transparent' ? 'rgba(240, 240, 240, 0.95)' : background,
    color: textColor,
    borderRadius: '24px',
    padding: '40px',
    textAlign: 'center'
  };

  const titleStyle = {
    color: titleColor,
    marginBottom: '1.5rem'
  };

  return (
    <Section background={background}>
      <Container>
        <div 
          ref={sectionRef}
          className={`row align-items-center ${styles.feature} ${
            isVisible ? styles.visible : styles.hidden
          }`}
        >
          <div className={`col-md-6 ${reversed ? 'order-md-2' : ''}`}>
            <div style={contentStyle}>
              <h3 style={titleStyle} className="fs-2">
                {title}
              </h3>
              {Array.isArray(description) ? (
                description.map((text, index) => (
                  <p key={index} className="mb-3">{text}</p>
                ))
              ) : (
                <p className="mb-4">{description}</p>
              )}
              <Button to="/acesso" variant="primary">
                COMECE AGORA
              </Button>
            </div>
          </div>
          
          <div className={`col-md-6 ${reversed ? 'order-md-1' : ''}`}>
            <img
              src={image}
              className="img-fluid rounded"
              alt={imageAlt}
              style={{ maxHeight: '480px', width: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default FeatureSection;