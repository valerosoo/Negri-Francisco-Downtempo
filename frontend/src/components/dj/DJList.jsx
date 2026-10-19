import DJCard from "./DJCard.jsx";
import Spinner from "../ui/Spinner.jsx";
import "./DJList.css";

function DJList({ djs, loading, error, onLike, onEdit, onDelete, likingId, deletingId }) {
  if (loading) {
    return <Spinner label="Cargando DJs…" />;
  }

  if (error) {
    return <p className="panel-state panel-state--error">No pudimos cargar los DJs: {error}</p>;
  }

  if (djs.length === 0) {
    return <p className="panel-state">Todavía no hay DJs cargados.</p>;
  }

  return (
    <ul className="dj-list">
      {djs.map((dj) => (
        <DJCard
          key={dj.idDJ}
          dj={dj}
          onLike={onLike}
          onEdit={onEdit}
          onDelete={onDelete}
          liking={likingId === dj.idDJ}
          deleting={deletingId === dj.idDJ}
        />
      ))}
    </ul>
  );
}

export default DJList;
