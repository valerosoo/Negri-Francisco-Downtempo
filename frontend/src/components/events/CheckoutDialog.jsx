import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button.jsx";
import FormField from "../ui/FormField.jsx";
import Modal from "../ui/Modal.jsx";
import Stepper from "../ui/Stepper.jsx";
import TicketCard from "../tickets/TicketCard.jsx";
import { createReserva, emailRecordado, recordarEmail } from "../../services/reservaService.js";
import { getMenu } from "../../services/menuService.js";
import { useAsync } from "../../utils/useAsync.js";
import { useToast } from "../../context/ToastContext.jsx";
import { fechaLarga, formatPrecio } from "../../utils/format.js";
import { validateCompraForm, MAX_ENTRADAS_POR_COMPRA, MAX_UNIDADES_POR_ITEM } from "../../utils/validators.js";
import "./CheckoutDialog.css";

// Compra simulada en dos pasos dentro de un modal: formulario → entradas con
// código y QR. No se cobra nada; el backend descuenta el cupo y genera los
// códigos. Opcionalmente se puede dejar encargado un pedido del menú.
function CheckoutDialog({ evento, onClose, onPurchased }) {
  const toast = useToast();
  const { data: menu } = useAsync(getMenu, []);

  const [cantidad, setCantidad] = useState(1);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState(emailRecordado);
  const [pedido, setPedido] = useState({}); // { [idItem]: cantidad }
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [reserva, setReserva] = useState(null);

  const maxEntradas = Math.min(MAX_ENTRADAS_POR_COMPRA, evento.entradasDisponibles);
  const lineas = (menu ?? []).filter((item) => pedido[item.idItem] > 0);
  const unidadesPedido = lineas.reduce((suma, item) => suma + pedido[item.idItem], 0);
  const totalPedido = lineas.reduce((suma, item) => suma + item.precio * pedido[item.idItem], 0);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const found = validateCompraForm({ nombre, email });
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);

    try {
      const result = await createReserva({
        idEvento: evento.idEvento,
        cantidadEntradas: cantidad,
        nombre: nombre.trim(),
        email: email.trim(),
        pedido: lineas.map((item) => ({ idItem: item.idItem, cantidad: pedido[item.idItem] })),
      });
      recordarEmail(result.email);
      setReserva(result);
      onPurchased();
    } catch (err) {
      toast.error(err.message);
      // Si se agotó el cupo mientras compraba, refrescamos la cartelera.
      onPurchased();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose} labelledBy="checkout-title" className="checkout">
      {reserva ? (
        <Confirmacion reserva={reserva} onClose={onClose} />
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <p className="eyebrow">Comprar entradas</p>
          <h3 id="checkout-title" className="checkout__title">
            {evento.nombre}
          </h3>
          <p className="checkout__when">
            {fechaLarga(evento.fecha)} · {evento.horaInicio} a {evento.horaFin} hs
          </p>

          <div className="checkout__qty">
            <span>Cantidad</span>
            <Stepper value={cantidad} min={1} max={maxEntradas} onChange={setCantidad} label="entradas" />
            <span className="checkout__stock">{evento.entradasDisponibles} disponibles</span>
          </div>

          <FormField
            id="checkout-nombre"
            label="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            error={errors.nombre}
            autoComplete="name"
            required
            data-autofocus
          />
          <FormField
            id="checkout-email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            hint="Con este email vas a poder ver y cancelar tus entradas."
            autoComplete="email"
            required
          />

          {menu && menu.length > 0 && (
            <details className="checkout__preorder">
              <summary>
                Dejá tu pedido encargado <span>(opcional)</span>
                {unidadesPedido > 0 && <strong>{unidadesPedido}</strong>}
              </summary>
              <p className="checkout__note">Lo retirás en la barra la noche del evento, sin hacer fila.</p>
              <ul className="checkout__menu">
                {menu.map((item) => (
                  <li key={item.idItem}>
                    <div>
                      <span className="checkout__menu-name">{item.nombre}</span>
                      <span className="checkout__menu-meta">
                        {item.categoria} · {formatPrecio(item.precio)}
                      </span>
                    </div>
                    <Stepper
                      value={pedido[item.idItem] ?? 0}
                      max={MAX_UNIDADES_POR_ITEM}
                      onChange={(value) => setPedido((prev) => ({ ...prev, [item.idItem]: value }))}
                      label={item.nombre}
                    />
                  </li>
                ))}
              </ul>
            </details>
          )}

          <dl className="checkout__summary">
            <div>
              <dt>
                {cantidad} {cantidad === 1 ? "entrada" : "entradas"}
              </dt>
              <dd>{formatPrecio(evento.precio * cantidad)}</dd>
            </div>
            {unidadesPedido > 0 && (
              <div>
                <dt>Pedido ({unidadesPedido})</dt>
                <dd>{formatPrecio(totalPedido)}</dd>
              </div>
            )}
            <div className="checkout__total">
              <dt>Total</dt>
              <dd aria-live="polite">{formatPrecio(evento.precio * cantidad + totalPedido)}</dd>
            </div>
          </dl>

          <Button type="submit" loading={submitting}>
            Confirmar compra
          </Button>
          <p className="checkout__note">Compra simulada: no se realiza ningún cobro.</p>
        </form>
      )}
    </Modal>
  );
}

function Confirmacion({ reserva, onClose }) {
  const titleRef = useRef(null);

  // El formulario desaparece al confirmar: llevamos el foco al título para
  // que no se pierda y los lectores de pantalla anuncien el resultado.
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  return (
    <div>
      <p className="eyebrow">¡Listo!</p>
      <h3 id="checkout-title" className="checkout__title" ref={titleRef} tabIndex={-1}>
        Tus entradas para {reserva.evento.nombre}
      </h3>
      <p className="checkout__when">
        {fechaLarga(reserva.evento.fecha)} · {reserva.evento.horaInicio} hs · {reserva.nombreCliente}
      </p>

      <ul className="ticket-list" aria-label="Entradas compradas">
        {reserva.entradas.map((entrada, index) => (
          <TicketCard key={entrada.idEntrada} entrada={entrada} numero={index + 1} />
        ))}
      </ul>

      <dl className="checkout__summary">
        {reserva.pedido.map((linea) => (
          <div key={linea.idItem}>
            <dt>
              {linea.cantidad} × {linea.nombre}
            </dt>
            <dd>{formatPrecio(linea.precio * linea.cantidad)}</dd>
          </div>
        ))}
        <div className="checkout__total">
          <dt>Total</dt>
          <dd>{formatPrecio(reserva.total)}</dd>
        </div>
      </dl>
      <p className="checkout__note">
        Mostrá el QR o el código en la puerta. Los vas a encontrar siempre en “Mis entradas” con el email{" "}
        {reserva.email}.
      </p>

      <div className="checkout__actions">
        <Button onClick={onClose}>
          Listo
        </Button>
        <Link to="/mis-entradas" className="btn btn--secondary" onClick={onClose}>
          Ver mis entradas
        </Link>
      </div>
    </div>
  );
}

export default CheckoutDialog;
