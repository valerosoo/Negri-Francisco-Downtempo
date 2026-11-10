import "./Stepper.css";

// Selector de cantidad con botones − / +. `label` describe qué se está
// contando para los lectores de pantalla ("entradas", "Negroni de la casa"…).
function Stepper({ value, min = 0, max, onChange, label }) {
  return (
    <div className="stepper" role="group" aria-label={`Cantidad de ${label}`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Quitar una unidad de ${label}`}
      >
        −
      </button>
      <output aria-live="polite">{value}</output>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Sumar una unidad de ${label}`}
      >
        +
      </button>
    </div>
  );
}

export default Stepper;
