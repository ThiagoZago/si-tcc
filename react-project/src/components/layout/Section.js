function Section({ 
  children, 
  className = '', 
  background = 'transparent',
  padding = 'py-5',
  ...props 
}) {
  const sectionStyle = {
    backgroundColor: background
  };

  return (
    <section 
      className={`${padding} ${className}`} 
      style={sectionStyle}
      {...props}
    >
      {children}
    </section>
  );
}

export default Section;