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

// "disponible" | "ultimas" (queda el 20% o menos) | "agotado"
export function estadoCupo(evento) {
  if (evento.entradasDisponibles === 0) return "agotado";
  if (evento.entradasDisponibles / evento.capacidadMaxima <= 0.2) return "ultimas";
  return "disponible";
}
