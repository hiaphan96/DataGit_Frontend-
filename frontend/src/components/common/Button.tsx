import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

export function Button({ variant = 'secondary', loading = false, disabled, children, className, ...rest }: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant} ${className ?? ''}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? 'working...' : children}
    </button>
  );
}

export default Button;