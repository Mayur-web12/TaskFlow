
const Input = ({
  label,
  id,
  error,
  hint,
  className = '',
  ...props
}) => {
  const inputId = id || props.name;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;

  const describedBy = [hintId, errorId]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className={`common-field ${className}`}>
      {label && (
        <label className="common-field__label" htmlFor={inputId}>
          {label}
          {props.required && (
            <span className="common-field__required"> *</span>
          )}
        </label>
      )}

      <input
        id={inputId}
        className={`common-input ${error ? 'common-input--error' : ''}`}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...props}
        
      />

      {hint && (
        <p className="common-field__hint" id={hintId}>
          {hint}
        </p>
      )}

      {error && (
        <p className="common-field__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
