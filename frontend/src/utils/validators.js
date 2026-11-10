// Validaciones de cliente para los formularios. Dan feedback inmediato; el
// backend sigue siendo la fuente de verdad (vuelve a validar todo).
export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function isNonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0;
}

export function isValidEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export const MAX_ENTRADAS_POR_COMPRA = 6;
export const MAX_UNIDADES_POR_ITEM = 10;
export const MAX_MENSAJE_RECOMENDACION = 200;

export function validateDJForm({ nombre, generoMusical, biografia, cantidadLikes }) {
  const errors = {};

  if (!isNonEmptyString(nombre)) {
    errors.nombre = "El nombre es obligatorio.";
  }

  if (!isNonEmptyString(generoMusical)) {
    errors.generoMusical = "El género musical es obligatorio.";
  }

  if (biografia && biografia.length > 400) {
    errors.biografia = "La biografía no puede superar los 400 caracteres.";
  }

  if (cantidadLikes !== undefined && !isNonNegativeInteger(cantidadLikes)) {
    errors.cantidadLikes = "Debe ser un número entero mayor o igual a 0.";
  }

  return errors;
}

export function validateCompraForm({ nombre, email }) {
  const errors = {};

  if (!isNonEmptyString(nombre)) {
    errors.nombre = "El nombre es obligatorio.";
  }

  if (!isValidEmail(email)) {
    errors.email = "Ingresá un email válido.";
  }

  return errors;
}

export function validateRecomendacionForm({ tituloCancion, artista, mensaje }) {
  const errors = {};

  if (!isNonEmptyString(tituloCancion)) {
    errors.tituloCancion = "Decinos qué tema querés escuchar.";
  }

  if (!isNonEmptyString(artista)) {
    errors.artista = "El artista es obligatorio.";
  }

  if (mensaje && mensaje.length > MAX_MENSAJE_RECOMENDACION) {
    errors.mensaje = `El mensaje no puede superar los ${MAX_MENSAJE_RECOMENDACION} caracteres.`;
  }

  return errors;
}

// Formularios del panel de administración. Los números llegan ya convertidos
// (NaN cuando el campo quedó vacío).
export function validateEventoForm({ nombre, fecha, horaInicio, horaFin, capacidadMaxima, precio }) {
  const errors = {};

  if (!isNonEmptyString(nombre)) {
    errors.nombre = "El nombre es obligatorio.";
  }

  if (!fecha) {
    errors.fecha = "Elegí una fecha.";
  }

  if (!horaInicio) {
    errors.horaInicio = "Indicá la hora de inicio.";
  }

  if (!horaFin) {
    errors.horaFin = "Indicá la hora de cierre.";
  }

  if (!Number.isInteger(capacidadMaxima) || capacidadMaxima <= 0) {
    errors.capacidadMaxima = "Debe ser un número entero mayor a 0.";
  }

  if (!Number.isFinite(precio) || precio < 0) {
    errors.precio = "Debe ser un número mayor o igual a 0.";
  }

  return errors;
}

export function validateItemForm({ nombre, precio, categoria }) {
  const errors = {};

  if (!isNonEmptyString(nombre)) {
    errors.nombre = "El nombre es obligatorio.";
  }

  if (!Number.isFinite(precio) || precio < 0) {
    errors.precio = "Debe ser un número mayor o igual a 0.";
  }

  if (!isNonEmptyString(categoria)) {
    errors.categoria = "La categoría es obligatoria.";
  }

  return errors;
}
