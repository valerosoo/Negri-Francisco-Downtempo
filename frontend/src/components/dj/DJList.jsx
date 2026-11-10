import DJCard from "./DJCard.jsx";
import Spinner from "../ui/Spinner.jsx";
import "./DJList.css";

function DJList({ djs, loading, error, onLike, likingId, abiertoId, onToggle, onVerDJ }) {
  if (loading) {
    return <Spinner label="Cargando DJs…" />;
  }

  if (error) {
    return (
      <p className="panel-state panel-state--error" role="alert">
        No pudimos cargar los DJs: {error}
      </p>
    );
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
          liking={likingId === dj.idDJ}
          abierto={abiertoId === dj.idDJ}
          onToggle={onToggle}
          onVerDJ={onVerDJ}
        />
      ))}
    </ul>
  );
}

export default DJList;
