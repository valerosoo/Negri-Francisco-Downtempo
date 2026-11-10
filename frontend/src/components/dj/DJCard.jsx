import { useEffect, useRef } from "react";
import Button from "../ui/Button.jsx";
import DJDetalle from "./DJDetalle.jsx";
import "./DJCard.css";

function DJCard({ dj, onLike, liking, abierto, onToggle, onVerDJ }) {
  const cardRef = useRef(null);
  const detalleId = `dj-detalle-${dj.idDJ}`;

  // Cuando la ficha se abre desde "DJs parecidos" de otra tarjeta, la traemos a la vista.
  useEffect(() => {
    if (abierto) cardRef.current?.scrollIntoView({ block: "nearest" });
  }, [abierto]);

  return (
    <li className={`dj-card${abierto ? " dj-card--open" : ""}`} ref={cardRef}>
      <div className="dj-card__header">
        <h4>{dj.nombre}</h4>
        <span className="dj-card__genero">{dj.generoMusical}</span>
      </div>

      {dj.biografia && <p className="dj-card__bio">{dj.biografia}</p>}

      <div className="dj-card__actions">
        <button
          type="button"
          className="dj-card__like"
          onClick={() => onLike(dj)}
          disabled={liking}
          aria-label={`Dar like a ${dj.nombre}, ${dj.cantidadLikes} likes actuales`}
        >
          <span aria-hidden="true">{liking ? "…" : "♥"}</span> {dj.cantidadLikes}
        </button>

        <Button variant="ghost" onClick={() => onToggle(dj)} aria-expanded={abierto} aria-controls={detalleId}>
          {abierto ? "Cerrar ficha" : "Playlists y más"}
        </Button>
      </div>

      {abierto && (
        <div id={detalleId} className="dj-card__detail">
          <DJDetalle dj={dj} onVerDJ={onVerDJ} />
        </div>
      )}
    </li>
  );
}

export default DJCard;
