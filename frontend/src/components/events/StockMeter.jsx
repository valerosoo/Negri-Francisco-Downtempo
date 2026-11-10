import { estadoCupo } from "../../utils/format.js";
import "./StockMeter.css";

// Cupo del evento: barra de vendido + cuántas entradas quedan. Se actualiza
// cada vez que se recarga la cartelera (después de cada compra o cancelación).
function StockMeter({ evento }) {
  const cupo = estadoCupo(evento);
  const vendido = Math.round(((evento.capacidadMaxima - evento.entradasDisponibles) / evento.capacidadMaxima) * 100);

  const texto =
    cupo === "agotado"
      ? "Agotado"
      : cupo === "ultimas"
        ? `¡Últimas ${evento.entradasDisponibles}!`
        : `Quedan ${evento.entradasDisponibles} entradas`;

  return (
    <div className={`stock-meter stock-meter--${cupo}`}>
      <div className="stock-meter__bar" role="img" aria-label={`${vendido}% de las entradas vendidas`}>
        <span style={{ width: `${vendido}%` }} />
      </div>
      <p className="stock-meter__text">{texto}</p>
    </div>
  );
}

export default StockMeter;
