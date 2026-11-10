import { QRCodeSVG } from "qrcode.react";
import "./TicketCard.css";

const ESTADOS = {
  valida: "Válida",
  usada: "Usada",
  cancelada: "Cancelada",
};

// Una entrada: QR con el código (lo que se escanea en la puerta), el código
// legible y a nombre de quién está. `cancelada` viene de la reserva.
function TicketCard({ entrada, numero, cancelada = false }) {
  const estado = cancelada ? "cancelada" : entrada.usada ? "usada" : "valida";

  return (
    <li className={`ticket ticket--${estado}`}>
      <div className="ticket__qr">
        <QRCodeSVG
          value={entrada.codigo}
          size={88}
          marginSize={2}
          bgColor="#ffffff"
          fgColor="#0d0d0d"
          title={`Código QR de la entrada ${entrada.codigo}`}
        />
      </div>
      <div className="ticket__info">
        <span className="ticket__label">Entrada {numero}</span>
        <span className="ticket__code">{entrada.codigo}</span>
        <span className="ticket__guest">{entrada.nombreInvitado}</span>
      </div>
      <span className="ticket__status">{ESTADOS[estado]}</span>
    </li>
  );
}

export default TicketCard;
