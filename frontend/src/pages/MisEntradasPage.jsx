import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import FormField from "../components/ui/FormField.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import TicketCard from "../components/tickets/TicketCard.jsx";
import {
  cancelarReserva,
  emailRecordado,
  getReservasPorEmail,
  recordarEmail,
} from "../services/reservaService.js";
import { useToast } from "../context/ToastContext.jsx";
import { fechaHora, fechaLarga, formatPrecio, hoyISO } from "../utils/format.js";
import { isValidEmail } from "../utils/validators.js";
import "./MisEntradasPage.css";

// "Mis entradas": el cliente se identifica con el email de la compra y ve
// todas sus reservas, con el QR de cada entrada y la opción de cancelar.
function MisEntradasPage() {
  const toast = useToast();

  const [email, setEmail] = useState(emailRecordado);
  const [emailError, setEmailError] = useState("");
  const [consulta, setConsulta] = useState({ email: "", reservas: null, loading: false, error: null });
  const [pendingCancel, setPendingCancel] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const buscar = useCallback(async (emailBuscado) => {
    setConsulta((prev) => ({ ...prev, email: emailBuscado, loading: true, error: null }));

    try {
      const reservas = await getReservasPorEmail(emailBuscado);
      recordarEmail(emailBuscado);
      setConsulta({ email: emailBuscado, reservas, loading: false, error: null });
    } catch (err) {
      setConsulta({ email: emailBuscado, reservas: null, loading: false, error: err.message });
    }
  }, []);

  // Si este navegador ya compró antes, se muestran sus entradas sin pedir nada.
  useEffect(() => {
    const recordado = emailRecordado();
    if (isValidEmail(recordado)) buscar(recordado);
  }, [buscar]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isValidEmail(email)) {
      setEmailError("Ingresá un email válido.");
      return;
    }

    setEmailError("");
    buscar(email.trim().toLowerCase());
  };

  const handleConfirmCancel = async () => {
    setCancelLoading(true);

    try {
      await cancelarReserva(pendingCancel.idReserva, consulta.email);
      toast.success("Reserva cancelada. Las entradas volvieron a estar disponibles.");
      await buscar(consulta.email);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancelLoading(false);
      setPendingCancel(null);
    }
  };

  const { reservas, loading, error } = consulta;

  return (
    <div className="page container mis-entradas">
      <SectionHeading lead="Mis" highlight="entradas" level={1} />
      <p className="page__intro">
        Ingresá el email con el que compraste para ver tus entradas, mostrar el QR en la puerta o cancelar una
        reserva.
      </p>

      <form className="mis-entradas__form" onSubmit={handleSubmit} noValidate>
        <FormField
          id="mis-entradas-email"
          label="Email de la compra"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={emailError}
          autoComplete="email"
          required
        />
        <Button type="submit" loading={loading}>
          Buscar
        </Button>
      </form>

      <div aria-live="polite">
        {loading && !reservas && <Spinner label="Buscando tus entradas…" />}

        {error && (
          <p className="panel-state panel-state--error" role="alert">
            No pudimos buscar tus entradas: {error}
          </p>
        )}

        {reservas && reservas.length === 0 && (
          <div className="panel-state">
            <p>No hay compras hechas con {consulta.email}.</p>
            <Link to="/#entradas" className="btn btn--secondary">
              Ver la cartelera
            </Link>
          </div>
        )}

        {reservas && reservas.length > 0 && (
          <>
            <p className="mis-entradas__count">
              {reservas.length} {reservas.length === 1 ? "reserva" : "reservas"} de {consulta.email}
            </p>
            <ul className="mis-entradas__list">
              {reservas.map((reserva) => (
                <ReservaCard key={reserva.idReserva} reserva={reserva} onCancelar={setPendingCancel} />
              ))}
            </ul>
          </>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingCancel)}
        title="Cancelar reserva"
        description={
          pendingCancel
            ? `¿Seguro que querés cancelar tus ${pendingCancel.cantidadEntradas} entradas para ${pendingCancel.evento.nombre}? Los códigos dejan de ser válidos.`
            : ""
        }
        confirmLabel="Sí, cancelar"
        cancelLabel="Volver"
        loading={cancelLoading}
        onConfirm={handleConfirmCancel}
        onCancel={() => setPendingCancel(null)}
      />
    </div>
  );
}

function ReservaCard({ reserva, onCancelar }) {
  const cancelada = reserva.estado === "cancelada";
  const pasada = reserva.evento.fecha < hoyISO();
  const algunaUsada = reserva.entradas.some((entrada) => entrada.usada);
  const cancelable = !cancelada && !pasada && !algunaUsada;

  return (
    <li className={`reserva${cancelada ? " reserva--cancelada" : ""}`}>
      <header className="reserva__header">
        <div>
          <h2 className="reserva__title">
            <Link to={`/eventos/${reserva.evento.idEvento}`}>{reserva.evento.nombre}</Link>
          </h2>
          <p className="reserva__when">
            {fechaLarga(reserva.evento.fecha)} · {reserva.evento.horaInicio} a {reserva.evento.horaFin} hs
          </p>
        </div>
        <span className="reserva__status">{cancelada ? "Cancelada" : pasada ? "Finalizada" : "Confirmada"}</span>
      </header>

      <ul className="ticket-list" aria-label={`Entradas para ${reserva.evento.nombre}`}>
        {reserva.entradas.map((entrada, index) => (
          <TicketCard key={entrada.idEntrada} entrada={entrada} numero={index + 1} cancelada={cancelada} />
        ))}
      </ul>

      {reserva.pedido.length > 0 && (
        <div className="reserva__pedido">
          <h3>Pedido encargado</h3>
          <ul>
            {reserva.pedido.map((linea) => (
              <li key={linea.idItem}>
                <span>
                  {linea.cantidad} × {linea.nombre}
                </span>
                <span>{formatPrecio(linea.precio * linea.cantidad)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <footer className="reserva__footer">
        <p>
          Reserva #{reserva.idReserva} · {fechaHora(reserva.fechaReserva)} · Total{" "}
          <strong>{formatPrecio(reserva.total)}</strong>
        </p>
        {cancelable && (
          <Button variant="danger" onClick={() => onCancelar(reserva)}>
            Cancelar reserva
          </Button>
        )}
      </footer>
    </li>
  );
}

export default MisEntradasPage;
