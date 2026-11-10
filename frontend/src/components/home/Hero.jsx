import { Link } from "react-router-dom";
import Button from "../ui/Button.jsx";
import Spinner from "../ui/Spinner.jsx";
import { estadoCupo, formatPrecio, partesFecha } from "../../utils/format.js";
import "./Hero.css";

// El hero es la próxima fecha de la cartelera: lo primero que se ve es
// qué noche viene, quién toca y el botón para comprar.
function Hero({ evento, loading, error, onComprar }) {
  return (
    <section className="hero" aria-label="Próxima noche en Downtempo">
      <div className="container hero__inner">
        {loading && !evento && <Spinner label="Cargando la próxima fecha…" />}

        {error && (
          <p className="panel-state panel-state--error" role="alert">
            No pudimos cargar la cartelera: {error}
          </p>
        )}

        {!loading && !error && !evento && (
          <div className="hero__copy">
            <p className="eyebrow">Rooftop bar &amp; electronic music</p>
            <h1 className="hero__title">
              Próximas <span className="accent">fechas</span>
            </h1>
            <p className="hero__subtitle">Estamos armando la próxima noche. Volvé pronto.</p>
          </div>
        )}

        {evento && <HeroEvento evento={evento} onComprar={onComprar} />}
      </div>

      <a href="#entradas" className="hero__scroll" aria-label="Ver toda la cartelera">
        ↓
      </a>
    </section>
  );
}

function HeroEvento({ evento, onComprar }) {
  const { dia, mes, diaSemana } = partesFecha(evento.fecha);
  const cupo = estadoCupo(evento);
  const agotado = cupo === "agotado";

  return (
    <>
      <div className="hero__copy">
        <p className="eyebrow">Próxima noche · Rooftop bar &amp; electronic music</p>
        <h1 className="hero__title">{evento.nombre}</h1>

        {evento.djs.length > 0 && (
          <ul className="hero__lineup" aria-label="Line-up">
            {evento.djs.map((dj) => (
              <li key={dj.idDJ}>{dj.nombre}</li>
            ))}
          </ul>
        )}

        <p className="hero__meta">
          {evento.horaInicio} a {evento.horaFin} hs · Desde <strong>{formatPrecio(evento.precio)}</strong>
        </p>

        <div className="hero__actions">
          <Button onClick={() => onComprar(evento)} disabled={agotado}>
            {agotado ? "Agotado" : "Comprar entradas"}
          </Button>
          <Link to={`/eventos/${evento.idEvento}`} className="hero__link">
            Ver detalle del evento
          </Link>
          <a href="#entradas" className="hero__link">
            Ver toda la cartelera
          </a>
        </div>

        {cupo === "ultimas" && (
          <p className="hero__alert">Quedan {evento.entradasDisponibles} entradas. ¡Últimas!</p>
        )}
      </div>

      <div className="hero__date" aria-label={`${diaSemana} ${dia} de ${mes}`}>
        <span className="hero__date-day">{diaSemana}</span>
        <span className="hero__date-num">{dia}</span>
        <span className="hero__date-month">{mes}</span>
      </div>
    </>
  );
}

export default Hero;
