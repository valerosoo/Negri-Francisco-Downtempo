import "./Spinner.css";

function Spinner({ label = "Cargando…" }) {
  return (
    <div className="spinner" role="status">
      <span className="spinner__circle" aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </div>
  );
}

export default Spinner;
