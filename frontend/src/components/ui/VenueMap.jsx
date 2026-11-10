import { VENUE, mapaEmbedUrl, mapaLinkUrl } from "../../utils/venue.js";
import "./VenueMap.css";

// Mapa de OpenStreetMap con la ubicación del local (ver utils/venue.js).
function VenueMap() {
  return (
    <div className="venue-map">
      <iframe
        className="venue-map__frame"
        title={`Mapa de ubicación de ${VENUE.nombre}`}
        src={mapaEmbedUrl()}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      <p className="venue-map__address">
        {VENUE.direccion} ·{" "}
        <a href={mapaLinkUrl()} target="_blank" rel="noreferrer">
          Abrir mapa<span className="visually-hidden"> (se abre en una pestaña nueva)</span>
        </a>
      </p>
    </div>
  );
}

export default VenueMap;
