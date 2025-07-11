function Card({ children, className = '', animated = false, ...props }) {
  return (
    <div 
      className={`card ${animated ? 'fade-in' : ''} ${className}`}
      {...props}
    >
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

export default Card;