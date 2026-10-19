// Horario fijo del local (contenido estático del sitio, no un recurso de
// la API). Vive en un solo lugar porque lo usan tanto el panel de "Entrada"
// como el pie de página.
export const HORARIOS = [
  { dias: "Lunes y martes", horario: "Cerrado" },
  { dias: "Miércoles y jueves", horario: "19:00 a 01:00" },
  { dias: "Viernes", horario: "19:00 a 02:00" },
  { dias: "Sábado", horario: "19:00 a 03:00" },
  { dias: "Domingo", horario: "18:30 a 03:00" },
];
