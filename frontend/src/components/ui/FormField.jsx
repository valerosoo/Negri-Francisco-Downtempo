import "./FormField.css";

function FormField({
  id,
  label,
  error,
  as = "input",
  type = "text",
  hint,
  ...rest
}) {
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const Field = as === "textarea" ? "textarea" : "input";

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field__label">
        {label}
      </label>
      <Field
        id={id}
        type={as === "input" ? type : undefined}
        className={`form-field__control${error ? " form-field__control--error" : ""}`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className="form-field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="form-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
