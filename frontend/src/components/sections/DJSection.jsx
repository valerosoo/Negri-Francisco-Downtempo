import { useState } from "react";
import { useAsync } from "../../utils/useAsync.js";
import { useToast } from "../../context/ToastContext.jsx";
import { getDJs, createDJ, likeDJ } from "../../services/djService.js";
import DJList from "../dj/DJList.jsx";
import DJForm from "../dj/DJForm.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";
import "./panels.css";
import "./DJSection.css";

// Sección pública de DJs: likes, ficha de cada uno (playlists, parecidos y
// recomendaciones) y el formulario de presentación. La edición y la baja
// viven en el panel de administración.
function DJSection() {
  const { data: djs, loading, error, reload } = useAsync(getDJs, []);
  const toast = useToast();

  const [likingId, setLikingId] = useState(null);
  const [abiertoId, setAbiertoId] = useState(null);

  const handleCreate = async (payload) => {
    try {
      await createDJ(payload);
      toast.success(`${payload.nombre} se sumó a los DJs de Downtempo.`);
      reload();
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const handleLike = async (dj) => {
    setLikingId(dj.idDJ);

    try {
      await likeDJ(dj.idDJ);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLikingId(null);
    }
  };

  return (
    <section className="section dj-section" id="djs" aria-labelledby="djs-heading">
      <div className="container">
        <SectionHeading id="djs-heading" lead="Los DJs de" highlight="Downtempo" />
        <p className="panel-text dj-section__intro">
          La música que marca el ritmo de la noche. Dale like a tus favoritos, escuchá sus playlists y recomendales
          un tema para la próxima fecha.
        </p>

        <div className="panel-grid">
          <div className="panel-block">
            <DJList
              djs={djs ?? []}
              loading={loading && !djs}
              error={error}
              onLike={handleLike}
              likingId={likingId}
              abiertoId={abiertoId}
              onToggle={(dj) => setAbiertoId((actual) => (actual === dj.idDJ ? null : dj.idDJ))}
              onVerDJ={setAbiertoId}
            />
          </div>

          <div className="panel-block dj-section__form">
            <h3>¿Sos DJ?</h3>
            <hr className="rule" />
            <p className="panel-text">
              Podés llenar el siguiente formulario para que te presentes si querés venir a mostrar tu música.
            </p>

            <DJForm onSubmit={handleCreate} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default DJSection;
