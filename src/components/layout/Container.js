function Container({ children, fluid = false, className = '' }) {
  const containerClass = fluid ? 'container-fluid' : 'container';
  
  return (
    <div className={`${containerClass} ${className}`}>
      {children}
    </div>
  );
}

export default Container;