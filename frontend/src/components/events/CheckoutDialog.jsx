import { useEffect, useRef, useState } from "react";
import Button from "../ui/Button.jsx";
import FormField from "../ui/FormField.jsx";
import { createReserva } from "../../services/reservaService.js";
import { useToast } from "../../context/ToastContext.jsx";
import { fechaLarga, formatPrecio } from "../../utils/format.js";
import { validateCompraForm, MAX_ENTRADAS_POR_COMPRA } from "../../utils/validators.js";
import "./CheckoutDialog.css";

// Compra simulada en dos pasos dentro de un modal: formulario → entradas con
// código. No se cobra nada; el backend descuenta el cupo y genera los códigos.
function CheckoutDialog({ evento, onClose, onPurchased }) {
  const toast = useToast();
  const closeRef = useRef(null);

  const [cantidad, setCantidad] = useState(1);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [reserva, setReserva] = useState(null);

  const maxEntradas = Math.min(MAX_ENTRADAS_POR_COMPRA, evento.entradasDisponibles);

  useEffect(() => {
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
      });
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
    <div className="checkout__overlay" onClick={onClose}>
      <div
        className="checkout"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button ref={closeRef} type="button" className="checkout__close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>

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
              <span id="qty-label">Cantidad</span>
              <div className="checkout__stepper" role="group" aria-labelledby="qty-label">
                <button
                  type="button"
                  onClick={() => setCantidad((n) => Math.max(1, n - 1))}
                  disabled={cantidad <= 1}
                  aria-label="Una entrada menos"
                >
                  −
                </button>
                <output aria-live="polite">{cantidad}</output>
                <button
                  type="button"
                  onClick={() => setCantidad((n) => Math.min(maxEntradas, n + 1))}
                  disabled={cantidad >= maxEntradas}
                  aria-label="Una entrada más"
                >
                  +
                </button>
              </div>
              <span className="checkout__stock">{evento.entradasDisponibles} disponibles</span>
            </div>

            <FormField
              id="checkout-nombre"
              label="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              error={errors.nombre}
              autoComplete="name"
            />
            <FormField
              id="checkout-email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              hint="Ahí te mandamos tus entradas."
              autoComplete="email"
            />

            <div className="checkout__total">
              <span>Total</span>
              <strong>{formatPrecio(evento.precio * cantidad)}</strong>
            </div>

            <Button type="submit" loading={submitting}>
              Confirmar compra
            </Button>
            <p className="checkout__note">Compra simulada: no se realiza ningún cobro.</p>
          </form>
        )}
      </div>
    </div>
  );
}

function Confirmacion({ reserva, onClose }) {
  return (
    <div>
      <p className="eyebrow">¡Listo!</p>
      <h3 id="checkout-title" className="checkout__title">
        Tus entradas para {reserva.evento.nombre}
      </h3>
      <p className="checkout__when">
        {fechaLarga(reserva.evento.fecha)} · {reserva.evento.horaInicio} hs · {reserva.nombreCliente}
      </p>

      <ul className="checkout__tickets" aria-label="Entradas compradas">
        {reserva.entradas.map((entrada, index) => (
          <li key={entrada.idEntrada} className="ticket">
            <span className="ticket__label">Entrada {index + 1}</span>
            <span className="ticket__code">{entrada.codigo}</span>
          </li>
        ))}
      </ul>

      <div className="checkout__total">
        <span>Total</span>
        <strong>{formatPrecio(reserva.total)}</strong>
      </div>
      <p className="checkout__note">Presentá el código en la puerta. Enviamos una copia a {reserva.email}.</p>

      <Button onClick={onClose}>Listo</Button>
    </div>
  );
}

export default CheckoutDialog;
