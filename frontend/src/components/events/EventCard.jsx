import { Link } from "react-router-dom";
import Button from "../ui/Button.jsx";
import StockMeter from "./StockMeter.jsx";
import { estadoCupo, formatPrecio, partesFecha } from "../../utils/format.js";
import "./EventCard.css";

function EventCard({ evento, onComprar }) {
  const { dia, mes, diaSemana } = partesFecha(evento.fecha);
  const cupo = estadoCupo(evento);
  const agotado = cupo === "agotado";

  return (
    <li className={`event-card event-card--${cupo}`}>
      <div className="event-card__date" aria-hidden="true">
        <span className="event-card__weekday">{diaSemana.slice(0, 3)}</span>
        <span className="event-card__day">{dia}</span>
        <span className="event-card__month">{mes}</span>
      </div>

      <div className="event-card__body">
        <h3 className="event-card__name">
          <Link to={`/eventos/${evento.idEvento}`}>{evento.nombre}</Link>
        </h3>
        <p className="event-card__when">
          {diaSemana} {dia} de {mes} · {evento.horaInicio} a {evento.horaFin} hs
        </p>

        {evento.djs.length > 0 && (
          <ul className="event-card__lineup" aria-label={`Line-up de ${evento.nombre}`}>
            {evento.djs.map((dj) => (
              <li key={dj.idDJ}>
                {dj.nombre} <span>{dj.generoMusical}</span>
              </li>
            ))}
          </ul>
        )}

        <Link to={`/eventos/${evento.idEvento}`} className="event-card__more">
          Ver detalle<span className="visually-hidden"> de {evento.nombre}</span> →
        </Link>
      </div>

      <div className="event-card__buy">
        <p className="event-card__price">{formatPrecio(evento.precio)}</p>
        <StockMeter evento={evento} />

        <Button onClick={() => onComprar(evento)} disabled={agotado}>
          {agotado ? "Agotado" : "Comprar"}
        </Button>
      </div>
    </li>
  );
}

export default EventCard;
