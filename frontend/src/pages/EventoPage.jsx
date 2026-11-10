import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import VenueMap from "../components/ui/VenueMap.jsx";
import StockMeter from "../components/events/StockMeter.jsx";
import CheckoutDialog from "../components/events/CheckoutDialog.jsx";
import { getEvento } from "../services/eventoService.js";
import { useAsync } from "../utils/useAsync.js";
import { estadoCupo, fechaLarga, formatPrecio, hoyISO, partesFecha } from "../utils/format.js";
import "./EventoPage.css";

// Página de detalle de una fecha: descripción, line-up con bios, horarios,
// precio, cupo en vivo y cómo llegar.
function EventoPage() {
  const { id } = useParams();
  const { data: evento, loading, error, reload } = useAsync(() => getEvento(id), [id]);
  const [comprando, setComprando] = useState(false);
  const cerrarCompra = useCallback(() => setComprando(false), []);

  if (loading && !evento) {
    return (
      <div className="page container">
        <Spinner label="Cargando el evento…" />
      </div>
    );
  }

  if (error || !evento) {
    return (
      <div className="page container">
        <Link to="/#entradas" className="page__back">
          ← Volver a la cartelera
        </Link>
        <p className="panel-state panel-state--error" role="alert">
          No pudimos mostrar este evento: {error}
        </p>
      </div>
    );
  }

  const { dia, mes, diaSemana } = partesFecha(evento.fecha);
  const pasado = evento.fecha < hoyISO();
  const agotado = estadoCupo(evento) === "agotado";

  return (
    <article className="page container evento">
      <Link to="/#entradas" className="page__back">
        ← Volver a la cartelera
      </Link>

      <header className="evento__header">
        <div className="evento__date" aria-hidden="true">
          <span>{diaSemana.slice(0, 3)}</span>
          <strong>{dia}</strong>
          <span>{mes}</span>
        </div>
        <div>
          <p className="eyebrow">Rooftop bar &amp; electronic music</p>
          <h1 className="evento__title">{evento.nombre}</h1>
          <p className="evento__when">
            {fechaLarga(evento.fecha)} · {evento.horaInicio} a {evento.horaFin} hs
          </p>
        </div>
      </header>

      <div className="evento__layout">
        <div className="evento__main">
          {evento.descripcion && <p className="evento__description">{evento.descripcion}</p>}

          <section aria-labelledby="lineup-heading">
            <h2 id="lineup-heading" className="evento__subtitle">
              Line-up
            </h2>
            {evento.djs.length === 0 ? (
              <p className="evento__muted">El line-up se anuncia pronto.</p>
            ) : (
              <ul className="evento__lineup">
                {evento.djs.map((dj) => (
                  <li key={dj.idDJ}>
                    <h3>{dj.nombre}</h3>
                    <p className="evento__genre">
                      {dj.generoMusical} · <span aria-hidden="true">♥</span> {dj.cantidadLikes}
                      <span className="visually-hidden"> likes</span>
                    </p>
                    {dj.biografia && <p className="evento__muted">{dj.biografia}</p>}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="llegar-heading">
            <h2 id="llegar-heading" className="evento__subtitle">
              Cómo llegar
            </h2>
            <VenueMap />
          </section>
        </div>

        <aside className="evento__buy" aria-label="Entradas">
          <p className="evento__price">{formatPrecio(evento.precio)}</p>
          <p className="evento__muted">por entrada · hasta 6 por compra</p>

          <dl className="evento__facts">
            <div>
              <dt>Puertas</dt>
              <dd>{evento.horaInicio} hs</dd>
            </div>
            <div>
              <dt>Cierre</dt>
              <dd>{evento.horaFin} hs</dd>
            </div>
            <div>
              <dt>Capacidad</dt>
              <dd>{evento.capacidadMaxima} personas</dd>
            </div>
          </dl>

          {pasado ? (
            <p className="evento__muted">Este evento ya pasó.</p>
          ) : (
            <>
              <StockMeter evento={evento} />
              <Button onClick={() => setComprando(true)} disabled={agotado}>
                {agotado ? "Agotado" : "Comprar entradas"}
              </Button>
            </>
          )}
        </aside>
      </div>

      {comprando && <CheckoutDialog evento={evento} onClose={cerrarCompra} onPurchased={reload} />}
    </article>
  );
}

export default EventoPage;
