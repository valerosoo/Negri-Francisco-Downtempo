import Button from "../ui/Button.jsx";
import "./DJCard.css";

function DJCard({ dj, onLike, onEdit, onDelete, liking, deleting }) {
  return (
    <li className="dj-card">
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

        <div className="dj-card__manage">
          <Button variant="ghost" onClick={() => onEdit(dj)}>
            Editar
          </Button>
          <Button variant="danger" onClick={() => onDelete(dj)} loading={deleting}>
            Eliminar
          </Button>
        </div>
      </div>
    </li>
  );
}

export default DJCard;
