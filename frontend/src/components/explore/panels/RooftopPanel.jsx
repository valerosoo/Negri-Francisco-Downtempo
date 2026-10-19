import { useAsync } from "../../../utils/useAsync.js";
import { getRooftopGaleria } from "../../../services/rooftopService.js";
import PlaceholderImage from "../../ui/PlaceholderImage.jsx";
import Spinner from "../../ui/Spinner.jsx";
import "./panels.css";
import "./RooftopPanel.css";

function RooftopPanel() {
  const { data: galeria, loading, error } = useAsync(getRooftopGaleria, []);

  return (
    <div>
      <h3>Rooftop</h3>
      <hr className="rule" />
      <p className="panel-text">
        El espacio para compartir, relajar y disfrutar la noche con la mejor música.
      </p>

      {loading && <Spinner label="Cargando la galería…" />}

      {error && <p className="panel-state panel-state--error">No pudimos cargar la galería: {error}</p>}

      {galeria && (
        <ul className="rooftop-gallery">
          {galeria.map((foto) => (
            <li key={foto.id}>
              <PlaceholderImage label={foto.label} ratio="1 / 1" accent={foto.id % 2 === 0 ? "orange" : "lime"} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RooftopPanel;
