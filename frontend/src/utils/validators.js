export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function isNonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0;
}

// Validación de cliente para el formulario de DJ. Da feedback inmediato;
// el backend sigue siendo la fuente de verdad (vuelve a validar todo).
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

export const MAX_ENTRADAS_POR_COMPRA = 6;

export function isValidEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

// Validación de cliente para el formulario de compra de entradas. El backend
// vuelve a validar todo (cupo, evento vigente, etc.).
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
