import { useState } from "react";
import Button from "../ui/Button.jsx";
import FormField from "../ui/FormField.jsx";
import Spinner from "../ui/Spinner.jsx";
import { adminApi } from "../../services/adminService.js";
import { useAsync } from "../../utils/useAsync.js";
import { fechaHora, fechaLarga, formatPrecio } from "../../utils/format.js";

// Control de puerta (validar un código) y listado de todas las ventas.
function AdminEntradas({ run }) {
  // Pasa por run() para que una clave vencida o incorrecta cierre la sesión.
  const reservas = useAsync(() => run(adminApi.getReservas), []);

  const [codigo, setCodigo] = useState("");
  const [validando, setValidando] = useState(false);
  const [resultado, setResultado] = useState(null); // { ok, mensaje, entrada? }

  const handleValidar = async (event) => {
    event.preventDefault();
    if (!codigo.trim()) return;

    setValidando(true);

    try {
      const entrada = await run(() => adminApi.validarEntrada(codigo.trim()));
      setResultado({ ok: true, mensaje: "Entrada válida. ¡Que pase!", entrada });
      setCodigo("");
      reservas.reload();
    } catch (err) {
      setResultado({ ok: false, mensaje: err.message });
    } finally {
      setValidando(false);
    }
  };

  const confirmadas = (reservas.data ?? []).filter((reserva) => reserva.estado === "confirmada");
  const entradasVendidas = confirmadas.reduce((suma, reserva) => suma + reserva.cantidadEntradas, 0);
  const recaudacion = confirmadas.reduce((suma, reserva) => suma + reserva.total, 0);

  return (
    <div className="admin-entradas">
      <section aria-label="Control de puerta">
        <h2 className="admin__subtitle">Control de puerta</h2>
        <form className="admin-entradas__form" onSubmit={handleValidar}>
          <FormField
            id="validar-codigo"
            label="Código de la entrada"
            value={codigo}
            onChange={(event) => setCodigo(event.target.value.toUpperCase())}
            placeholder="DT-XXXXXX"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck="false"
          />
          <Button type="submit" loading={validando}>
            Validar
          </Button>
        </form>

        <div aria-live="assertive">
          {resultado && (
            <div className={`admin-entradas__result admin-entradas__result--${resultado.ok ? "ok" : "error"}`}>
              <strong>{resultado.mensaje}</strong>
              {resultado.entrada && (
                <p>
                  {resultado.entrada.codigo} · {resultado.entrada.nombreInvitado} · {resultado.entrada.evento.nombre}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      <section aria-label="Ventas">
        <h2 className="admin__subtitle">Ventas</h2>

        {reservas.loading && !reservas.data && <Spinner />}

        {reservas.error && (
          <p className="panel-state panel-state--error" role="alert">
            {reservas.error}
          </p>
        )}

        {reservas.data && (
          <>
            <dl className="admin-stats">
              <div>
                <dt>Reservas confirmadas</dt>
                <dd>{confirmadas.length}</dd>
              </div>
              <div>
                <dt>Entradas vendidas</dt>
                <dd>{entradasVendidas}</dd>
              </div>
              <div>
                <dt>Recaudación</dt>
                <dd>{formatPrecio(recaudacion)}</dd>
              </div>
            </dl>

            {reservas.data.length === 0 ? (
              <p className="admin__empty">Todavía no hay ventas.</p>
            ) : (
              <div className="admin-table__scroll">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Cliente</th>
                      <th scope="col">Evento</th>
                      <th scope="col">Entradas</th>
                      <th scope="col">Total</th>
                      <th scope="col">Estado</th>
                      <th scope="col">Compra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservas.data.map((reserva) => (
                      <tr key={reserva.idReserva}>
                        <td>{reserva.idReserva}</td>
                        <td>
                          {reserva.nombreCliente}
                          <small>{reserva.email}</small>
                        </td>
                        <td>
                          {reserva.evento.nombre}
                          <small>{fechaLarga(reserva.evento.fecha)}</small>
                        </td>
                        <td>
                          {reserva.entradas.filter((entrada) => entrada.usada).length} / {reserva.cantidadEntradas}{" "}
                          usadas
                          <small>{reserva.entradas.map((entrada) => entrada.codigo).join(" · ")}</small>
                        </td>
                        <td>{formatPrecio(reserva.total)}</td>
                        <td className={`admin-table__estado admin-table__estado--${reserva.estado}`}>
                          {reserva.estado}
                        </td>
                        <td>{fechaHora(reserva.fechaReserva)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default AdminEntradas;
