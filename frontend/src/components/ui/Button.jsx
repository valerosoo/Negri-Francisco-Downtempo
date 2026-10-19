import { forwardRef } from "react";
import "./Button.css";

const Button = forwardRef(function Button(
  { children, variant = "primary", loading = false, disabled = false, type = "button", ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`btn btn--${variant}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      <span>{loading ? "Procesando…" : children}</span>
    </button>
  );
});

export default Button;
