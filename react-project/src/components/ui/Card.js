import styles from './Card.module.css';

function Card({ children, className = '', animated = false, ...props }) {
  return (
    <div 
      className={`${styles.card} ${animated ? styles.animated : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;