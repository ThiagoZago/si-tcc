function Alert({ type = 'info', children, onClose, className = '' }) {
  const alertClass = `alert alert-${type} ${className}`;

  return (
    <div className={alertClass} role="alert">
      {children}
      {onClose && (
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          aria-label="Close"
        />
      )}
    </div>
  );
}

export default Alert;