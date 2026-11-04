import { request } from "./api.js";

// Compra simulada de entradas: { idEvento, cantidadEntradas, nombre, email }.
// Devuelve la reserva con sus entradas (cada una con su código) y el total.
export function createReserva(data) {
  return request("/reservas", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
