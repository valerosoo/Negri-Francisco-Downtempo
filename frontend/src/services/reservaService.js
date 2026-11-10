import { del, post, request } from "./api.js";

const RESOURCE = "/reservas";
const EMAIL_KEY = "downtempo:email";

// Compra simulada de entradas: { idEvento, cantidadEntradas, nombre, email, pedido? }.
// Devuelve la reserva con sus entradas (cada una con su código) y el total.
export function createReserva(data) {
  return post(RESOURCE, data);
}

// "Mis entradas": todas las reservas hechas con ese email.
export function getReservasPorEmail(email) {
  return request(`${RESOURCE}?email=${encodeURIComponent(email)}`);
}

export function cancelarReserva(idReserva, email) {
  return del(`${RESOURCE}/${idReserva}?email=${encodeURIComponent(email)}`);
}

// El último email usado queda guardado en este navegador para no volver a
// tipearlo en "Mis entradas". Si el storage no está disponible, no pasa nada.
export function recordarEmail(email) {
  try {
    localStorage.setItem(EMAIL_KEY, email);
  } catch {
    // Navegación privada o storage bloqueado.
  }
}

export function emailRecordado() {
  try {
    return localStorage.getItem(EMAIL_KEY) ?? "";
  } catch {
    return "";
  }
}
