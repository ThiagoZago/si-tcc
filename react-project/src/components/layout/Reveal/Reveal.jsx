import { useScrollReveal } from '../../../hooks/useScrollReveal';
import styles from './Reveal.module.css';

function Reveal({ children, delay = 0, fill = false, className = '' }) {
  const [ref, isVisible] = useScrollReveal(0.15);

  return (
    <div
      ref={ref}
      className={`${styles.hidden} ${isVisible ? styles.visible : ''} ${fill ? styles.fill : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default Reveal;