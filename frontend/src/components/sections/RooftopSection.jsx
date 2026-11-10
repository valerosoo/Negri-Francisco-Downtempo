import { useEffect, useState } from "react";
import { useAsync } from "../../utils/useAsync.js";
import { getRooftopGaleria } from "../../services/rooftopService.js";
import Modal from "../ui/Modal.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";
import Spinner from "../ui/Spinner.jsx";
import "./panels.css";
import "./RooftopSection.css";

function RooftopSection() {
  const { data: galeria, loading, error } = useAsync(getRooftopGaleria, []);
  const [abierta, setAbierta] = useState(null); // índice de la imagen ampliada

  return (
    <section className="section rooftop-section" id="rooftop" aria-labelledby="rooftop-heading">
      <div className="container">
        <SectionHeading id="rooftop-heading" lead="El" highlight="Rooftop" />
        <p className="panel-text rooftop-section__intro">
          El espacio para compartir, relajar y disfrutar la noche con la mejor música, con la ciudad de fondo.
        </p>

        {loading && <Spinner label="Cargando la galería…" />}

        {error && (
          <p className="panel-state panel-state--error" role="alert">
            No pudimos cargar la galería: {error}
          </p>
        )}

        {galeria && (
          <ul className="rooftop-gallery">
            {galeria.map((foto, index) => (
              <li key={foto.id}>
                <button type="button" className="rooftop-gallery__item" onClick={() => setAbierta(index)}>
                  <img src={foto.src} alt={foto.label} loading="lazy" width="800" height="600" />
                  <span className="visually-hidden">Ampliar imagen</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {abierta !== null && (
        <Lightbox fotos={galeria} index={abierta} onChange={setAbierta} onClose={() => setAbierta(null)} />
      )}
    </section>
  );
}

// Imagen ampliada con anterior / siguiente (botones o flechas del teclado).
function Lightbox({ fotos, index, onChange, onClose }) {
  const foto = fotos[index];
  const anterior = () => onChange((index - 1 + fotos.length) % fotos.length);
  const siguiente = () => onChange((index + 1) % fotos.length);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") onChange((index - 1 + fotos.length) % fotos.length);
      if (event.key === "ArrowRight") onChange((index + 1) % fotos.length);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [index, fotos.length, onChange]);

  return (
    <Modal onClose={onClose} label="Galería del rooftop" size="lg" className="lightbox">
      <figure>
        <img src={foto.src} alt={foto.label} />
        <figcaption aria-live="polite">
          {foto.label}{" "}
          <span>
            {index + 1} / {fotos.length}
          </span>
        </figcaption>
      </figure>
      <div className="lightbox__nav">
        <button type="button" onClick={anterior}>
          ← Anterior
        </button>
        <button type="button" onClick={siguiente} data-autofocus>
          Siguiente →
        </button>
      </div>
    </Modal>
  );
}

export default RooftopSection;
