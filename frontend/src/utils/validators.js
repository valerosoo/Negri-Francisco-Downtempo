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
