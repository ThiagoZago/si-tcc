import { useState } from 'react';

function Input({ 
  label, 
  type = 'text', 
  error, 
  showPasswordToggle = false,
  className = '',
  ...props 
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label className="form-label" htmlFor={props.id}>
          {label}
        </label>
      )}
      <div className={showPasswordToggle ? 'input-group' : ''}>
        <input
          type={inputType}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        )}
      </div>
      {error && <div className="invalid-feedback d-block">{error}</div>}
      }
    </div>
  );
}

export default Input;