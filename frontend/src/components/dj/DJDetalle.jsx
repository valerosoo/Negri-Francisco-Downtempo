import { useState } from "react";
import Button from "../ui/Button.jsx";
import FormField from "../ui/FormField.jsx";
import Spinner from "../ui/Spinner.jsx";
import { getDJDetalle, recomendarCancion } from "../../services/djService.js";
import { useAsync } from "../../utils/useAsync.js";
import { useToast } from "../../context/ToastContext.jsx";
import { spotifyUrl } from "../../utils/format.js";
import { validateRecomendacionForm, MAX_MENSAJE_RECOMENDACION } from "../../utils/validators.js";

const MAX_RECOMENDACIONES_VISIBLES = 3;

// Ficha desplegable de un DJ: sus playlists (cada tema abre una búsqueda en
// Spotify), DJs parecidos y los temas que le recomendó el público.
function DJDetalle({ dj, onVerDJ }) {
  const { data, loading, error, reload } = useAsync(() => getDJDetalle(dj.idDJ), [dj.idDJ]);

  if (loading && !data) return <Spinner label={`Cargando la ficha de ${dj.nombre}…`} />;

  if (error) {
    return (
      <p className="dj-detail__empty" role="alert">
        No pudimos cargar la ficha: {error}
      </p>
    );
  }

  const { playlists, similares, recomendaciones } = data;

  return (
    <>
      <section className="dj-detail__block" aria-label={`Playlists de ${dj.nombre}`}>
        <h5 className="dj-detail__title">Playlists</h5>
        {playlists.length === 0 && <p className="dj-detail__empty">Todavía no cargó ninguna playlist.</p>}
        {playlists.map((playlist) => (
          <div key={playlist.idPlaylist}>
            <p className="playlist__name">{playlist.nombre}</p>
            <ol className="playlist__songs">
              {playlist.canciones.map((cancion) => (
                <li key={cancion.idCancion}>
                  <a href={spotifyUrl(cancion)} target="_blank" rel="noreferrer">
                    {cancion.titulo}
                    <span className="visually-hidden"> de {cancion.artista}, escuchar en Spotify (pestaña nueva)</span>
                  </a>
                  <span className="playlist__duration">{cancion.duracion}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>

      {similares.length > 0 && (
        <section className="dj-detail__block" aria-label={`DJs parecidos a ${dj.nombre}`}>
          <h5 className="dj-detail__title">Si te gusta {dj.nombre}</h5>
          <ul className="dj-detail__similar">
            {similares.map((similar) => (
              <li key={similar.idDJ}>
                <button type="button" onClick={() => onVerDJ(similar.idDJ)}>
                  {similar.nombre}
                  <small>{similar.mismoGenero ? "mismo género" : similar.generoMusical}</small>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="dj-detail__block" aria-label={`Recomendaciones para ${dj.nombre}`}>
        <h5 className="dj-detail__title">Recomendale un tema</h5>
        {recomendaciones.length > 0 && (
          <ul className="dj-detail__recs">
            {recomendaciones.slice(0, MAX_RECOMENDACIONES_VISIBLES).map((rec) => (
              <li key={rec.idRecomendacion}>
                {rec.tituloCancion} — {rec.artista}
                <p>
                  {rec.mensaje && `“${rec.mensaje}” · `}
                  {rec.nombreCliente || "Anónimo"}
                </p>
              </li>
            ))}
          </ul>
        )}
        <RecomendacionForm dj={dj} onSent={reload} />
      </section>
    </>
  );
}

const EMPTY = { tituloCancion: "", artista: "", mensaje: "", nombre: "" };

function RecomendacionForm({ dj, onSent }) {
  const toast = useToast();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const id = (campo) => `rec-${dj.idDJ}-${campo}`;
  const handleChange = (campo) => (event) => setValues((prev) => ({ ...prev, [campo]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    const found = validateRecomendacionForm(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);

    try {
      await recomendarCancion(dj.idDJ, {
        tituloCancion: values.tituloCancion.trim(),
        artista: values.artista.trim(),
        mensaje: values.mensaje.trim(),
        nombre: values.nombre.trim(),
      });
      toast.success(`Le pasamos tu recomendación a ${dj.nombre}.`);
      setValues(EMPTY);
      onSent();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="rec-form__row">
        <FormField
          id={id("titulo")}
          label="Tema"
          value={values.tituloCancion}
          onChange={handleChange("tituloCancion")}
          error={errors.tituloCancion}
          required
        />
        <FormField
          id={id("artista")}
          label="Artista"
          value={values.artista}
          onChange={handleChange("artista")}
          error={errors.artista}
          required
        />
      </div>
      <FormField
        id={id("mensaje")}
        label="Mensaje"
        value={values.mensaje}
        onChange={handleChange("mensaje")}
        error={errors.mensaje}
        maxLength={MAX_MENSAJE_RECOMENDACION}
        hint="Opcional. ¿Por qué tiene que sonar?"
      />
      <FormField
        id={id("nombre")}
        label="Tu nombre"
        value={values.nombre}
        onChange={handleChange("nombre")}
        autoComplete="name"
        hint="Opcional."
      />
      <Button type="submit" variant="secondary" loading={submitting}>
        Enviar recomendación
      </Button>
    </form>
  );
}

export default DJDetalle;
