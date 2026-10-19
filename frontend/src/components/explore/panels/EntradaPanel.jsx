import PlaceholderImage from "../../ui/PlaceholderImage.jsx";
import HoursList from "../../ui/HoursList.jsx";
import "./panels.css";

function EntradaPanel() {
  return (
    <div className="panel-grid">
      <div className="panel-block">
        <h3>
          Bienvenido a <span className="accent">Downtempo</span>
        </h3>
        <hr className="rule" />
        <p className="panel-text">
          Un rooftop bar que combina música electrónica, arte urbano y una vista a la ciudad.
        </p>
        <PlaceholderImage label="Fachada y entrada de Downtempo" ratio="4 / 3" />
      </div>

      <div className="panel-block">
        <h3>Horarios</h3>
        <hr className="rule" />
        <HoursList />
      </div>
    </div>
  );
}

export default EntradaPanel;
