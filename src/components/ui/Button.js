import { useState } from 'react';
import { Link } from 'react-router-dom';

function Button({ 
  to, 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick,
  type = 'button',
  className = '',
  ...props 
}) {
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    primary: {
      background: isHovered ? '#5f0b0b' : '#b91616',
      color: '#fff',
      border: '1px solid #b91616'
    },
    secondary: {
      background: isHovered ? '#5f0b0b' : 'transparent',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.5)'
    },
    outline: {
      background: isHovered ? '#5f0b0b' : 'rgba(255,255,255,0.9)',
      color: isHovered ? '#fff' : '#000',
      border: '1px solid #2c2c2c'
    }
  };

  const sizes = {
    sm: { padding: '8px 16px', fontSize: '0.875rem' },
    md: { padding: '10px 20px', fontSize: '1rem' },
    lg: { padding: '12px 24px', fontSize: '1.125rem' }
  };

  const buttonStyle = {
    ...variants[variant],
    ...sizes[size],
    borderRadius: '100px',
    textTransform: 'uppercase',
    fontWeight: '600',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    cursor: 'pointer'
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  if (to) {
    return (
      <Link
        to={to}
        style={buttonStyle}
        className={`btn ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      style={buttonStyle}
      className={`btn ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;