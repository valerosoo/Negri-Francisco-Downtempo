import { useAsync } from "../../utils/useAsync.js";
import { getRooftopGaleria } from "../../services/rooftopService.js";
import PlaceholderImage from "../ui/PlaceholderImage.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";
import Spinner from "../ui/Spinner.jsx";
import "./panels.css";
import "./RooftopSection.css";

function RooftopSection() {
  const { data: galeria, loading, error } = useAsync(getRooftopGaleria, []);

  return (
    <section className="section rooftop-section" id="rooftop" aria-labelledby="rooftop-heading">
      <div className="container">
        <SectionHeading id="rooftop-heading" lead="El" highlight="Rooftop" />
        <p className="panel-text rooftop-section__intro">
          El espacio para compartir, relajar y disfrutar la noche con la mejor música, con la ciudad de fondo.
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
    </section>
  );
}

export default RooftopSection;
