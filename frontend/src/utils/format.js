// Fechas y precios de los eventos. La API manda la fecha como "AAAA-MM-DD";
// se arma con componentes locales (no con new Date(string)) para que la zona
// horaria no corra el día.
function parseFecha(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function hoyISO() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function partesFecha(iso) {
  const date = parseFecha(iso);

  return {
    dia: String(date.getDate()).padStart(2, "0"),
    mes: date.toLocaleDateString("es-AR", { month: "short" }).replace(".", ""),
    diaSemana: date.toLocaleDateString("es-AR", { weekday: "long" }),
  };
}

export function fechaLarga(iso) {
  return parseFecha(iso).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
}

export function formatPrecio(value) {
  return value.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

// Fecha "AAAA-MM-DD" de acá a N días (para filtrar la cartelera por período).
export function fechaEnDias(dias) {
  const date = new Date();
  date.setDate(date.getDate() + dias);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// Fecha y hora de una compra (llega como ISO completo, ej. "2026-11-10T02:29:00.000Z").
export function fechaHora(isoDateTime) {
  return new Date(isoDateTime).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });
}

// Link para escuchar un tema: búsqueda en Spotify por título y artista.
export function spotifyUrl({ titulo, artista }) {
  return `https://open.spotify.com/search/${encodeURIComponent(`${titulo} ${artista}`)}`;
}

// "disponible" | "ultimas" (queda el 20% o menos) | "agotado"
export function estadoCupo(evento) {
  if (evento.entradasDisponibles === 0) return "agotado";
  if (evento.entradasDisponibles / evento.capacidadMaxima <= 0.2) return "ultimas";
  return "disponible";
}
