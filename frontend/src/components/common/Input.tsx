import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string | null;
  valid?: boolean;
}

export function Input({ error, valid, className, ...rest }: InputProps) {
  return (
    <div className="field-input">
      <input className={`field-input__control ${error ? 'field-input__control--error' : ''} ${className ?? ''}`} aria-invalid={!!error} {...rest} />
      {valid && !error && <span className="field-input__check" aria-hidden="true">✓</span>}
      {error && <p className="field-input__error" role="alert">{error}</p>}
    </div>
  );
}

export default Input;